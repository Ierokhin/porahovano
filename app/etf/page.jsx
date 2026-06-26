"use client";
// porahovano.in.ua/etf — /app/etf/page.jsx

import { useState } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const ETF_DATA = [
  // Індексні
  { id:"e1",  ticker:"CSPX", name:"iShares Core S&P 500",          sub:"500 найбільших компаній США · Accumulating",          rate:9.5,  sector:"index",   risk:"mid",  stars:5, top:true },
  { id:"e2",  ticker:"VWCE", name:"Vanguard FTSE All-World",        sub:"3 700+ компаній по всьому світу · Accumulating",       rate:8.5,  sector:"index",   risk:"mid",  stars:5 },
  { id:"e3",  ticker:"EUNL", name:"iShares Core MSCI World",        sub:"Розвинуті ринки · 23 країни · Accumulating",           rate:8.0,  sector:"index",   risk:"mid",  stars:4 },
  { id:"e4",  ticker:"CNDX", name:"iShares NASDAQ 100",             sub:"100 найбільших tech-компаній США",                     rate:13.0, sector:"index",   risk:"mid",  stars:4 },
  // Технології
  { id:"e5",  ticker:"IITU", name:"iShares S&P 500 IT Sector",      sub:"Лише IT-сектор S&P 500 · Apple, MS, Nvidia",           rate:15.0, sector:"tech",    risk:"mid",  stars:5 },
  { id:"e6",  ticker:"WTCH", name:"WisdomTree Global Technology",   sub:"Глобальні tech-компанії · 100+ акцій",                 rate:11.0, sector:"tech",    risk:"mid",  stars:3 },
  // Оборона
  { id:"e7",  ticker:"NATO", name:"VanEck Defense UCITS ETF",       sub:"Rheinmetall, BAE Systems, Leonardo та ін.",            rate:20.0, sector:"defense", risk:"high", stars:5 },
  { id:"e8",  ticker:"DFNS", name:"iShares Aerospace & Defence",    sub:"Глобальна аерокосмічна та оборонна галузь",            rate:12.0, sector:"defense", risk:"mid",  stars:4 },
  // Енергетика
  { id:"e9",  ticker:"IOGP", name:"iShares Oil & Gas Exploration",  sub:"Нафта і газ · ExxonMobil, Shell, BP",                 rate:8.0,  sector:"energy",  risk:"high", stars:3 },
  { id:"e10", ticker:"INRG", name:"iShares Global Clean Energy",    sub:"Відновлювана енергетика · сонце, вітер",               rate:2.0,  sector:"energy",  risk:"high", stars:2 },
  { id:"e11", ticker:"XDEW", name:"Xtrackers MSCI World Energy",    sub:"Широкий енергетичний сектор розвинутих ринків",        rate:7.0,  sector:"energy",  risk:"mid",  stars:3 },
  // Медицина
  { id:"e12", ticker:"IUHC", name:"iShares S&P 500 Healthcare",     sub:"Healthcare-сектор S&P 500 · Johnson, UNH",            rate:8.5,  sector:"health",  risk:"low",  stars:4 },
  { id:"e13", ticker:"HEAL", name:"L&G Healthcare Breakthrough",    sub:"Біотех, геноміка, медичні технології",                rate:5.0,  sector:"health",  risk:"high", stars:3 },
  // Фінанси
  { id:"e14", ticker:"IUFS", name:"iShares S&P 500 Financials",     sub:"Фінансовий сектор S&P 500 · JPMorgan, Visa",          rate:10.0, sector:"finance", risk:"mid",  stars:4 },
  { id:"e15", ticker:"FLXF", name:"Franklin FTSE Europe Financials",sub:"Європейські банки та страхові компанії",               rate:8.0,  sector:"finance", risk:"mid",  stars:3 },
];

