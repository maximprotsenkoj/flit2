export function initTelegram() {
    const tg = window.Telegram?.WebApp
    if (tg) { tg.ready(); tg.expand() }
  }
  
  export function getTelegramUser() {
    return window.Telegram?.WebApp?.initDataUnsafe?.user || null
  }