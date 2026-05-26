import { useEffect, useState } from 'react'
import { initTelegram, getTelegramUser } from './lib/telegram'
import { supabase } from './lib/supabase'
import Onboarding from './pages/Onboarding'
import Feed from './pages/Feed'
import Matches from './pages/Matches'
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
    const { data } = await supabase
      .from('users').select('*').eq('id', id).single()
    if (data) { setUser(data) }
    else { setUser({ id, name, role: null }) }
    setLoading(false)
  }

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0f0f0f' }}>
      <div style={{ fontSize:48 }}>⚡</div>
      <div style={{ fontSize:24, fontWeight:700, color:'#6C63FF', marginTop:12 }}>Flit</div>
    </div>
  )

  if (!user?.role) return <Onboarding user={user} onComplete={setUser} />

  return (
    <div style={{ background:'#0f0f0f', minHeight:'100vh', paddingBottom:64 }}>
      {page === 'feed' && <Feed user={user} />}
      {page === 'matches' && <Matches user={user} />}
      <Navbar page={page} setPage={setPage} role={user.role} />
    </div>
  )
}