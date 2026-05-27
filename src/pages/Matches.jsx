import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Matches({ user }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMatches() }, [])

  async function loadMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*, vacancies(title, salary_from, company)')
      .or(`candidate_id.eq.${user.id},employer_id.eq.${user.id}`)
    setMatches(data || [])
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--paper)' }}>
      <div style={{ fontFamily:'Newsreader, serif', fontSize:32, color:'var(--ink)' }}>Загрузка...</div>
    </div>
  )

  return (
    <div style={{ background:'var(--paper)', minHeight:'100vh' }}>
      <div className="tg-header">
        <div style={{ width:40 }}/>
        <div className="tg-title">
          <div className="tg-title-name">Отклики</div>
          <div className="tg-title-sub">{matches.length} активных</div>
        </div>
        <div style={{ width:40 }}/>
      </div>

      <div className="matches__statsRow">
        <div className="matches__stat">
          <div className="matches__statNum">{matches.length}</div>
          <div className="matches__statLabel">всего откликов</div>
        </div>
        <div className="matches__statDivider"/>
        <div className="matches__stat">
          <div className="matches__statNum matches__statNum--accent">
            {matches.filter(m => m.status === 'new').length || matches.length}
          </div>
          <div className="matches__statLabel">новых</div>
        </div>
      </div>

      <div className="matches__list">
        {matches.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48 }}>👀</div>
            <div style={{ fontFamily:'Newsreader, serif', fontSize:22, color:'var(--ink)', marginTop:16 }}>Пока мэтчей нет</div>
            <div style={{ fontSize:14, color:'var(--ink-2)', marginTop:8 }}>Свайпай вакансии — находи своих</div>
          </div>
        ) : matches.map(m => (
          <div key={m.id} className="matches__row">
            <div className="matches__logo" style={{ background:'var(--accent)', color:'#fff' }}>
              {m.vacancies?.company?.[0] || '?'}
            </div>
            <div className="matches__rowBody">
              <div className="matches__rowTitle">{m.vacancies?.title}</div>
              <div className="matches__rowCompany">{m.vacancies?.company}</div>
              <div className="matches__rowStatus">
                <span className="matches__statusDot matches__statusDot--success"/>
                <span>Мэтч! Можно общаться</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:68 }}/>
    </div>
  )
}