"use client";
// porahovano.in.ua/alternatyvni — /app/alternatyvni/page.jsx

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

// ─── Crypto data ──────────────────────────────────────────────────────────────
const COINS = [
  { id:"bitcoin",     sym:"BTC",  name:"Bitcoin",    color:"#F7931A", icon:"₿", risk:"high" },
  { id:"ethereum",    sym:"ETH",  name:"Ethereum",   color:"#627EEA", icon:"Ξ", risk:"high" },
  { id:"solana",      sym:"SOL",  name:"Solana",     color:"#9945FF", icon:"◎", risk:"high" },
  { id:"binancecoin", sym:"BNB",  name:"BNB",        color:"#F3BA2F", icon:"B", risk:"high" },
  { id:"avalanche-2", sym:"AVAX", name:"Avalanche",  color:"#E84142", icon:"A", risk:"high" },
  { id:"cardano",     sym:"ADA",  name:"Cardano",    color:"#0033AD", icon:"₳", risk:"high" },
  { id:"polkadot",    sym:"DOT",  name:"Polkadot",   color:"#E6007A", icon:"●", risk:"high" },
  { id:"chainlink",   sym:"LINK", name:"Chainlink",  color:"#2A5ADA", icon:"⬡", risk:"high" },
];

const STAKING = [
  { id:"s1", sym:"ETH",  name:"Ethereum (ETH)",  sub:"Liquid staking · Lido",    rate:"~4%",  net:"~3.2%", platform:"Lido / Coinbase" },
  { id:"s2", sym:"SOL",  name:"Solana (SOL)",    sub:"Native staking · Phantom", rate:"~7%",  net:"~5.6%", platform:"Phantom / Binance" },
  { id:"s3", sym:"ATOM", name:"Cosmos (ATOM)",   sub:"Native staking · Keplr",   rate:"~15%", net:"~12.1%",platform:"Keplr wallet" },
  { id:"s4", sym:"ADA",  name:"Cardano (ADA)",   sub:"Delegation · Daedalus",    rate:"~4%",  net:"~3.2%", platform:"Daedalus / Eternl" },
  { id:"s5", sym:"BNB",  name:"BNB (Binance)",   sub:"Simple Earn · Binance",    rate:"~2%",  net:"~1.6%", platform:"Binance Earn" },
];

const STABLECOINS = [
  { id:"st1", name:"USDC · Coinbase",   sub:"USD Coin · регульований · аудитований",  rate:"4.5%", net:"3.6%", risk:"mid" },
  { id:"st2", name:"USDT · Binance Earn",sub:"Tether · найбільший стейблкоїн",        rate:"5%",   net:"4%",   risk:"mid" },
  { id:"st3", name:"USDC · Aave DeFi",  sub:"Децентралізований протокол позик",       rate:"4–8%", net:"3.2–6.4%", risk:"high" },
  { id:"st4", name:"DAI · Maker DSR",   sub:"Decentralized stablecoin · MakerDAO",    rate:"6%",   net:"4.8%", risk:"high" },
];

// ─── Realty ───────────────────────────────────────────────────────────────────
const REALTY_UA = [
  { id:"r_ua1", name:"FEST Hospitality", sub:"Готельна мережа · Львів, Київ", rate:14, min:"300 000 ₴", desc:"Апарт-готель під управлінням. 10+ об'єктів з 2012 року. Стратегія виходу: продаж або переуступка.", featured:true },
  { id:"r_ua2", name:"Ribas Hotels",     sub:"Мережа · вся Україна",          rate:12, min:"250 000 ₴", desc:"Апарт-готель. Локації: 15+ міст України. Управляюча компанія бере 20–25%.", featured:false },
  { id:"r_ua3", name:"YWHO Group",       sub:"Co-living · Київ, Одеса",       rate:11, min:"200 000 ₴", desc:"Co-living апартаменти. Цільова аудиторія: молоді фахівці. Щомісячні виплати.", featured:false },
];

const REIT = [
  { id:"reit1", ticker:"IPRP", name:"iShares Europe Property",  sub:"Нерухомість Європи · LSE", rate:6,  net:4.8 },
  { id:"reit2", ticker:"IWDP", name:"iShares Global Property",  sub:"Глобальна нерухомість · LSE",rate:5, net:4.0 },
];

