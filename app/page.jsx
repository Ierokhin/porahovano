// porahovano.in.ua — головна сторінка
// /app/page.jsx

import Link from "next/link";

export const metadata = {
  title: "Porahovano — порівняння інвестицій для українців",
  description: "Порівнюємо депозити, ОВДП, НПФ та ETF. Показуємо реальну дохідність після 19.5% податку — у гривні та євро.",
};

const G  = "#0F6E56";
const GL = "#E1F5EE";
const A  = "#EF9F27";
const AL = "#FFF8EC";
const D  = "#1A2E2A";
const GR = "#73726C";
const B  = "#E5E5E0";
const S  = "#F5FAF8";

const INSTRUMENTS = [
  { icon:"🏦", name:"Депозити",     sub:"UAH / EUR · ФГВФО 600k", rate:"17%",  rateLbl:"топ ставка · UAH", risk:"low",  badge:null,                    href:"/depozyty" },
  { icon:"📜", name:"ОВДП",         sub:"UAH / EUR · Держава",     rate:"16%",  rateLbl:"топ ставка · UAH", risk:"low",  badge:"⚡ лише 1.5% податку",  href:"/ovdp" },
  { icon:"🏛", name:"НПФ",          sub:"UAH · пенсійні фонди",    rate:"11%",  rateLbl:"середня дохідність",risk:"mid", badge:"+18% ПДФО повертається", href:"/npf" },
  { icon:"📈", name:"ETF",          sub:"EUR · IBKR / Freedom24",  rate:"9.5%", rateLbl:"S&P 500 · довгострокове",risk:"mid",badge:null,               href:"/etf" },
  { icon:"🏨", name:"Нерухомість",  sub:"UAH · готелі та апарти",  rate:"14%",  rateLbl:"готель під управлінням",risk:"mid",badge:null,                href:"/alternatyvni" },
  { icon:"🥇", name:"Золото",       sub:"EUR · ETF / фізичне",     rate:"7%",   rateLbl:"Gold ETF · IGLN",  risk:"low",  badge:null,                    href:"/alternatyvni" },
  { icon:"⛓", name:"Блокчейн",     sub:"EUR · крипто / стейблкоїни",rate:"15%",rateLbl:"Bitcoin · волатильний",risk:"high",badge:null,                href:"/alternatyvni" },
];

const RISK_STYLE = {
  low:  { bg: GL,    c: G },
  mid:  { bg: AL,    c: "#D4891E" },
  high: { bg:"#FAECE7", c:"#C0392B" },
};
const RISK_LABEL = { low:"Низький", mid:"Середній", high:"Високий" };

const TOP3 = [
  { pos:"🥇 МІСЦЕ 1", name:"ОВДП UAH",          sub:"12 місяців · Держава",           rate:"15.76%", note:"реально на руки (16% − 1.5%)",       tag:"⚡ пільговий податок", dark:true },
  { pos:"🥈 МІСЦЕ 2", name:"Юнекс Банк",        sub:"Депозит · 12 міс. · ФГВФО",     rate:"13.7%",  note:"реально на руки (17% − 19.5%)",       tag:"надійний, онлайн",   dark:false },
  { pos:"🥉 МІСЦЕ 3", name:"Нерухомість",        sub:"Готель під управлінням · UAH",   rate:"11.3%",  note:"реально на руки (14% − 19.5%)",       tag:"пасивний дохід",     dark:false },
];

const WHY = [
  { icon:"🔢", title:"Реальна дохідність після податків", text:"Показуємо скільки залишиться на руки після 18% ПДФО та 1.5% військового збору — не рекламну ставку." },
  { icon:"📊", title:"Конструктор портфеля",             text:"Додай кілька інструментів, встанови суму і горизонт — побачиш прогноз на 1–25 років і щомісячну виплату." },
  { icon:"🇺🇦", title:"Для українців",                   text:"Тільки те, що доступно з України. UAH і EUR. Без USD і американських брокерів без доступу." },
];

