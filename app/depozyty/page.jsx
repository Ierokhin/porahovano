"use client";
// porahovano.in.ua/depozyty — /app/depozyty/page.jsx
// Дані беруться з /public/data/rates.json — редагуй там

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const TYPE = {
  state:   { label:"Держ",  bg:"#EFF6FF", c:"#2563EB" },
  foreign: { label:"Іноз",  bg:"#F0FDF4", c:"#16A34A" },
  private: { label:"Прив",  bg:"#FFF8EC", c:"#D4891E" },
};

const net = (r) => +(r * 0.805).toFixed(1);

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

const FAQ = [
  { q:"Яка різниця між державним та іноземним банком для вкладника?",
    a:"Для звичайного вкладника різниця мінімальна — обидва покриваються ФГВФО до 600 000 ₴. Державні банки (ПриватБанк, Ощадбанк) мають імпліцитну 100% держгарантію. Іноземні підтримуються материнськими структурами. Приватні українські покладаються лише на ФГВФО." },
  { q:"Як розраховується податок 19.5% на депозит?",
    a:"18% ПДФО + 1.5% військовий збір = 19.5% від суми нарахованих відсотків. Банк утримує автоматично. Наприклад: 100 000 ₴ під 17% → нараховано 17 000 ₴ → податок 3 315 ₴ → на руки 13 685 ₴ (реально 13.7%)." },
  { q:"Чи безпечно тримати більше 600 000 ₴ в одному банку?",
    a:"Ризиковано. ФГВФО гарантує лише 600 000 ₴. Суму понад ліміт можна втратити при банкрутстві. Рекомендація: розподіли між 2-3 банками або обери держбанк — вони мають імпліцитну 100% держгарантію." },
  { q:"Коли вигідніше ОВДП ніж депозит?",
    a:"Майже завжди, якщо ставки однакові. ОВДП оподатковуються лише 1.5% (без ПДФО 18%). ОВДП 16% → 15.76% на руки. Депозит 16% → 12.9%. Різниця 2.86% на рік." },
  { q:"Як правильно відкрити депозит онлайн?",
    a:"1. Відкрий застосунок банку → «Вклади»; 2. Обери строк і суму; 3. Перевір ставку і умови (капіталізація, дострокове розірвання); 4. Підтвердж через SMS або Face ID." },
];

