export default function Navbar({ page, setPage }) {
    return (
      <nav style={{
        position:'fixed', bottom:0, left:0, right:0,
        background:'#1a1a1a', borderTop:'1px solid #2a2a2a',
        display:'flex', padding:'8px 0 16px', zIndex:100
      }}>
        {[
          { id:'feed', label:'Вакансии', icon:'🔥' },
          { id:'matches', label:'Мэтчи', icon:'💜' },
        ].map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            flex:1, background:'none', display:'flex',
            flexDirection:'column', alignItems:'center', gap:4,
            color: page === item.id ? '#6C63FF' : '#888',
            fontSize:11, fontWeight: page === item.id ? 600 : 400,
            border:'none', cursor:'pointer'
          }}>
            <span style={{ fontSize:22 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    )
  }