// ─── Metals & Energy ──────────────────────────────────────────────────────────
const METALS = [
  { id:"m1", icon:"🥇", ticker:"IGLN", name:"iShares Physical Gold",           sub:"Фізичне золото · IBKR · LSE · EUR",         rate:7, risk:"low" },
  { id:"m2", icon:"🥈", ticker:"ISLN", name:"iShares Physical Silver",         sub:"Фізичне срібло · IBKR · LSE · EUR",         rate:8, risk:"mid" },
  { id:"m3", icon:"⚪", ticker:"SPPT", name:"WisdomTree Physical Platinum",    sub:"Фізична платина · IBKR · LSE · EUR",        rate:3, risk:"mid" },
  { id:"m4", icon:"🔶", ticker:"AIGA", name:"iShares Diversified Commodity",   sub:"Диверсифіковані метали та сировина",        rate:5, risk:"mid" },
];

const ENERGY = [
  { id:"e1", icon:"🛢", ticker:"OILW", name:"WisdomTree Brent Crude Oil",      sub:"Нафта Brent · IBKR · LSE · EUR · волатильний", rate:8,  risk:"high" },
  { id:"e2", icon:"⚡", ticker:"XDEW", name:"Xtrackers MSCI World Energy",     sub:"Глобальний енергетичний сектор · LSE",         rate:7,  risk:"mid"  },
  { id:"e3", icon:"☀️", ticker:"INRG", name:"iShares Global Clean Energy",    sub:"Відновлювана енергетика · сонце, вітер",       rate:2,  risk:"high" },
  { id:"e4", icon:"🌾", ticker:"CMOD", name:"iShares Diversified Commodity",   sub:"Нафта, газ, зерно, метали — кошик",           rate:5,  risk:"mid"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const RISK_STYLE = {
  low:  { bg:T.greenLt, c:T.green,   label:"Низький" },
  mid:  { bg:"#FFF8EC", c:"#D4891E", label:"Середній" },
  high: { bg:"#FAECE7", c:"#C0392B", label:"Високий" },
};

function RiskBadge({ risk }) {
  const r = RISK_STYLE[risk];
  return <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:r.bg, color:r.c, fontWeight:600 }}>{r.label}</span>;
}

function AddBtn({ id, name, added, onAdd }) {
  return (
    <button onClick={() => onAdd(id, name)} style={{
      width:"100%", padding:"6px 8px", borderRadius:8, fontSize:11, fontWeight:700,
      cursor: added ? "default" : "pointer",
      border:`1.5px solid ${added ? T.green : T.border}`,
      background: added ? T.greenLt : T.white,
      color: added ? T.green : T.gray,
    }}>{added ? "✓ Додано" : "+ Капітал"}</button>
  );
}

function Label({ children }) {
  return <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".1em", marginBottom:8 }}>{children}</div>;
}

