// porahovano.in.ua/novyny — /app/novyny/page.jsx

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", dark:"#1A2E2A", gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0",
};

export const metadata = {
  title: "Новини · Porahovano",
  description: "Актуальні зміни ставок депозитів, ОВДП та ринкові новини для інвесторів в Україні.",
};

export default function NovynyPage() {
  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>

      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a>
        <span>›</span>
        <span style={{ color:T.dark, fontWeight:600 }}>Новини</span>
      </nav>

      <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 8px" }}>
        Новини та <span style={{ color:T.green }}>оновлення ставок</span>
      </h1>
      <p style={{ fontSize:14, color:T.gray, lineHeight:1.7, margin:"0 0 32px" }}>
        Актуальні зміни ставок депозитів, ОВДП та ринкові новини для інвесторів в Україні.
      </p>

      {/* Telegram CTA */}
      <div style={{ background:T.dark, borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, marginBottom:48, flexWrap:"wrap" }}>
        <div style={{ width:44, height:44, borderRadius:10, background:T.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21.8 2.2L1 9.5c-1.4.5-1.4 1.3-.2 1.7l5.1 1.6 1.9 5.9c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.3 1.8-.9l3.3-15.2c.3-1.4-.5-2-1.5-1.7z" fill="white"/>
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:3 }}>
            Новини першими — в Telegram
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>
            Зміни ставок, нові інструменти та поради щотижня · @porahovano
          </div>
        </div>
        <a href="https://t.me/porahovano" target="_blank" rel="noopener noreferrer"
          style={{ padding:"9px 18px", background:T.amber, color:T.dark, borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
          Підписатись →
        </a>
      </div>

      {/* Coming soon */}
      <div style={{ textAlign:"center", padding:"60px 20px", border:`2px dashed ${T.border}`, borderRadius:20, background:T.grayLt }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📰</div>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10, color:T.dark }}>
          Новини з'являться незабаром
        </h2>
        <p style={{ fontSize:14, color:T.gray, lineHeight:1.75, maxWidth:420, margin:"0 auto 24px" }}>
          Ми готуємо регулярні огляди ставок депозитів, новини ОВДП та ринкові аналітику. Підпишись на Telegram щоб не пропустити перші публікації.
        </p>
        <a href="https://t.me/porahovano" target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-block", padding:"11px 24px", background:T.green, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>
          Підписатись на @porahovano →
        </a>
      </div>

    </main>
  );
}
