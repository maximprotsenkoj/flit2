import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SKILLS = ['React','Python','Design','Marketing','Sales','HR','Finance','iOS','Android','DevOps']

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [skills, setSkills] = useState([])
  const [salary, setSalary] = useState('')
  const [format, setFormat] = useState(null)
  const [loading, setLoading] = useState(false)

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function finish() {
    setLoading(true)
    const profile = { id: user.id, name: user.name, username: user.username || '', role, skills, salary_from: parseInt(salary) || 0, work_format: format }
    await supabase.from('users').upsert(profile)
    onComplete({ ...user, ...profile })
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', padding:24, color:'#fff' }}>
      {step === 1 && (
        <div>
          <div style={{ fontSize:48, marginBottom:8 }}>⚡</div>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#6C63FF' }}>Flit</h1>
          <p style={{ color:'#888', marginBottom:32 }}>Свайпни — и работа найдёт тебя</p>
          <p style={{ marginBottom:16, fontWeight:600 }}>Ты кто?</p>
          {['candidate','employer'].map(r => (
            <button key={r} onClick={() => { setRole(r); setStep(2) }} style={{
              display:'block', width:'100%', padding:16, marginBottom:12,
              background:'#1a1a1a', border:'1px solid #2a2a2a',
              borderRadius:12, color:'#fff', fontSize:16, cursor:'pointer', textAlign:'left'
            }}>
              {r === 'candidate' ? '🙋 Ищу работу' : '🏢 Нанимаю людей'}
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div>
          <p style={{ marginBottom:16, fontWeight:600 }}>Твои навыки:</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {SKILLS.map(s => (
              <button key={s} onClick={() => toggleSkill(s)} style={{
                padding:'8px 16px', borderRadius:20, border:'1px solid',
                borderColor: skills.includes(s) ? '#6C63FF' : '#2a2a2a',
                background: skills.includes(s) ? '#6C63FF22' : '#1a1a1a',
                color: skills.includes(s) ? '#6C63FF' : '#888', cursor:'pointer'
              }}>{s}</button>
            ))}
          </div>
          <button onClick={() => setStep(3)} style={{
            width:'100%', padding:16, background:'#6C63FF',
            border:'none', borderRadius:12, color:'#fff', fontSize:16, cursor:'pointer'
          }}>Далее →</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <p style={{ marginBottom:16, fontWeight:600 }}>Желаемая зарплата (₽/мес):</p>
          <input value={salary} onChange={e => setSalary(e.target.value)}
            placeholder="например 150000"
            style={{ width:'100%', padding:16, background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:12, color:'#fff', fontSize:16, marginBottom:24 }}
          />
          <p style={{ marginBottom:16, fontWeight:600 }}>Формат работы:</p>
          {['remote','office','hybrid'].map(f => (
            <button key={f} onClick={() => setFormat(f)} style={{
              display:'block', width:'100%', padding:14, marginBottom:8,
              background: format === f ? '#6C63FF22' : '#1a1a1a',
              border:`1px solid ${format === f ? '#6C63FF' : '#2a2a2a'}`,
              borderRadius:12, color: format === f ? '#6C63FF' : '#fff', cursor:'pointer'
            }}>
              {f === 'remote' ? '🏠 Удалёнка' : f === 'office' ? '🏢 Офис' : '🔀 Гибрид'}
            </button>
          ))}
          <button onClick={finish} disabled={loading} style={{
            width:'100%', padding:16, background:'#6C63FF', marginTop:16,
            border:'none', borderRadius:12, color:'#fff', fontSize:16, cursor:'pointer'
          }}>{loading ? 'Сохраняем...' : 'Начать ⚡'}</button>
        </div>
      )}
    </div>
  )
}