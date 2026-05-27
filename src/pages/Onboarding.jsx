import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SKILLS = ['React','Python','Design','Marketing','Sales','HR','Finance','iOS','Android','DevOps','Data','Product']

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
    <div className="onboard">
      {step === 1 && (
        <>
          <div className="onboard__logo">flit.</div>
          <div className="onboard__tag">Свайпни — и работа найдёт тебя</div>
          <div style={{ marginTop: 48 }}>
            <div className="onboard__label">Ты кто?</div>
            <button className="onboard__btn" onClick={() => { setRole('candidate'); setStep(2) }}>
              🙋 Ищу работу
            </button>
            <button className="onboard__btn" onClick={() => { setRole('employer'); setStep(2) }}>
              🏢 Нанимаю людей
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Навыки</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 24 }}>Выбери что умеешь — подберём вакансии точнее</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {SKILLS.map(s => (
              <button key={s} className={'onboard__chip' + (skills.includes(s) ? ' onboard__chip--on' : '')}
                onClick={() => toggleSkill(s)}>{s}</button>
            ))}
          </div>
          <button className="onboard__primary" onClick={() => setStep(3)}>Далее →</button>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Зарплата</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 24 }}>Только вакансии с открытой зарплатой</div>
          <input className="onboard__input" value={salary}
            onChange={e => setSalary(e.target.value)}
            placeholder="от 150 000 ₽"
          />
          <div className="onboard__label" style={{ marginTop: 8 }}>Формат работы</div>
          {[
            { id: 'remote', label: '🏠 Удалёнка' },
            { id: 'hybrid', label: '🔀 Гибрид' },
            { id: 'office', label: '🏢 Офис' },
          ].map(f => (
            <button key={f.id} className="onboard__btn"
              onClick={() => setFormat(f.id)}
              style={{ borderColor: format === f.id ? 'var(--accent)' : undefined, color: format === f.id ? 'var(--accent)' : undefined }}>
              {f.label}
            </button>
          ))}
          <button className="onboard__primary" onClick={finish} disabled={loading}>
            {loading ? 'Сохраняем...' : 'Начать ⚡'}
          </button>
        </>
      )}
    </div>
  )
}