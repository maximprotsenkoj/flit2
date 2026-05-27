export default function Navbar({ page, setPage }) {
  const tabs = [
    { id:'feed', label:'Лента', icon:(
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )},
    { id:'matches', label:'Отклики', icon:(
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id:'saved', label:'Избранное', icon:(
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M6 4h12v17l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    )},
    { id:'profile', label:'Я', icon:(
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )},
  ]

  return (
    <div className="tabbar">
      {tabs.map(t => (
        <div key={t.id} className={'tab' + (page === t.id ? ' tab--on' : '')} onClick={() => setPage(t.id)}>
          {t.icon}
          <div className="tab-label">{t.label}</div>
        </div>
      ))}
    </div>
  )
}