const SECTORS = [
  { id:"all",     label:"🌐 Всі" },
  { id:"index",   label:"📊 Індексні" },
  { id:"tech",    label:"💻 Технології" },
  { id:"defense", label:"🛡 Оборона" },
  { id:"energy",  label:"⚡ Енергетика" },
  { id:"health",  label:"🏥 Медицина" },
  { id:"finance", label:"🏦 Фінанси" },
];

const SECT_LABELS = { index:"Індекс", tech:"Технології", defense:"Оборона", energy:"Енергетика", health:"Медицина", finance:"Фінанси" };
const SECT_COLORS = {
  index:   { bg:"#EFF6FF", c:"#2563EB" },
  tech:    { bg:"#F3E8FF", c:"#7C3AED" },
  defense: { bg:"#FEF2F2", c:"#C0392B" },
  energy:  { bg:"#FFF8EC", c:"#D4891E" },
  health:  { bg:"#F0FDF4", c:"#16A34A" },
  finance: { bg:"#EFF6FF", c:"#1D4ED8" },
};
const RISK_STYLE = {
  low:  { bg:T.greenLt, c:T.green,    label:"Низький" },
  mid:  { bg:"#FFF8EC", c:"#D4891E",  label:"Середній" },
  high: { bg:"#FAECE7", c:"#C0392B",  label:"Високий" },
};

const FAQ = [
  { q:"Чи доступний IBKR для громадян України?",
    a:"Так. Interactive Brokers відкриває рахунки для громадян України, в тому числі тих хто зараз за кордоном. Потрібен паспорт, підтвердження адреси і заповнення анкети онлайн. Верифікація займає 3–7 робочих днів. Рахунок відкривається безкоштовно." },
  { q:"Як переказати гроші на IBKR з України?",
    a:"Два способи: (1) Картковий переказ в EUR — до ~$2 400/міс за правилами НБУ; (2) SWIFT-переказ з банку — для більших сум, потребує документів про мету переказу. Monobank і ПУМБ добре проводять такі перекази." },
  { q:"Які податки сплачувати в Україні з ETF?",
    a:"18% ПДФО + 1.5% військовий збір = 19.5% від прибутку при продажу. Поки тримаєш ETF і не продаєш — податку немає. При продажу декларуєш самостійно до 1 травня наступного року." },
  { q:"Що означає EUR-версія ETF на LSE?",
    a:"Багато ETF торгуються в кількох версіях. CSPX — EUR-версія S&P 500 ETF на Лондонській біржі. Відтворює той самий індекс що й американський SPY, але торгується в євро. Для українців це краще — не потрібен US брокерський рахунок." },
  { q:"NATO ETF — що це і чи варто купувати?",
    a:"VanEck Defense UCITS ETF (тикер NATO) інвестує в оборонні компанії країн NATO: Rheinmetall, BAE Systems, Leonardo, L3Harris. З 2022 показує виняткову дохідність через зростання оборонних бюджетів в Європі. Ризик: геополітичний. Підходить для диверсифікації, але не як основний актив." },
];

function addToCalc(etf) {
  try {
    const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
    if (prev.find(e => e.productId === etf.id)) return false;
    localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
      id: Date.now(), productId: etf.id,
      name: etf.ticker, sub: `EUR · LSE · ${SECT_LABELS[etf.sector]}`,
      rate: etf.rate, cur: "eur", tax: 0.195, risk: etf.risk, gtee: "SIPC",
      color: "#3B82C4", lump: 0, monthly: 100,
    }]));
    return true;
  } catch { return false; }
}

function Stars({ n }) {
  return (
    <span style={{ color:T.amber, fontSize:13, letterSpacing:-1 }}>
      {"★".repeat(n)}<span style={{ color:"#DDD" }}>{"★".repeat(5-n)}</span>
    </span>
  );
}
function Label({ children }) {
  return <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>{children}</div>;
}
function Divider() {
  return <div style={{ height:1, background:T.border, margin:"40px 0" }}/>;
}
function Toast({ name, onClose }) {
  return (
    <div style={{ position:"fixed",bottom:24,right:24,zIndex:1000,background:T.dark,color:"white",borderRadius:12,padding:"14px 18px",boxShadow:"0 8px 24px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:12,maxWidth:300 }}>
      <span style={{fontSize:18}}>✓</span>
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{name} — додано до портфеля</div>
        <a href="/kalkulator" style={{fontSize:12,color:T.amber,textDecoration:"none"}}>Перейти до «Мій капітал» →</a>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18,padding:0,marginLeft:"auto"}}>×</button>
    </div>
  );
}

