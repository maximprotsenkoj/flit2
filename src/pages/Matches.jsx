import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Matches({ user }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMatches() }, [])

  async function loadMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*, vacancies(title, salary_from)')
      .or(`candidate_id.eq.${user.id},employer_id.eq.${user.id}`)
    setMatches(data || [])
    setLoading(false)
  }

  if (loading) return <div style={{ padding:24, color:'#888', background:'#0f0f0f', minHeight:'100vh' }}>Загружаем...</div>

  return (
    <div style={{ padding:16, background:'#0f0f0f', minHeight:'100vh' }}>
      <h2 style={{ color:'#fff', marginBottom:16, fontSize:20 }}>💜 Мэтчи</h2>
      {matches.length === 0 ? (
        <div style={{ textAlign:'center', color:'#555', marginTop:80 }}>
          <div style={{ fontSize:48 }}>👀</div>
          <p style={{ marginTop:16 }}>Пока мэтчей нет — свайпай!</p>
        </div>
      ) : matches.map(m => (
        <div key={m.id} style={{ background:'#1a1a1a', borderRadius:16, padding:20, marginBottom:12, border:'1px solid #6C63FF44' }}>
          <div style={{ fontWeight:600, color:'#fff' }}>{m.vacancies?.title}</div>
          <div style={{ color:'#6C63FF', fontSize:14, marginTop:4 }}>
            {m.vacancies?.salary_from ? `от ${m.vacancies.salary_from.toLocaleString()} ₽` : ''}
          </div>
          <div style={{ color:'#22c55e', fontSize:12, marginTop:8 }}>✓ Мэтч!</div>
        </div>
      ))}
    </div>
  )
}