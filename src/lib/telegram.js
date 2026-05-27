export function initTelegram() {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
  }
}

export function getTelegramUser() {
  const tg = window.Telegram?.WebApp
  
  // Пробуем initDataUnsafe
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user
  }
  
  // Пробуем распарсить initData вручную
  if (tg?.initData) {
    try {
      const params = new URLSearchParams(tg.initData)
      const userStr = params.get('user')
      if (userStr) {
        return JSON.parse(decodeURIComponent(userStr))
      }
    } catch (e) {
      console.log('parse error', e)
    }
  }

  return null
}