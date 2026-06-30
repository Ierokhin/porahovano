"use client";
// porahovano.in.ua/etf — /app/etf/page.jsx
// Список ETF з /public/data/rates.json, дохідність — реальна за 12 міс через /api/etf-returns (Yahoo Finance)

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

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
  index:{bg:"#EFF6FF",c:"#2563EB"}, tech:{bg:"#F3E8FF",c:"#7C3AED"}, defense:{bg:"#FEF2F2",c:"#C0392B"},
  energy:{bg:"#FFF8EC",c:"#D4891E"}, health:{bg:"#F0FDF4",c:"#16A34A"}, finance:{bg:"#EFF6FF",c:"#1D4ED8"},
};

const FAQ = [
  { q:"Чи доступний IBKR для громадян України?", a:"Так. Interactive Brokers відкриває рахунки для громадян України, в тому числі тих хто зараз за кордоном. Потрібен паспорт, підтвердження адреси і заповнення анкети онлайн. Верифікація займає 3–7 робочих днів." },
  { q:"Як переказати гроші на IBKR з України?", a:"Картковий переказ в EUR — до ~$2 400/міс за правилами НБУ, або SWIFT-переказ з банку для більших сум. Monobank і ПУМБ добре проводять такі перекази." },
  { q:"Які податки сплачувати в Україні з ETF?", a:"18% ПДФО + 1.5% військовий збір = 19.5% від прибутку при продажу. Поки тримаєш ETF і не продаєш — податку немає." },
  { q:"Звідки береться дохідність на цій сторінці?", a:"Реальна ціна закриття сьогодні і рік тому через Yahoo Finance (тикери на LSE). Формула: (ціна сьогодні − ціна рік тому) / ціна рік тому × 100. Оновлюється раз на годину." },
  { q:"NATO ETF — що це?", a:"VanEck Defense UCITS ETF інвестує в оборонні компанії NATO: Rheinmetall, BAE Systems, Leonardo. Висока волатильність, геополітичний ризик." },
];

function Toast({ name, onClose }) {
  return (
    <div style={{ position:"fixed",bottom:24,right:24,zIndex:1000,background:T.dark,color:"white",borderRadius:12,padding:"14px 18px",boxShadow:"0 8px 24px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:12,maxWidth:300 }}>
      <span>✓</span>
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{name} — додано</div>
        <a href="/kalkulator" style={{fontSize:12,color:T.amber,textDecoration:"none"}}>Перейти до «Мій капітал» →</a>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18,padding:0,marginLeft:"auto"}}>×</button>
    </div>
  );
}

