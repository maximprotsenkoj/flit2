import { useEffect, useState } from 'react'
import { initTelegram, getTelegramUser, getTelegramDebug } from './lib/telegram'
import { supabase } from './lib/supabase'
import Onboarding from './pages/Onboarding'
import Feed from './pages/Feed'
import Matches from './pages/Matches'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('feed')
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    initTelegram()
    bootstrap()
  }, [])

  async function bootstrap() {
    const debug = getTelegramDebug()
    setDebugInfo(JSON.stringify(debug, null, 2))

    const tgUser = getTelegramUser()
    const id = tgUser?.id || 123456
    const name = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Test'
    const username = tgUser?.username || ''

    try {
      const { data } = await supabase
        .from('users').select('*').eq('id', id).single()
      if (data) { setUser({ ...data, name, username }) }
      else { setUser({ id, name, username, role: null }) }
    } catch (e) {
      setUser({ id, name, username, role: null })
    }

    setLoading(false)
  }

  if (loading) return (
    <div style={{ height:'100vh', background:'var(--paper)', padding:24, overflowY:'auto' }}>
      <div style={{ fontFamily:'Newsreader, Georgia, serif', fontSize:48, fontWeight:300, color:'var(--ink)' }}>flit.</div>
      <pre style={{ marginTop:24, fontSize:11, color:'var(--ink-3)', whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
        {debugInfo || 'Загрузка...'}
      </pre>
    </div>
  )

  if (!user?.role) return <Onboarding user={user} onComplete={setUser} />

  return (
    <div style={{ background:'var(--paper)', minHeight:'100vh' }}>
      {page === 'feed' && <Feed user={user} />}
      {page === 'matches' && <Matches user={user} />}
      {page === 'profile' && <Profile user={user} onUpdate={setUser} />}
      <Navbar page={page} setPage={setPage} role={user.role} />
    </div>
  )
}