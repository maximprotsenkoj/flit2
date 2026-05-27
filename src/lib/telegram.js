export function initTelegram() {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
  }
}

export function getTelegramUser() {
  const tg = window.Telegram?.WebApp
  const user = tg?.initDataUnsafe?.user
  if (user) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || null,
    }
  }
  return null
}