export default function EtfPage() {
  const [sector,   setSector]   = useState("all");
  const [openFaq,  setOpenFaq]  = useState(null);
  const [toast,    setToast]    = useState(null);
  const [added,    setAdded]    = useState({});
  const [etfList,  setEtfList]  = useState([]);
  const [returns,  setReturns]  = useState(null); // null = loading
  const [returnsState, setReturnsState] = useState("loading");

  useEffect(() => {
    fetch("/data/rates.json").then(r => r.json()).then(d => setEtfList(d.etf || []));
  }, []);

  useEffect(() => {
    fetch("/api/etf-returns")
      .then(r => r.json())
      .then(d => { setReturns(d.results); setReturnsState("ok"); })
      .catch(() => setReturnsState("error"));
  }, []);

  const merged = etfList.map(etf => {
    const r = returns?.[etf.id];
    return {
      ...etf,
      rate: r?.ok ? r.returnPct : null,
      risk: r?.ok ? (r.returnPct >= 12 ? "high" : r.returnPct >= 7 ? "mid" : "low") : "mid",
    };
  });

  const filtered = (sector === "all" ? merged : merged.filter(e => e.sector === sector))
    .filter(e => e.rate !== null)
    .sort((a,b) => b.rate - a.rate);

  function handleAdd(etf) {
    if (added[etf.id]) return;
    try {
      const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
      if (!prev.find(e => e.productId === etf.id)) {
        localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
          id: Date.now(), productId: etf.id, name: etf.ticker, sub:`EUR · LSE · ${SECT_LABELS[etf.sector]}`,
          rate: etf.rate, cur:"eur", tax:0.195, risk: etf.risk, gtee:"SIPC", color:"#3B82C4", lump:0, monthly:100,
        }]));
      }
    } catch {}
    setAdded(p => ({ ...p, [etf.id]: true }));
    setToast(etf.ticker);
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>
      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a><span>›</span><span style={{ color:T.dark, fontWeight:600 }}>ETF</span>
      </nav>

      <section style={{ marginBottom:28 }}>
        <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:12 }}>
          ЖИВІ ДАНІ · YAHOO FINANCE
        </div>
        <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 14px" }}>
          ETF через Interactive Brokers:<br/><span style={{ color:T.green }}>реальна дохідність за останні 12 місяців</span>
        </h1>
        <p style={{ fontSize:15, color:T.gray, maxWidth:600, lineHeight:1.75, margin:"0 0 20px" }}>
          Дохідність розрахована за формулою (ціна сьогодні − ціна рік тому) / ціна рік тому. Дані оновлюються щогодини напряму з біржі.
        </p>
      </section>

      <div style={{ background:T.dark, borderRadius:14, padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
        <div style={{ background:T.amber, borderRadius:10, padding:"8px 14px", fontSize:14, fontWeight:700, color:T.dark, flexShrink:0 }}>IBKR</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:4 }}>Interactive Brokers — рекомендований брокер для українців</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>Найнижчі комісії · LSE / Euronext · SIPC захист $500k</div>
        </div>
        <a href="https://www.interactivebrokers.com" target="_blank" rel="nofollow noopener" style={{ padding:"9px 18px", background:T.green, color:"white", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", flexShrink:0 }}>Відкрити рахунок →</a>
      </div>

      <section style={{ marginBottom:40 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>РЕЙТИНГ ETF ЗА СЕКТОРАМИ</div>
        <h2 style={{ fontSize:20, fontWeight:700, margin:"0 0 16px" }}>Дохідність за останні 12 місяців</h2>

        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {SECTORS.map(s => (
            <button key={s.id} onClick={() => setSector(s.id)} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:`1.5px solid ${sector===s.id?T.green:T.border}`, background:sector===s.id?T.green:"white", color:sector===s.id?"white":T.gray }}>{s.label}</button>
          ))}
        </div>

        {returnsState === "loading" && (
          <div style={{ padding:30, textAlign:"center", color:T.gray, fontSize:13, border:`1.5px dashed ${T.border}`, borderRadius:14 }}>⏳ Рахуємо дохідність за 12 місяців з Yahoo Finance...</div>
        )}
        {returnsState === "error" && (
          <div style={{ padding:30, textAlign:"center", color:"#C0392B", fontSize:13, border:`1.5px dashed #C0392B`, borderRadius:14 }}>⚠ Не вдалось завантажити дані. Спробуйте оновити сторінку.</div>
        )}

        {returnsState === "ok" && (
          <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:8 }}>
            <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 90px 110px 80px 110px", padding:"8px 14px", background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
              {["ТИКЕР","НАЗВА / ІНДЕКС","12 МІС.","ПІСЛЯ 19.5%","РИЗИК","МІЙ КАПІТАЛ"].map(h => <div key={h}>{h}</div>)}
            </div>
            {filtered.map((etf, i) => {
              const sc = SECT_COLORS[etf.sector];
              const RISK = { low:{bg:T.greenLt,c:T.green,l:"Низький"}, mid:{bg:"#FFF8EC",c:"#D4891E",l:"Середній"}, high:{bg:"#FAECE7",c:"#C0392B",l:"Високий"} }[etf.risk];
              const isDone = !!added[etf.id];
              return (
                <div key={etf.id} style={{ display:"grid", gridTemplateColumns:"70px 1fr 90px 110px 80px 110px", padding:"11px 14px", alignItems:"center", borderTop:`1px solid ${T.border}`, background: i===0 && sector==="all" ? T.greenLt : T.white }}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.green, fontFamily:"monospace" }}>{etf.ticker}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                      {etf.name}<span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:sc.bg, color:sc.c }}>{SECT_LABELS[etf.sector]}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:17, fontWeight:700, color: etf.rate>=0?T.green:"#C0392B" }}>{etf.rate>=0?"+":""}{etf.rate}%</div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.amber }}>{(etf.rate*0.805).toFixed(1)}%</div>
                  <div><span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:RISK.bg, color:RISK.c, fontWeight:600 }}>{RISK.l}</span></div>
                  <div>
                    <button onClick={() => handleAdd(etf)} style={{ width:"100%", padding:"6px 8px", borderRadius:8, fontSize:11, fontWeight:700, cursor:isDone?"default":"pointer", border:`1.5px solid ${isDone?T.green:T.border}`, background:isDone?T.greenLt:T.white, color:isDone?T.green:T.gray }}>{isDone?"✓ Додано":"+ Капітал"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div style={{ height:1, background:T.border, margin:"36px 0" }}/>

      <section style={{ marginBottom:40 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>ЧАСТІ ЗАПИТАННЯ</div>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"0 0 14px" }}>ETF через IBKR — що потрібно знати</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{ border:`1.5px solid ${open?T.green:T.border}`, borderRadius:12, overflow:"hidden" }}>
                <button onClick={() => setOpenFaq(open?null:i)} style={{ width:"100%", textAlign:"left", padding:"13px 16px", background:open?T.greenLt:T.white, border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:14, fontWeight:600, color:T.dark, gap:10 }}>
                  {item.q}<span style={{ fontSize:20, color:T.green, flexShrink:0, transform:open?"rotate(45deg)":"none", transition:"transform .2s" }}>+</span>
                </button>
                {open && <div style={{ padding:"0 16px 13px", fontSize:14, color:T.gray, lineHeight:1.75, background:T.greenLt }}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ background:T.dark, borderRadius:16, padding:"28px 32px", textAlign:"center" }}>
        <div style={{ fontSize:20, fontWeight:700, color:"white", marginBottom:8 }}>Додай ETF до портфеля</div>
        <p style={{ color:"#9FE1CB", margin:"0 0 20px", fontSize:14 }}>Побачиш прогноз поруч з депозитами та ОВДП.</p>
        <a href="/kalkulator" style={{ display:"inline-block", padding:"11px 26px", background:T.green, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
