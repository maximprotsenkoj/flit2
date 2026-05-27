export function initTelegram() {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
  }
}

export function getTelegramUser() {
  const tg = window.Telegram?.WebApp
  return tg?.initDataUnsafe?.user || null
}

export function getTelegramDebug() {
  const tg = window.Telegram?.WebApp
  return {
    version: tg?.version,
    platform: tg?.platform,
    initData: tg?.initData?.substring(0, 100),
    user: tg?.initDataUnsafe?.user,
  }
}