export default function EtfPage() {
  const [sector,  setSector]  = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [added,   setAdded]   = useState({});

  const filtered = (sector === "all" ? ETF_DATA : ETF_DATA.filter(e => e.sector === sector))
    .slice().sort((a,b) => b.rate - a.rate);

  function handleAdd(etf) {
    if (added[etf.id]) return;
    if (addToCalc(etf)) {
      setAdded(p => ({ ...p, [etf.id]: true }));
      setToast(etf.ticker);
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>

      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a>
        <span>›</span>
        <span style={{ color:T.dark, fontWeight:600 }}>ETF</span>
      </nav>

      {/* Hero */}
      <section style={{ marginBottom:28 }}>
        <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:12, letterSpacing:".05em" }}>ОНОВЛЕНО ЧЕРВЕНЬ 2026</div>
        <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 14px" }}>
          ETF через Interactive Brokers:<br/>
          <span style={{ color:T.green }}>світові ринки у євро — з України</span>
        </h1>
        <p style={{ fontSize:15, color:T.gray, maxWidth:600, lineHeight:1.75, margin:"0 0 20px" }}>
          Біржові фонди — найпростіший спосіб інвестувати в <strong>S&P 500, технології, оборонку, медицину</strong> і весь світ. Доступно з України через IBKR з мінімальними комісіями.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[{val:"від 7%", lbl:"до 20% річних · EUR"},{val:"IBKR", lbl:"найнижчі комісії · SIPC $500k"},{val:"LSE", lbl:"London Stock Exchange · EUR-версії"}]
            .map(({val,lbl}) => (
              <div key={lbl} style={{ background:T.greenLt, borderRadius:12, padding:"12px 18px", minWidth:130 }}>
                <div style={{ fontSize:22, fontWeight:700, color:T.green }}>{val}</div>
                <div style={{ fontSize:12, color:T.gray, marginTop:2 }}>{lbl}</div>
              </div>
            ))}
        </div>
      </section>

      {/* IBKR block */}
      <div style={{ background:T.dark, borderRadius:14, padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
        <div style={{ background:T.amber, borderRadius:10, padding:"8px 14px", fontSize:14, fontWeight:700, color:T.dark, flexShrink:0 }}>IBKR</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:4 }}>Interactive Brokers — рекомендований брокер для українців</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.5 }}>Найнижчі комісії у світі · Прямий доступ до LSE та Euronext · SIPC захист $500k · Відкриття рахунку онлайн</div>
        </div>
        {/* TODO: замінити на реферальне посилання */}
        <a href="https://www.interactivebrokers.com" target="_blank" rel="nofollow noopener"
          style={{ padding:"9px 18px", background:T.green, color:"white", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
          Відкрити рахунок →
        </a>
      </div>

      {/* НБУ warning */}
      <div style={{ background:T.amberLt, border:`1.5px solid ${T.amber}`, borderRadius:12, padding:"12px 16px", marginBottom:28, fontSize:13, lineHeight:1.6 }}>
        <strong style={{ color:T.amber }}>⚠ Обмеження НБУ:</strong> Переказ за кордон для фізосіб ~$2 400/міс через картки. Для більших сум — банківський SWIFT-переказ з документами. Актуальні ліміти: <a href="https://bank.gov.ua" target="_blank" rel="nofollow" style={{ color:T.green, fontWeight:700 }}>bank.gov.ua</a>
      </div>

      {/* ETF Table */}
      <section style={{ marginBottom:40 }}>
        <Label>РЕЙТИНГ ETF ЗА СЕКТОРАМИ</Label>
        <h2 style={{ fontSize:20, fontWeight:700, margin:"0 0 16px" }}>Купуються на LSE через IBKR · EUR</h2>

        {/* Sector tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {SECTORS.map(s => (
            <button key={s.id} onClick={() => setSector(s.id)} style={{
              padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
              border:`1.5px solid ${sector===s.id ? T.green : T.border}`,
              background: sector===s.id ? T.green : "white",
              color: sector===s.id ? "white" : T.gray,
              transition:"all .15s",
            }}>{s.label}</button>
          ))}
        </div>

        <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:8 }}>
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 90px 110px 80px 90px 110px", padding:"8px 14px", background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
            {["ТИКЕР","НАЗВА / ІНДЕКС","ДОХІДНІСТЬ","ПІСЛЯ 19.5%","РИЗИК","РЕЙТИНГ","МІЙ КАПІТАЛ"].map(h => <div key={h}>{h}</div>)}
          </div>
          {filtered.map((etf, i) => {
            const sc = SECT_COLORS[etf.sector];
            const r  = RISK_STYLE[etf.risk];
            return (
              <div key={etf.id} style={{
                display:"grid", gridTemplateColumns:"70px 1fr 90px 110px 80px 90px 110px",
                padding:"11px 14px", alignItems:"center",
                borderTop:`1px solid ${T.border}`,
                background: i===0 && sector==="all" ? T.greenLt : T.white,
              }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.green, fontFamily:"monospace" }}>{etf.ticker}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                    {etf.name}
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:sc.bg, color:sc.c }}>
                      {SECT_LABELS[etf.sector]}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:T.gray, marginTop:1 }}>{etf.sub}</div>
                </div>
                <div style={{ fontSize:17, fontWeight:700, color:T.green }}>{etf.rate}%</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.amber }}>{(etf.rate*0.805).toFixed(1)}%</div>
                  <div style={{ fontSize:10, color:T.gray }}>−19.5%</div>
                </div>
                <div><span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:r.bg, color:r.c, fontWeight:600 }}>{r.label}</span></div>
                <div>
                  <span style={{ color:T.amber, fontSize:13, letterSpacing:-1 }}>
                    {"★".repeat(etf.stars)}<span style={{ color:"#DDD" }}>{"★".repeat(5-etf.stars)}</span>
                  </span>
                </div>
                <div>
                  <button onClick={() => handleAdd(etf)} style={{
                    width:"100%", padding:"6px 8px", borderRadius:8, fontSize:11, fontWeight:700, cursor:added[etf.id]?"default":"pointer",
                    border:`1.5px solid ${added[etf.id] ? T.green : T.border}`,
                    background: added[etf.id] ? T.greenLt : T.white,
                    color: added[etf.id] ? T.green : T.gray,
                  }}>{added[etf.id] ? "✓ Додано" : "+ Капітал"}</button>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize:12, color:T.gray, marginTop:8 }}>
          Дохідність — середня річна за 5–10 років. Минула прибутковість не гарантує майбутню. Джерело:{" "}
          <a href="https://www.justetf.com" target="_blank" rel="nofollow" style={{ color:T.green }}>justetf.com</a>,{" "}
          <a href="https://www.ishares.com" target="_blank" rel="nofollow" style={{ color:T.green }}>ishares.com</a>
        </p>
      </section>

      <Divider/>

      {/* Calculation */}
      <section style={{ marginBottom:40 }}>
        <Label>РЕАЛЬНА ДОХІДНІСТЬ</Label>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"0 0 10px" }}>Після 19.5% податку · при продажу</h2>
        <div style={{ background:T.grayLt, border:`1.5px solid ${T.border}`, borderRadius:14, padding:"20px 24px", marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.gray, marginBottom:14, letterSpacing:".04em" }}>ПРИКЛАД — €5 000 у CSPX під ~9.5% на 12 місяців</div>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:6 }}>
            {[
              { lbl:"Вклали",         val:"€5 000",  sub:"під 9.5%/рік",       c:T.dark },
              null,
              { lbl:"Зростання",      val:"+€475",   sub:"за 12 місяців",      c:T.green },
              null,
              { lbl:"Податок 19.5%",  val:"−€93",    sub:"лише при продажу",   c:T.amber },
              null,
              { lbl:"На руки",        val:"€382",    sub:"реально 7.65%",      c:T.green },
            ].map((item, i) =>
              item === null
                ? <div key={i} style={{ fontSize:18, color:T.gray, padding:"0 2px" }}>→</div>
                : <div key={i} style={{ padding:"10px 12px", textAlign:"center", flex:1, minWidth:90 }}>
                    <div style={{ fontSize:11, color:T.gray, fontWeight:600, marginBottom:4 }}>{item.lbl}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:item.c }}>{item.val}</div>
                    <div style={{ fontSize:10, color:T.gray, marginTop:2 }}>{item.sub}</div>
                  </div>
            )}
          </div>
        </div>
        <div style={{ background:T.amberLt, border:`1px solid ${T.amber}`, borderRadius:10, padding:"12px 16px", fontSize:12, color:T.dark, lineHeight:1.6 }}>
          ⚡ <strong>Поки тримаєш — не платиш:</strong> Податок виникає тільки при продажу ETF. Весь приріст реінвестується без оподаткування. На горизонті 10+ років це дає значний ефект складного відсотка.
        </div>
      </section>

      <Divider/>

      {/* Steps */}
      <section style={{ marginBottom:40 }}>
        <Label>ПОКРОКОВО</Label>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"0 0 16px" }}>Як купити ETF через IBKR</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { n:"01", t:"Реєстрація IBKR",  d:"ibkr.com → відкрити рахунок. Паспорт + адреса. Верифікація 3–7 днів." },
            { n:"02", t:"Поповнення",        d:"Переказ EUR з картки або SWIFT. Ліміт НБУ ~$2 400/міс." },
            { n:"03", t:"Знайди тикер",      d:"Пошук CSPX, VWCE або NATO. Обери біржу LSE (London) для EUR-версії." },
            { n:"04", t:"Купуй регулярно",   d:"DCA — щомісяця фіксована сума. Час на ринку важливіший за тайминг." },
          ].map(({ n,t,d }) => (
            <div key={n} style={{ background:T.grayLt, borderRadius:12, padding:15 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>{n}</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:5 }}>{t}</div>
              <div style={{ fontSize:12, color:T.gray, lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider/>

      {/* FAQ */}
      <section style={{ marginBottom:40 }}>
        <Label>ЧАСТІ ЗАПИТАННЯ</Label>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"0 0 14px" }}>ETF через IBKR — що потрібно знати</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{ border:`1.5px solid ${open ? T.green : T.border}`, borderRadius:12, overflow:"hidden" }}>
                <button onClick={() => setOpenFaq(open ? null : i)} style={{ width:"100%", textAlign:"left", padding:"14px 18px", background:open?T.greenLt:T.white, border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:14, fontWeight:600, color:T.dark, gap:10 }}>
                  {item.q}
                  <span style={{ fontSize:20, color:T.green, flexShrink:0, display:"inline-block", transform:open?"rotate(45deg)":"none", transition:"transform .2s" }}>+</span>
                </button>
                {open && <div style={{ padding:"0 18px 14px", fontSize:14, color:T.gray, lineHeight:1.75, background:T.greenLt }}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:T.dark, borderRadius:16, padding:"28px 32px", textAlign:"center" }}>
        <div style={{ fontSize:20, fontWeight:700, color:"white", marginBottom:8 }}>Скільки виросте €5 000 за 10 років у CSPX?</div>
        <p style={{ color:"#9FE1CB", margin:"0 0 20px", fontSize:14 }}>Додай ETF до портфеля у «Мій капітал» — побачиш прогноз поруч з депозитами та ОВДП.</p>
        <a href="/kalkulator" style={{ display:"inline-block", padding:"11px 26px", background:T.green, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
