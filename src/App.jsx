import { useEffect, useState } from 'react'
import { initTelegram, getTelegramUser } from './lib/telegram'
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

  useEffect(() => {
    initTelegram()
    bootstrap()
  }, [])

  async function bootstrap() {
    const tgUser = getTelegramUser()
    const id = tgUser?.id || 123456
    const name = tgUser?.first_name || 'Test'
    const username = tgUser?.username || ''
    const { data } = await supabase
      .from('users').select('*').eq('id', id).single()
    if (data) { setUser(data) }
    else { setUser({ id, name, username, role: null }) }
    setLoading(false)
  }

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--paper)' }}>
      <div style={{ fontFamily:'Newsreader, Georgia, serif', fontSize:72, fontWeight:300, letterSpacing:'-4px', color:'var(--ink)', lineHeight:0.9 }}>flit.</div>
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