export default function HomePage() {
  return (
    <main style={{ color: D, maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "56px 0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ display:"inline-block", padding:"3px 12px", borderRadius:20, background:GL, color:G, fontSize:11, fontWeight:700, marginBottom:16, letterSpacing:".05em" }}>
            ПОРІВНЯННЯ ІНВЕСТИЦІЙ · УКРАЇНА 2026
          </div>
          <h1 style={{ fontSize:"clamp(28px,4vw,38px)", fontWeight:700, lineHeight:1.18, letterSpacing:"-.6px", margin:"0 0 16px" }}>
            Де краще<br />тримати гроші<br /><span style={{ color:G }}>в Україні?</span>
          </h1>
          <p style={{ fontSize:15, color:GR, lineHeight:1.75, margin:"0 0 28px", maxWidth:440 }}>
            Порівнюємо депозити, ОВДП, ETF та НПФ. Показуємо реальну дохідність після 19.5% податку — у гривні та євро.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link href="/kalkulator" style={{ padding:"12px 22px", background:G, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>
              Зібрати портфель →
            </Link>
            <Link href="/alternatyvni" style={{ padding:"12px 22px", border:`1.5px solid ${B}`, color:D, borderRadius:10, fontSize:14, fontWeight:600, textDecoration:"none", background:"white" }}>
              Альтернативні
            </Link>
          </div>
        </div>

        {/* Top rates card */}
        <div style={{ background:`linear-gradient(135deg,${D} 0%,#2A4A44 100%)`, borderRadius:20, padding:28, color:"white" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9FE1CB", letterSpacing:".08em", marginBottom:18 }}>ТОП СТАВКИ ЗАРАЗ</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { name:"Юнекс Банк — депозит", sub:"₴ UAH · 12 місяців · ФГВФО",    rate:"17%",  net:"13.7% після податків",      rateColor:A },
              { name:"ОВДП UAH",             sub:"₴ UAH · 12 місяців · Держава",   rate:"16%",  net:"15.76% після 1.5% збору ⚡", rateColor:"#9FE1CB" },
              { name:"CSPX — S&P 500 ETF",   sub:"€ EUR · довгострокове",           rate:"9.5%", net:"~7.65% після податків",      rateColor:"#c0d4f0" },
            ].map(p => (
              <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"rgba(255,255,255,.07)", borderRadius:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.45)" }}>{p.sub}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:22, fontWeight:700, color:p.rateColor }}>{p.rate}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginTop:1 }}>{p.net}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, fontSize:11, color:"rgba(255,255,255,.35)", textAlign:"center" }}>Ставки оновлено червень 2026</div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:B, border:`1px solid ${B}`, borderRadius:14, overflow:"hidden", marginBottom:48 }}>
        {[
          { val:"7",         lbl:"інструментів порівняно" },
          { val:"19.5%",     lbl:"реальний податок на депозити" },
          { val:"1.5%",      lbl:"податок на ОВДП (пільга)" },
          { val:"600 000 ₴", lbl:"гарантія ФГВФО на банк" },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{ background:"white", padding:"16px 20px" }}>
            <div style={{ fontSize:22, fontWeight:700, color:G, marginBottom:3 }}>{val}</div>
            <div style={{ fontSize:12, color:GR }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Instruments ───────────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ІНСТРУМЕНТИ</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Всі способи зберегти та примножити</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:48 }}>
        {INSTRUMENTS.map(ins => {
          const r = RISK_STYLE[ins.risk];
          return (
            <Link key={ins.name} href={ins.href} style={{ border:`1.5px solid ${B}`, borderRadius:14, padding:18, background:"white", textDecoration:"none", color:D, display:"block" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:22 }}>{ins.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:r.bg, color:r.c }}>{RISK_LABEL[ins.risk]}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{ins.name}</div>
              <div style={{ fontSize:11, color:GR, marginBottom:12 }}>{ins.sub}</div>
              <div style={{ fontSize:26, fontWeight:700, color:G, lineHeight:1 }}>{ins.rate}</div>
              <div style={{ fontSize:11, color:GR, marginTop:2 }}>{ins.rateLbl}</div>
              {ins.badge && <div style={{ marginTop:10, fontSize:10, color:A, fontWeight:700 }}>{ins.badge}</div>}
            </Link>
          );
        })}

        {/* Compare card */}
        <Link href="/alternatyvni" style={{ border:`1.5px dashed ${B}`, borderRadius:14, padding:18, background:S, textDecoration:"none", color:GR, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:8 }}>⚖️</div>
          <div style={{ fontSize:13, fontWeight:700, color:D, marginBottom:4 }}>Альтернативні</div>
          <div style={{ fontSize:11, color:"#aaa" }}>Крипто, метали, нерухомість →</div>
        </Link>
      </div>

      {/* ── Top-3 ─────────────────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ТОП-3</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Найвигідніше зараз після податків</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:48 }}>
        {TOP3.map(t => (
          <div key={t.name} style={{
            borderRadius:14, padding:20,
            background: t.dark ? D : S,
            border: t.dark ? "none" : `1.5px solid ${B}`,
            color: t.dark ? "white" : D,
          }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:".08em", marginBottom:10, opacity:.6 }}>{t.pos}</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{t.name}</div>
            <div style={{ fontSize:12, opacity:.55, marginBottom:14 }}>{t.sub}</div>
            <div style={{ fontSize:32, fontWeight:700, color: t.dark ? A : G, lineHeight:1 }}>{t.rate}</div>
            <div style={{ fontSize:12, marginTop:4, opacity:.5 }}>{t.note}</div>
            <div style={{
              display:"inline-block", marginTop:14,
              fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20,
              background: t.dark ? "rgba(255,255,255,.1)" : GL,
              color: t.dark ? "rgba(255,255,255,.6)" : G,
            }}>{t.tag}</div>
          </div>
        ))}
      </div>

      {/* ── Why ───────────────────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ЧОМУ PORAHOVANO</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Ми рахуємо те, що інші приховують</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:48 }}>
        {WHY.map(w => (
          <div key={w.title} style={{ padding:20, borderRadius:14, background:S, border:`1px solid ${B}` }}>
            <div style={{ fontSize:24, marginBottom:10 }}>{w.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>{w.title}</div>
            <div style={{ fontSize:13, color:GR, lineHeight:1.65 }}>{w.text}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: D, borderRadius:20, padding:"40px 40px",
        display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"center",
      }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:"white", marginBottom:8 }}>Скільки накопичиш за 10 років?</div>
          <div style={{ fontSize:14, color:"#9FE1CB", lineHeight:1.65 }}>
            Зберіть власний портфель у «Мій капітал» — депозити, ОВДП, ETF разом.<br />
            Побачиш дохід, графік зростання і суму щомісячної виплати.
          </div>
        </div>
        <Link href="/kalkulator" style={{ padding:"14px 28px", background:A, color:D, borderRadius:12, fontSize:14, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}>
          Відкрити «Мій капітал» →
        </Link>
      </div>

    </main>
  );
}
