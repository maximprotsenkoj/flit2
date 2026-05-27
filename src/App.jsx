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
    
    if (!tgUser) {
      // Браузер — показываем заглушку
      setUser({ id: 123456, name: 'Открой в Telegram', username: '', role: null })
      setLoading(false)
      return
    }
  
    const id = tgUser.id
    const name = `${tgUser.first_name} ${tgUser.last_name}`.trim()
    const username = tgUser.username
  
    const { data } = await supabase
      .from('users').select('*').eq('id', id).single()
  
    if (data) {
      // Обновляем имя и username при каждом входе
      await supabase.from('users').update({ name, username }).eq('id', id)
      setUser({ ...data, name, username })
    } else {
      setUser({ id, name, username, role: null })
    }
    setLoading(false)
  }
}