function Toast({ name, onClose }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, background:T.dark, color:"white", borderRadius:12, padding:"14px 18px", boxShadow:"0 8px 24px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:12, maxWidth:300 }}>
      <span style={{fontSize:18}}>✓</span>
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{name} — додано</div>
        <a href="/kalkulator" style={{fontSize:12,color:T.amber,textDecoration:"none"}}>Перейти до «Мій капітал» →</a>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18,padding:0,marginLeft:"auto"}}>×</button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AlternatyvniPage() {
  const [mainTab,    setMainTab]    = useState("crypto");
  const [cryptoTab,  setCryptoTab]  = useState("coins");
  const [mcTab,      setMcTab]      = useState("metals");
  const [prices,     setPrices]     = useState({});
  const [priceState, setPriceState] = useState("loading"); // loading | ok | error
  const [added,      setAdded]      = useState({});
  const [toast,      setToast]      = useState(null);

  // Live crypto prices
  useEffect(() => {
    const ids = COINS.map(c => c.id).join(",");
    const load = async () => {
      try {
        const res  = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        setPrices(data);
        setPriceState("ok");
      } catch {
        setPriceState("error");
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  function handleAdd(id, name) {
    if (added[id]) return;
    setAdded(p => ({ ...p, [id]: true }));
    setToast(name);
    setTimeout(() => setToast(null), 4000);
  }

  const tabStyle = (active) => ({
    flex:1, padding:"12px 8px", border:"none", cursor:"pointer",
    fontSize:13, fontWeight:700, transition:"all .15s", textAlign:"center",
    background: active ? T.green : T.white,
    color: active ? "white" : T.gray,
    borderRight:`1px solid ${T.border}`,
  });

  const subTabStyle = (active, activeColor = T.dark) => ({
    padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
    border:`1.5px solid ${active ? activeColor : T.border}`,
    background: active ? activeColor : T.white,
    color: active ? "white" : T.gray,
  });

  const colGrid = (cols) => ({ display:"grid", gridTemplateColumns:cols, padding:"8px 16px", alignItems:"center" });

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>

      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a>
        <span>›</span>
        <span style={{ color:T.dark, fontWeight:600 }}>Альтернативні активи</span>
      </nav>

      {/* Hero */}
      <section style={{ marginBottom:28 }}>
        <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:12, letterSpacing:".05em" }}>ОНОВЛЕНО ЧЕРВЕНЬ 2026</div>
        <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 14px" }}>
          Альтернативні активи:<br/>
          <span style={{ color:T.green }}>крипто, нерухомість, метали, сировина</span>
        </h1>
        <p style={{ fontSize:15, color:T.gray, maxWidth:600, lineHeight:1.75, margin:"0 0 24px" }}>
          Інструменти для диверсифікації портфеля поза традиційними депозитами та облігаціями. Вищий ризик — вищий потенціал. Рекомендовано <strong>не більше 10–20% портфеля</strong>.
        </p>
      </section>

      {/* Main tabs */}
      <div style={{ display:"flex", border:`1.5px solid ${T.border}`, borderRadius:12, overflow:"hidden", marginBottom:28 }}>
        {[
          { id:"crypto", icon:"⛓", label:"Крипто" },
          { id:"realty", icon:"🏨", label:"Нерухомість" },
          { id:"metals", icon:"🥇", label:"Метали та сировина" },
        ].map((t, i, arr) => (
          <button key={t.id} onClick={() => setMainTab(t.id)} style={{ ...tabStyle(mainTab===t.id), borderRight: i<arr.length-1 ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize:18, display:"block", marginBottom:3 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ CRYPTO ══════════════════════════════════════════════════════════ */}
      {mainTab === "crypto" && (
        <div>
          {/* Live badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}>•</span>
            Живі курси · CoinGecko API · оновлення 60 сек
          </div>

          {/* Sub tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
            {[{id:"coins",label:"₿ Монети"},{id:"staking",label:"🔒 Стейкінг"},{id:"stable",label:"💵 Стейблкоїни"}].map(t => (
              <button key={t.id} onClick={() => setCryptoTab(t.id)} style={subTabStyle(cryptoTab===t.id)}>{t.label}</button>
            ))}
          </div>

          <div style={{ background:"#FAECE7", border:`1.5px solid #C0392B`, borderRadius:10, padding:"12px 16px", fontSize:12, lineHeight:1.6, marginBottom:16 }}>
            <strong style={{color:"#C0392B"}}>⚠ Високий ризик:</strong> Криптовалюти можуть втратити 50–90% вартості. Інвестуй лише те, що готовий втратити повністю.
          </div>

          {/* Coins */}
          {cryptoTab === "coins" && (
            <div>
              <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:8 }}>
                <div style={{ ...colGrid("32px 1fr 110px 110px 90px 110px"), background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
                  <div/><div>МОНЕТА</div><div>ЦІНА (USD)</div><div>ЗМІНА 24год</div><div>РИЗИК</div><div>МІЙ КАПІТАЛ</div>
                </div>
                {priceState === "loading" && <div style={{ padding:20, textAlign:"center", color:T.gray, fontSize:13 }}>⏳ Завантажуємо курси...</div>}
                {priceState === "error"   && <div style={{ padding:20, textAlign:"center", color:"#C0392B", fontSize:13 }}>⚠ Не вдалось завантажити курси. Перевірте з'єднання.</div>}
                {priceState === "ok" && COINS.map(c => {
                  const d = prices[c.id];
                  if (!d) return null;
                  const price = d.usd;
                  const chg   = d.usd_24h_change;
                  const pStr  = price >= 1000 ? "$" + price.toLocaleString("en-US", {maximumFractionDigits:0}) : "$" + price.toFixed(4);
                  return (
                    <div key={c.id} style={{ ...colGrid("32px 1fr 110px 110px 90px 110px"), borderTop:`1px solid ${T.border}` }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white" }}>{c.icon}</div>
                      <div><div style={{fontWeight:700,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:T.gray}}>{c.sym}</div></div>
                      <div style={{fontSize:14,fontWeight:700}}>{pStr}</div>
                      <div style={{fontSize:13,fontWeight:700,color:chg>=0?T.green:"#C0392B"}}>{(chg>=0?"+":"")+chg.toFixed(2)}%</div>
                      <div><RiskBadge risk={c.risk}/></div>
                      <div><AddBtn id={c.id} name={c.sym} added={!!added[c.id]} onAdd={handleAdd}/></div>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:11,color:T.gray}}>Живі дані: CoinGecko API · Оновлення кожні 60 сек</p>
            </div>
          )}

          {/* Staking */}
          {cryptoTab === "staking" && (
            <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
              <div style={{ ...colGrid("32px 1fr 90px 90px 1fr 110px"), background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
                <div/><div>АКТИВ</div><div>СТЕЙК %</div><div>ПІСЛЯ 19.5%</div><div>ПЛАТФОРМА</div><div>МІЙ КАПІТАЛ</div>
              </div>
              {STAKING.map(s => (
                <div key={s.id} style={{ ...colGrid("32px 1fr 90px 90px 1fr 110px"), borderTop:`1px solid ${T.border}` }}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white"}}>{s.sym.slice(0,2)}</div>
                  <div><div style={{fontWeight:700,fontSize:13}}>{s.name}</div><div style={{fontSize:11,color:T.gray}}>{s.sub}</div></div>
                  <div style={{fontSize:15,fontWeight:700,color:T.green}}>{s.rate}</div>
                  <div style={{fontSize:13,fontWeight:700,color:T.amber}}>{s.net}</div>
                  <div style={{fontSize:12,color:T.gray}}>{s.platform}</div>
                  <div><AddBtn id={s.id} name={s.name} added={!!added[s.id]} onAdd={handleAdd}/></div>
                </div>
              ))}
            </div>
          )}

          {/* Stablecoins */}
          {cryptoTab === "stable" && (
            <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
              <div style={{ ...colGrid("1fr 90px 90px 90px 110px"), background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
                <div>СТЕЙБЛКОЇН</div><div>СТАВКА</div><div>ПІСЛЯ 19.5%</div><div>РИЗИК</div><div>МІЙ КАПІТАЛ</div>
              </div>
              {STABLECOINS.map(s => (
                <div key={s.id} style={{ ...colGrid("1fr 90px 90px 90px 110px"), borderTop:`1px solid ${T.border}` }}>
                  <div><div style={{fontWeight:700,fontSize:13}}>{s.name}</div><div style={{fontSize:11,color:T.gray}}>{s.sub}</div></div>
                  <div style={{fontSize:15,fontWeight:700,color:T.green}}>{s.rate}</div>
                  <div style={{fontSize:13,fontWeight:700,color:T.amber}}>{s.net}</div>
                  <div><RiskBadge risk={s.risk}/></div>
                  <div><AddBtn id={s.id} name={s.name} added={!!added[s.id]} onAdd={handleAdd}/></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ REALTY ══════════════════════════════════════════════════════════ */}
      {mainTab === "realty" && (
        <div>
          <Label>НЕРУХОМІСТЬ В УКРАЇНІ</Label>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Реальні пропозиції готелів під управлінням</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {REALTY_UA.map(r => (
              <div key={r.id} style={{ border:`1.5px solid ${r.featured?T.green:T.border}`, borderRadius:14, padding:18, background:r.featured?T.greenLt:T.white }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontSize:15,fontWeight:700}}>🏨 {r.name}</div><div style={{fontSize:11,color:T.gray}}>{r.sub}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:T.green}}>{r.rate}%</div><div style={{fontSize:11,color:T.gray}}>річних · UAH</div></div>
                </div>
                <div style={{fontSize:12,color:T.gray,lineHeight:1.8,marginBottom:12}}>
                  Вхід від: <strong>{r.min}</strong><br/>{r.desc}
                </div>
                <a href="#" style={{display:"block",textAlign:"center",padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",border:`1.5px solid ${r.featured?T.green:T.border}`,background:r.featured?T.green:"transparent",color:r.featured?"white":T.dark}}>
                  Дізнатись більше →
                </a>
              </div>
            ))}
            <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,padding:18,background:T.grayLt,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",minHeight:160}}>
              <div style={{fontSize:24,marginBottom:8}}>⚠️</div>
              <div style={{fontSize:12,color:T.gray,lineHeight:1.6}}>Нерухомість — <strong>неліквідний</strong> актив.<br/>Вийти швидко не вийде. Горизонт 5+ років.</div>
            </div>
          </div>

          {/* REIT block */}
          <div style={{ background:T.grayLt, border:`1.5px solid ${T.border}`, borderRadius:14, padding:18 }}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              📈 REIT ETF через IBKR — міжнародна альтернатива
              <span style={{fontSize:11,background:T.greenLt,color:T.green,padding:"2px 8px",borderRadius:20,fontWeight:700}}>EUR · LSE</span>
            </div>
            <div style={{fontSize:12,color:T.gray,marginBottom:12}}>Інвестуй у нерухомість без фізичної купівлі — через біржові фонди на IBKR</div>
            <div style={{ ...colGrid("80px 1fr 80px 80px 110px"), fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em", borderBottom:`1px solid ${T.border}`, paddingBottom:6, marginBottom:4 }}>
              <div>ТИКЕР</div><div>НАЗВА</div><div>ДОХІДНІСТЬ</div><div>ПІСЛЯ ПДТ</div><div>МІЙ КАПІТАЛ</div>
            </div>
            {REIT.map(r => (
              <div key={r.id} style={{ ...colGrid("80px 1fr 80px 80px 110px"), borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:4 }}>
                <div style={{fontWeight:700,color:T.green,fontFamily:"monospace",fontSize:13}}>{r.ticker}</div>
                <div><div style={{fontWeight:600,fontSize:13}}>{r.name}</div><div style={{fontSize:11,color:T.gray}}>{r.sub}</div></div>
                <div style={{fontSize:14,fontWeight:700,color:T.green}}>{r.rate}%</div>
                <div style={{fontSize:13,fontWeight:700,color:T.amber}}>{r.net}%</div>
                <div><AddBtn id={r.id} name={r.ticker} added={!!added[r.id]} onAdd={handleAdd}/></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ METALS & ENERGY ════════════════════════════════════════════════ */}
      {mainTab === "metals" && (
        <div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {[{id:"metals",label:"🥇 Метали"},{id:"energy",label:"🛢 Енергетика"}].map(t => (
              <button key={t.id} onClick={() => setMcTab(t.id)} style={subTabStyle(mcTab===t.id, T.amber)}>{t.label}</button>
            ))}
          </div>

          {(mcTab === "metals" ? METALS : ENERGY).map((item, i, arr) => (
            <div key={item.id} style={{ display:"grid", gridTemplateColumns:"50px 1fr 90px 110px 80px 110px", padding:"12px 16px", alignItems:"center", border:`1px solid ${T.border}`, borderTop: i===0 ? `1.5px solid ${T.border}` : "none", borderRadius: i===0 ? "14px 14px 0 0" : i===arr.length-1 ? "0 0 14px 14px" : 0, background: i===0 ? T.greenLt : T.white }}>
              <div style={{fontSize:22}}>{item.icon}</div>
              <div><div style={{fontWeight:700,fontSize:13,fontFamily:"monospace",color:T.green}}>{item.ticker} <span style={{fontFamily:"inherit",color:T.dark,fontWeight:600,fontSize:13}}>· {item.name}</span></div><div style={{fontSize:11,color:T.gray,marginTop:2}}>{item.sub}</div></div>
              <div style={{fontSize:16,fontWeight:700,color:T.green}}>~{item.rate}%</div>
              <div><div style={{fontSize:13,fontWeight:700,color:T.amber}}>~{(item.rate*0.805).toFixed(1)}%</div><div style={{fontSize:10,color:T.gray}}>−19.5%</div></div>
              <div><RiskBadge risk={item.risk}/></div>
              <div><AddBtn id={item.id} name={item.ticker} added={!!added[item.id]} onAdd={handleAdd}/></div>
            </div>
          ))}
          <p style={{fontSize:11,color:T.gray,marginTop:8}}>Дохідність — середня за 5 років. Інструменти доступні через IBKR на LSE в EUR.</p>
        </div>
      )}

      {/* CTA */}
      <div style={{ background:T.dark, borderRadius:16, padding:"28px 32px", textAlign:"center", marginTop:40 }}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Збери диверсифікований портфель</div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>Додай альтернативні активи поруч з депозитами, ОВДП та ETF у «Мій капітал».</p>
        <a href="/kalkulator" style={{display:"inline-block",padding:"11px 26px",background:T.green,color:"white",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none"}}>Відкрити «Мій капітал» →</a>
      </div>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
