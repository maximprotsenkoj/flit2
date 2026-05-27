import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const PATTERNS = {
  geo: (fg) => (
    <svg viewBox="0 0 400 180" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <circle cx="380" cy="40" r="120" fill={fg} opacity="0.10"/>
      <circle cx="80" cy="160" r="90" fill={fg} opacity="0.06"/>
    </svg>
  ),
  dots: (fg) => (
    <svg viewBox="0 0 400 180" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      {Array.from({length:6}).map((_,r) => Array.from({length:14}).map((__,c) => (
        <circle key={r+'_'+c} cx={c*28+10} cy={r*28+10} r="2.5" fill={fg} opacity="0.18"/>
      )))}
    </svg>
  ),
  wave: (fg) => (
    <svg viewBox="0 0 400 180" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <path d="M0,120 C100,80 200,160 400,90 L400,180 L0,180 Z" fill={fg} opacity="0.10"/>
      <path d="M0,140 C120,110 240,170 400,130 L400,180 L0,180 Z" fill={fg} opacity="0.07"/>
    </svg>
  ),
}

function VacancyCard({ v, decision }) {
  const pattern = PATTERNS[v.pattern] || PATTERNS.geo
  const fg = v.coverFg || '#ffffff'

  return (
    <div className="vc">
      <div className={'vc__stamp vc__stamp--yes' + (decision === 'right' ? ' is-on' : '')}>ОТКЛИК</div>
      <div className={'vc__stamp vc__stamp--no' + (decision === 'left' ? ' is-on' : '')}>ПРОПУСК</div>

      <div className="vc__hdr">
        <div className="vc__logo" style={{ background: v.logoBg || '#1F4D3A', color: v.logoFg || '#fff' }}>
          {v.company?.[0] || '?'}
        </div>
        <div style={{ flex: 1 }}>
          <div className="vc__company">{v.company || 'Компания'}</div>
          <div className="vc__hdr-sub">
            <span>★ {v.saved || '—'}</span>
            <span className="vc__dot"/>
            <span>{v.posted || 'сегодня'}</span>
          </div>
        </div>
      </div>

      <div className="vc__cover" style={{ background: `linear-gradient(135deg, ${v.coverFrom || '#1F4D3A'} 0%, ${v.coverTo || '#0f2818'} 100%)`, color: fg }}>
        {pattern(fg)}
        <div className="vc__cover-mark" style={{ color: fg }}>{v.company?.[0]}</div>
        <div className="vc__cover-badge">
          <span className="vc__cover-badge-dot"/>
          нанимает сейчас
        </div>
      </div>

      <div className="vc__body">
        <h2 className="vc__title">{v.title}</h2>
        <div className="vc__loc">
          <span>{v.location || 'Россия'}</span>
          <span className="vc__dot"/>
          <span>{v.work_format === 'remote' ? 'Удалённо' : v.work_format === 'office' ? 'Офис' : 'Гибрид'}</span>
        </div>
        <div className="vc__salary">
          <div className="vc__salary-amt">
            {v.salary_from ? `от ${v.salary_from.toLocaleString()} ₽` : 'Зарплата не указана'}
          </div>
          <div className="vc__salary-note">/месяц на руки</div>
        </div>
        <div className="vc__chips">
          {v.skills?.slice(0,3).map(s => <span key={s} className="vc__chip">{s}</span>)}
        </div>
        {v.about_team && <p className="vc__tagline">{v.about_team}</p>}
      </div>
    </div>
  )
}

export default function Feed({ user }) {
  const [vacancies, setVacancies] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const [exiting, setExiting] = useState(null)
  const startRef = useRef({ x: 0, y: 0 })

  useEffect(() => { loadVacancies() }, [])

  async function loadVacancies() {
    const { data } = await supabase.from('vacancies').select('*').limit(20)
    setVacancies(data || [])
    setLoading(false)
  }

  async function doSwipe(dir, vacancy) {
    if (!vacancy) return
    await supabase.from('swipes').insert({ user_id: user.id, vacancy_id: vacancy.id, direction: dir })
  }

  const down = (e) => {
    const p = 'touches' in e ? e.touches[0] : e
    startRef.current = { x: p.clientX, y: p.clientY }
    setDrag({ x: 0, y: 0, active: true })
  }
  const move = (e) => {
    if (!drag.active) return
    const p = 'touches' in e ? e.touches[0] : e
    setDrag({ x: p.clientX - startRef.current.x, y: p.clientY - startRef.current.y, active: true })
  }
  const up = () => {
    if (!drag.active) return
    const { x } = drag
    if (Math.abs(x) > 100) trigger(x > 0 ? 'right' : 'left')
    else setDrag({ x: 0, y: 0, active: false })
  }

  const trigger = (dir) => {
    if (exiting) return
    const exitX = dir === 'right' ? 600 : -600
    setExiting({ dir, x: exitX, y: drag.y || 0 })
    const vacancy = vacancies[index]
    setTimeout(() => {
      setIndex(i => i + 1)
      setExiting(null)
      setDrag({ x: 0, y: 0, active: false })
      doSwipe(dir, vacancy)
    }, 280)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--paper)' }}>
      <div style={{ fontFamily:'Newsreader, serif', fontSize:48, color:'var(--ink)' }}>flit.</div>
    </div>
  )

  const vacancy = vacancies[index % Math.max(vacancies.length, 1)]
  const nextVacancy = vacancies[(index + 1) % Math.max(vacancies.length, 1)]

  const decision = exiting ? exiting.dir : drag.x > 50 ? 'right' : drag.x < -50 ? 'left' : null

  if (!vacancies.length) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--paper)', gap:16 }}>
      <div style={{ fontSize:48 }}>🎉</div>
      <div style={{ fontFamily:'Newsreader, serif', fontSize:24, color:'var(--ink)' }}>Вакансии закончились</div>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--paper)' }}>
      <div className="tg-header">
        <div style={{ width:40 }}/>
        <div className="tg-title">
          <div className="tg-title-name">flit.</div>
          <div className="tg-title-sub">вакансии для тебя</div>
        </div>
        <div style={{ width:40 }}/>
      </div>

      <div className="feedfilters">
        <div className="feedfilters__btn">
          <div className="feedfilters__icon">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="feedfilters__btn-text">
            <div className="feedfilters__btn-title">Подбор</div>
            <div className="feedfilters__btn-sub">Все форматы · любая зарплата</div>
          </div>
        </div>
      </div>

      <div className="screen__deckhost">
        <div className="deck-wrap">
          <div className="deck"
            onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
            onTouchStart={down} onTouchMove={move} onTouchEnd={up}>

            {nextVacancy && (
              <div className="deck__card" style={{ transform:'scale(0.96) translateY(8px)', zIndex:1 }}>
                <VacancyCard v={nextVacancy} decision={null}/>
              </div>
            )}

            {vacancy && (
              <div className={'deck__card' + (exiting ? ' is-exiting' : '') + (drag.active ? ' is-dragging' : '')}
                style={{ transform:`translate(${exiting ? exiting.x : drag.x}px, ${exiting ? exiting.y : drag.y}px) rotate(${(exiting ? exiting.x : drag.x) * 0.04}deg)`, zIndex:10 }}>
                <VacancyCard v={vacancy} decision={decision}/>
              </div>
            )}

            <div className="deck__actions">
              <button className="actbtn actbtn--skip" onClick={() => trigger('left')}>
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="actbtn actbtn--like" onClick={() => trigger('right')}>
                <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height:68 }}/>
    </div>
  )
}