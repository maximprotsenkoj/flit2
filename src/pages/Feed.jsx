import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Feed({ user }) {
  const [vacancies, setVacancies] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadVacancies() }, [])

  async function loadVacancies() {
    const { data } = await supabase.from('vacancies').select('*').limit(20)
    setVacancies(data || [])
    setLoading(false)
  }

  async function swipe(direction) {
    const vacancy = vacancies[index]
    if (!vacancy) return
    await supabase.from('swipes').insert({ user_id: user.id, vacancy_id: vacancy.id, direction })
    setIndex(i => i + 1)
  }

  if (loading) return <div style={{ padding:24, color:'#888', background:'#0f0f0f', minHeight:'100vh' }}>Загружаем...</div>

  const vacancy = vacancies[index]

  if (!vacancy) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#888', background:'#0f0f0f' }}>
      <div style={{ fontSize:48 }}>🎉</div>
      <p style={{ marginTop:16 }}>Вакансии закончились</p>
    </div>
  )

  return (
    <div style={{ padding:16, background:'#0f0f0f', minHeight:'100vh' }}>
      <h2 style={{ color:'#fff', marginBottom:16, fontSize:20 }}>🔥 Вакансии</h2>
      <div style={{ background:'#1a1a1a', borderRadius:20, padding:24, border:'1px solid #2a2a2a' }}>
        <div style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:8 }}>{vacancy.title}</div>
        <div style={{ color:'#6C63FF', fontWeight:600, marginBottom:12 }}>
          {vacancy.salary_from ? `от ${vacancy.salary_from.toLocaleString()} ₽` : 'Зарплата не указана'}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {vacancy.work_format && (
            <span style={{ background:'#6C63FF22', color:'#6C63FF', padding:'4px 12px', borderRadius:20, fontSize:12 }}>
              {vacancy.work_format === 'remote' ? '🏠 Удалёнка' : vacancy.work_format === 'office' ? '🏢 Офис' : '🔀 Гибрид'}
            </span>
          )}
          {vacancy.skills?.map(s => (
            <span key={s} style={{ background:'#2a2a2a', color:'#888', padding:'4px 12px', borderRadius:20, fontSize:12 }}>{s}</span>
          ))}
        </div>
        {vacancy.about_team && <p style={{ color:'#aaa', fontSize:14, lineHeight:1.6 }}>{vacancy.about_team}</p>}
      </div>
      <div style={{ display:'flex', gap:16, marginTop:24 }}>
        <button onClick={() => swipe('left')} style={{
          flex:1, padding:18, fontSize:28, background:'#1a1a1a',
          border:'1px solid #2a2a2a', borderRadius:16, cursor:'pointer'
        }}>✕</button>
        <button onClick={() => swipe('right')} style={{
          flex:1, padding:18, fontSize:28, background:'#6C63FF22',
          border:'1px solid #6C63FF', borderRadius:16, cursor:'pointer'
        }}>💜</button>
      </div>
      <p style={{ textAlign:'center', color:'#555', fontSize:12, marginTop:12 }}>
        {index + 1} / {vacancies.length}
      </p>
    </div>
  )
}