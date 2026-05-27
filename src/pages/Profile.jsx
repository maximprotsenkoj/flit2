import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Profile({ user, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [salary, setSalary] = useState(user.salary_from || '')
  const [format, setFormat] = useState(user.work_format || '')
  const [skills, setSkills] = useState(user.skills || [])
  const [loading, setLoading] = useState(false)

  const SKILLS = ['React','Python','Design','Marketing','Sales','HR','Finance','iOS','Android','DevOps','Data','Product']

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function save() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .update({ salary_from: parseInt(salary) || 0, work_format: format, skills })
      .eq('id', user.id)
      .select()
      .single()
    if (data) onUpdate({ ...data, name: user.name, username: user.username, photo_url: user.photo_url })
    setEditing(false)
    setLoading(false)
  }

  const avatar = user.name?.[0]?.toUpperCase() || '?'
  const formatLabel = { remote:'🏠 Удалёнка', hybrid:'🔀 Гибрид', office:'🏢 Офис' }
  const photoUrl = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url

  return (
    <div style={{ background:'var(--paper)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="tg-header">
        <div style={{ width:40 }}/>
        <div className="tg-title">
          <div className="tg-title-name">Профиль</div>
          <div className="tg-title-sub">@{user.username || 'telegram'}</div>
        </div>
        <button onClick={() => setEditing(!editing)} style={{
          width:40, height:40, border:'0.5px solid var(--line)',
          borderRadius:10, background:'transparent', cursor:'pointer',
          fontSize:13, color:'var(--ink)', fontFamily:'inherit'
        }}>
          {editing ? '✕' : '✏️'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ padding:'32px 24px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        {photoUrl ? (
          <img src={photoUrl} alt={user.name}
            style={{ width:84, height:84, borderRadius:'50%', objectFit:'cover', border:'2px solid var(--line)' }}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='grid' }}
          />
        ) : null}
        <div style={{
          width:84, height:84, borderRadius:'50%',
          background:'var(--ink)', color:'var(--paper)',
          display: photoUrl ? 'none' : 'grid', placeItems:'center',
          fontFamily:'Newsreader, Georgia, serif',
          fontSize:32, letterSpacing:'-1px'
        }}>{avatar}</div>

        <div style={{
          marginTop:12, fontFamily:'Newsreader, Georgia, serif',
          fontSize:26, fontWeight:400, letterSpacing:'-0.5px', color:'var(--ink)'
        }}>{user.name}</div>
        <div style={{ marginTop:4, fontSize:13, color:'var(--ink-2)' }}>
          {user.role === 'candidate' ? 'Соискатель' : 'Работодатель'}
        </div>
        {user.username && (
          <div style={{
            marginTop:8, display:'flex', alignItems:'center', gap:6,
            padding:'6px 14px', borderRadius:99,
            background:'rgba(31,77,58,0.08)', color:'var(--accent)',
            fontSize:13, fontWeight:500
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.01.38z" fill="currentColor"/>
            </svg>
            @{user.username}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        margin:'0 16px', background:'#FFFCF7',
        border:'0.5px solid var(--line)', borderRadius:16,
        padding:'14px 8px', display:'flex', alignItems:'center'
      }}>
        {[
          { num: user.salary_from ? `${(user.salary_from/1000).toFixed(0)}к` : '—', label:'зарплата' },
          { num: (user.skills?.length || 0), label:'навыков' },
          { num: formatLabel[user.work_format]?.split(' ')[1] || '—', label:'формат' },
        ].map((s, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? '0.5px solid var(--line)' : 'none' }}>
            <div style={{ fontFamily:'Newsreader, serif', fontSize:22, color:'var(--ink)', letterSpacing:'-0.5px' }}>{s.num}</div>
            <div style={{ marginTop:4, fontSize:11, color:'var(--ink-3)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!editing ? (
        <>
          <div style={{ margin:'20px 16px 0', display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { label:'Зарплата', value: user.salary_from ? `от ${user.salary_from.toLocaleString()} ₽` : 'Не указана' },
              { label:'Формат', value: formatLabel[user.work_format] || 'Не указан' },
            ].map(item => (
              <div key={item.label} style={{
                background:'#FFFCF7', border:'0.5px solid var(--line)',
                borderRadius:14, padding:'14px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'center'
              }}>
                <span style={{ fontSize:14, color:'var(--ink-2)' }}>{item.label}</span>
                <span style={{ fontSize:14, fontWeight:600, color:'var(--ink)' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {user.skills?.length > 0 && (
            <div style={{ margin:'20px 16px 0' }}>
              <div style={{ fontSize:11, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:10 }}>Навыки</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {user.skills.map(s => (
                  <span key={s} className="vc__skill">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ margin:'24px 16px 0', padding:'16px', background:'rgba(31,77,58,0.06)', borderRadius:16, border:'0.5px solid rgba(31,77,58,0.12)' }}>
            <div style={{ fontSize:12, color:'var(--accent)', fontWeight:600, marginBottom:4 }}>✓ Авторизован через Telegram</div>
            <div style={{ fontSize:13, color:'var(--ink-2)' }}>Работодатели могут написать тебе напрямую после мэтча.</div>
          </div>

          <button onClick={() => setEditing(true)} style={{
            margin:'16px 16px 0', width:'calc(100% - 32px)',
            padding:18, background:'var(--ink)', color:'var(--paper)',
            border:0, borderRadius:16, fontSize:15, fontWeight:600,
            cursor:'pointer', fontFamily:'inherit'
          }}>Редактировать профиль</button>
        </>
      ) : (
        <div style={{ padding:'20px 16px' }}>
          <div style={{ fontSize:11, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:10 }}>Зарплата</div>
          <input className="onboard__input" value={salary}
            onChange={e => setSalary(e.target.value)}
            placeholder="от 150 000 ₽"
          />

          <div style={{ fontSize:11, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:10, marginTop:16 }}>Формат работы</div>
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {[{id:'remote',label:'🏠 Удалёнка'},{id:'hybrid',label:'🔀 Гибрид'},{id:'office',label:'🏢 Офис'}].map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)} style={{
                flex:1, padding:'10px 4px', borderRadius:12, border:'0.5px solid',
                borderColor: format === f.id ? 'var(--accent)' : 'var(--line)',
                background: format === f.id ? 'rgba(31,77,58,0.08)' : '#FFFCF7',
                color: format === f.id ? 'var(--accent)' : 'var(--ink)',
                fontSize:12, cursor:'pointer', fontFamily:'inherit'
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ fontSize:11, letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:10 }}>Навыки</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {SKILLS.map(s => (
              <button key={s} className={'onboard__chip' + (skills.includes(s) ? ' onboard__chip--on' : '')}
                onClick={() => toggleSkill(s)}>{s}</button>
            ))}
          </div>

          <button onClick={save} disabled={loading} style={{
            width:'100%', padding:18, background:'var(--ink)', color:'var(--paper)',
            border:0, borderRadius:16, fontSize:15, fontWeight:600,
            cursor:'pointer', fontFamily:'inherit'
          }}>{loading ? 'Сохраняем...' : 'Сохранить'}</button>
        </div>
      )}
    </div>
  )
}