export default function DepozytyPage() {
  const [cur,     setCur]     = useState("uah");
  const [rates,   setRates]   = useState(null);
  const [added,   setAdded]   = useState({});
  const [toast,   setToast]   = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    fetch("/data/rates.json")
      .then(r => r.json())
      .then(data => setRates(data))
      .catch(() => setRates(null));
  }, []);

  const banks    = rates?.depozyty?.[cur] ?? [];
  const withRate = [...banks].filter(b => b.rate_12m !== null).sort((a,b) => b.rate_12m - a.rate_12m);
  const noRate   = [...banks].filter(b => b.rate_12m === null);
  const sorted   = [...withRate, ...noRate];
  const bestRate = withRate[0]?.rate_12m ?? null;
  const S        = cur === "uah" ? "₴" : "€";
  const updated  = rates?.updated ?? "";

  function handleAdd(bank) {
    const id = bank.id;
    if (added[id]) return;
    try {
      const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
      if (!prev.find(e => e.productId === id)) {
        localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
          id: Date.now(), productId: id,
          name: bank.name, sub: `${cur.toUpperCase()} · 12 міс.`,
          rate: bank.rate_12m, cur, tax: 0.195, risk: "low", gtee: "ФГВФО",
          color: T.green, lump: 0, monthly: cur === "uah" ? 5000 : 200,
        }]));
      }
    } catch {}
    setAdded(p => ({ ...p, [id]: true }));
    setToast(bank.name);
    setTimeout(() => setToast(null), 4000);
  }

  const col = "28px 42px 1fr 72px 100px 95px 68px 108px";

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:980, margin:"0 auto", padding:"0 20px 60px" }}>

      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a>
        <span>›</span>
        <span style={{ color:T.dark, fontWeight:600 }}>Депозити</span>
      </nav>

      {/* Hero */}
      <section style={{ marginBottom:24 }}>
        <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:12, letterSpacing:".05em" }}>
          ОНОВЛЕНО {updated || "ЧЕРВЕНЬ 2026"}
        </div>
        <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 12px" }}>
          Депозити в Україні:<br/>
          <span style={{ color:T.green }}>
            {bestRate ? `до ${bestRate}% · рейтинг за капіталом НБУ` : "рейтинг банків за капіталом НБУ"}
          </span>
        </h1>
        <p style={{ fontSize:14, color:T.gray, maxWidth:580, lineHeight:1.75, margin:"0 0 20px" }}>
          Банки відсортовані за рейтингом капіталізації НБУ. Реальна дохідність після 19.5% податку. Банки без ставки — не пропонують депозити фізособам або дані ще не оновлені.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { val: bestRate ? `${bestRate}%` : "—",      lbl:"топ ставка · 12 міс." },
            { val: bestRate ? `${net(bestRate)}%` : "—", lbl:"реально після 19.5%" },
            { val:"600 000 ₴",                           lbl:"гарантія ФГВФО на банк" },
            { val:"19.5%",                               lbl:"ПДФО 18% + вз 1.5%" },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{ background:T.greenLt, borderRadius:12, padding:"10px 16px", minWidth:110 }}>
              <div style={{ fontSize:20, fontWeight:700, color:T.green }}>{val}</div>
              <div style={{ fontSize:11, color:T.gray, marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ФГВФО */}
      <div style={{ background:T.greenLt, border:`1.5px solid ${T.green}`, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", gap:12, alignItems:"center" }}>
        <span style={{ fontSize:24, flexShrink:0 }}>🛡</span>
        <div style={{ fontSize:13, lineHeight:1.65 }}>
          <strong style={{ color:T.green }}>ФГВФО гарантує 600 000 ₴</strong> на одного вкладника в одному банку.
          Усі банки в таблиці є членами Фонду гарантування вкладів.
          Перевірити статус банку: <a href="https://www.fg.gov.ua" target="_blank" rel="nofollow noopener" style={{ color:T.green, fontWeight:700 }}>fg.gov.ua</a>
        </div>
      </div>

      {/* Table controls */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", gap:12, fontSize:11, color:T.gray, flexWrap:"wrap", alignItems:"center" }}>
          {Object.entries(TYPE).map(([k, v]) => (
            <span key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:4, background:v.bg, color:v.c }}>{v.label}</span> {k === "state" ? "Державний" : k === "foreign" ? "Іноземний" : "Приватний"}
            </span>
          ))}
          <span>— Ставка відсутня</span>
        </div>
        <div style={{ display:"flex", border:`1.5px solid ${T.border}`, borderRadius:8, overflow:"hidden" }}>
          {["uah","eur"].map(c => (
            <button key={c} onClick={() => setCur(c)} style={{ padding:"6px 16px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, background:cur===c?T.green:T.white, color:cur===c?"white":T.gray }}>
              {c === "uah" ? "₴ UAH" : "€ EUR"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize:11, color:T.gray, marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}/>
        Оновлено: {updated || "—"} · Відсортовано за ставкою ↓, потім за рейтингом капіталу НБУ
      </div>

      {/* Table */}
      <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:10 }}>
        <div style={{ display:"grid", gridTemplateColumns:col, padding:"8px 14px", background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em", alignItems:"center", gap:4 }}>
          {["#НБУ","ТИП","БАНК","12 МІС.","ПІСЛЯ ПДТ","МІН. СУМА","ФГВФО","МІЙ КАПІТАЛ"].map(h => <div key={h}>{h}</div>)}
        </div>

        {!rates && <div style={{ padding:24, textAlign:"center", color:T.gray, fontSize:13 }}>⏳ Завантажуємо дані...</div>}

        {rates && sorted.map((bank, i) => {
          const isTop  = i === 0 && bank.rate_12m !== null;
          const empty  = bank.rate_12m === null;
          const tp     = TYPE[bank.type];
          const isDone = !!added[bank.id];
          return (
            <a key={bank.id} href={bank.url} target="_blank" rel="nofollow noopener" style={{
              display:"grid", gridTemplateColumns:col, padding:"11px 14px", alignItems:"center", gap:4,
              borderTop:`1px solid ${T.border}`, background:isTop?T.greenLt:T.white, opacity:empty?0.5:1,
              textDecoration:"none", color:"inherit", cursor:"pointer",
            }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#bbb" }}>{bank.rank}</div>
              <div><span style={{ fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:4, background:tp.bg, color:tp.c }}>{tp.label}</span></div>
              <div style={{ fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                {bank.name}
                {isTop && <span style={{ fontSize:9, background:T.green, color:"white", padding:"2px 6px", borderRadius:20, fontWeight:700 }}>Топ</span>}
                <span style={{ fontSize:11, color:T.gray }}>↗</span>
              </div>
              <div>
                {empty ? <span style={{ color:"#ccc" }}>—</span> : <span style={{ fontSize:17, fontWeight:700, color:T.green }}>{bank.rate_12m}%</span>}
              </div>
              <div>
                {empty ? <span style={{ color:"#ccc" }}>—</span> : (
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.amber }}>{net(bank.rate_12m)}%</div>
                    <div style={{ fontSize:10, color:T.gray }}>−19.5%</div>
                  </div>
                )}
              </div>
              <div style={{ fontSize:12, color:T.gray }}>{S}{Number(bank.min).toLocaleString("uk-UA")}</div>
              <div>
                <span style={{ fontSize:11, color:T.green, fontWeight:600 }}>✓ ФГВФО</span>
              </div>
              <div>
                {empty
                  ? <span style={{ fontSize:11, color:"#ccc" }}>немає даних</span>
                  : <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(bank); }} style={{ width:"100%", padding:"6px 8px", borderRadius:7, fontSize:11, fontWeight:700, cursor:"pointer", border:`1.5px solid ${isDone?T.green:T.border}`, background:isDone?T.greenLt:T.white, color:isDone?T.green:T.gray }}>
                      {isDone ? "✓ Додано" : "+ Капітал"}
                    </button>}
              </div>
            </a>
          );
        })}
      </div>
      <p style={{ fontSize:11, color:T.gray }}>
        Ставки на основі офіційних сайтів банків. ФГВФО: <a href="https://www.fg.gov.ua" target="_blank" rel="nofollow" style={{ color:T.green }}>fg.gov.ua</a>
      </p>

      <div style={{ height:1, background:T.border, margin:"36px 0" }}/>

      {/* FAQ */}
      <section style={{ marginBottom:40 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>ЧАСТІ ЗАПИТАННЯ</div>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"0 0 14px" }}>Депозити — що потрібно знати</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{ border:`1.5px solid ${open?T.green:T.border}`, borderRadius:12, overflow:"hidden" }}>
                <button onClick={() => setOpenFaq(open?null:i)} style={{ width:"100%", textAlign:"left", padding:"13px 16px", background:open?T.greenLt:T.white, border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:14, fontWeight:600, color:T.dark, gap:10 }}>
                  {item.q}
                  <span style={{ fontSize:20, color:T.green, flexShrink:0, transform:open?"rotate(45deg)":"none", transition:"transform .2s" }}>+</span>
                </button>
                {open && <div style={{ padding:"0 16px 13px", fontSize:14, color:T.gray, lineHeight:1.75, background:T.greenLt }}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:T.dark, borderRadius:16, padding:"28px 32px", textAlign:"center" }}>
        <div style={{ fontSize:20, fontWeight:700, color:"white", marginBottom:8 }}>Порівняй депозит з ОВДП та ETF</div>
        <p style={{ color:"#9FE1CB", margin:"0 0 20px", fontSize:14 }}>Додай до портфеля і побачиш скільки накопичиш за 10 років.</p>
        <a href="/kalkulator" style={{ display:"inline-block", padding:"11px 26px", background:T.green, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
