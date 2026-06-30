"use client";
// porahovano.in.ua/alternatyvni — /app/alternatyvni/page.jsx
// Крипто: реальна дохідність за 12 міс через CoinGecko market_chart
// Нерухомість: реальні компанії з /public/data/rates.json

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const COINS = [
  { id:"bitcoin",     sym:"BTC",  name:"Bitcoin",    color:"#F7931A", icon:"₿" },
  { id:"ethereum",    sym:"ETH",  name:"Ethereum",   color:"#627EEA", icon:"Ξ" },
  { id:"solana",      sym:"SOL",  name:"Solana",     color:"#9945FF", icon:"◎" },
  { id:"binancecoin", sym:"BNB",  name:"BNB",        color:"#F3BA2F", icon:"B" },
  { id:"avalanche-2", sym:"AVAX", name:"Avalanche",  color:"#E84142", icon:"A" },
  { id:"cardano",     sym:"ADA",  name:"Cardano",    color:"#0033AD", icon:"₳" },
  { id:"polkadot",    sym:"DOT",  name:"Polkadot",   color:"#E6007A", icon:"●" },
  { id:"chainlink",   sym:"LINK", name:"Chainlink",  color:"#2A5ADA", icon:"⬡" },
];

const STAKING = [
  { id:"s1", sym:"ETH",  name:"Ethereum (ETH)",  sub:"Liquid staking · Lido",    rate:"~4%",  net:"~3.2%", platform:"Lido / Coinbase" },
  { id:"s2", sym:"SOL",  name:"Solana (SOL)",    sub:"Native staking · Phantom", rate:"~7%",  net:"~5.6%", platform:"Phantom / Binance" },
  { id:"s3", sym:"ATOM", name:"Cosmos (ATOM)",   sub:"Native staking · Keplr",   rate:"~15%", net:"~12.1%",platform:"Keplr wallet" },
  { id:"s4", sym:"ADA",  name:"Cardano (ADA)",   sub:"Delegation · Daedalus",    rate:"~4%",  net:"~3.2%", platform:"Daedalus / Eternl" },
  { id:"s5", sym:"BNB",  name:"BNB (Binance)",   sub:"Simple Earn · Binance",    rate:"~2%",  net:"~1.6%", platform:"Binance Earn" },
];

const STABLECOINS = [
  { id:"st1", name:"USDC · Coinbase",    sub:"USD Coin · регульований · аудитований",  rate:"4.5%", net:"3.6%", risk:"mid" },
  { id:"st2", name:"USDT · Binance Earn",sub:"Tether · найбільший стейблкоїн",         rate:"5%",   net:"4%",   risk:"mid" },
  { id:"st3", name:"USDC · Aave DeFi",   sub:"Децентралізований протокол позик",       rate:"4–8%", net:"3.2–6.4%", risk:"high" },
  { id:"st4", name:"DAI · Maker DSR",    sub:"Decentralized stablecoin · MakerDAO",    rate:"6%",   net:"4.8%", risk:"high" },
];

const RISK_STYLE = {
  low:{bg:T.greenLt,c:T.green,label:"Низький"}, mid:{bg:"#FFF8EC",c:"#D4891E",label:"Середній"}, high:{bg:"#FAECE7",c:"#C0392B",label:"Високий"},
};

function RiskBadge({ risk }) { const r = RISK_STYLE[risk]; return <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:r.bg,color:r.c,fontWeight:600}}>{r.label}</span>; }
function AddBtn({ id, name, added, onAdd }) {
  return <button onClick={() => onAdd(id,name)} style={{width:"100%",padding:"6px 8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:added?"default":"pointer",border:`1.5px solid ${added?T.green:T.border}`,background:added?T.greenLt:T.white,color:added?T.green:T.gray}}>{added?"✓ Додано":"+ Капітал"}</button>;
}
function Label({ children }) { return <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:8}}>{children}</div>; }
function Toast({ name, onClose }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, background:T.dark, color:"white", borderRadius:12, padding:"14px 18px", boxShadow:"0 8px 24px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:12, maxWidth:300 }}>
      <span>✓</span>
      <div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{name} — додано</div><a href="/kalkulator" style={{fontSize:12,color:T.amber,textDecoration:"none"}}>Перейти до «Мій капітал» →</a></div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18,padding:0,marginLeft:"auto"}}>×</button>
    </div>
  );
}

function MetalsSection() {
  const [tab, setTab] = useState("metals");
  const [commodities, setCommodities] = useState([]);
  const [returns, setReturns] = useState(null);
  const [state, setState] = useState("loading");
  const [added, setAdded] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("/data/rates.json").then(r=>r.json()).then(d => setCommodities(d.commodities || []));
  }, []);
  useEffect(() => {
    fetch("/api/etf-returns").then(r=>r.json()).then(d => { setReturns(d.results); setState("ok"); }).catch(() => setState("error"));
  }, []);

  function handleAdd(id, name) {
    if (added[id]) return;
    setAdded(p => ({ ...p, [id]: true }));
    setToast(name);
    setTimeout(() => setToast(null), 4000);
  }

  const merged = commodities.map(c => ({ ...c, rate: returns?.[c.id]?.ok ? returns[c.id].returnPct : null }));
  const filtered = merged.filter(c => c.sector === tab).filter(c => c.rate !== null).sort((a,b) => b.rate - a.rate);
  const colGrid = "50px 1fr 90px 110px 80px 110px";

  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[{id:"metals",label:"🥇 Метали"},{id:"energy",label:"🛢 Енергетика"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:`1.5px solid ${tab===t.id?T.amber:T.border}`, background:tab===t.id?T.amber:T.white, color:tab===t.id?"white":T.gray }}>{t.label}</button>
        ))}
      </div>

      {state === "loading" && <div style={{padding:30,textAlign:"center",color:T.gray,fontSize:13,border:`1.5px dashed ${T.border}`,borderRadius:14}}>⏳ Рахуємо дохідність за 12 місяців...</div>}
      {state === "error" && <div style={{padding:30,textAlign:"center",color:"#C0392B",fontSize:13,border:"1.5px dashed #C0392B",borderRadius:14}}>⚠ Не вдалось завантажити дані.</div>}

      {state === "ok" && filtered.map((item, i, arr) => {
        const isDone = !!added[item.id];
        return (
          <div key={item.id} style={{ display:"grid", gridTemplateColumns:colGrid, padding:"12px 16px", alignItems:"center", border:`1px solid ${T.border}`, borderTop: i===0 ? `1.5px solid ${T.border}` : "none", borderRadius: i===0 ? "14px 14px 0 0" : i===arr.length-1 ? "0 0 14px 14px" : 0, background: i===0 ? T.greenLt : T.white }}>
            <div style={{fontSize:22}}>{item.sector==="metals"?"🥇":"🛢"}</div>
            <div><div style={{fontWeight:700,fontSize:13,fontFamily:"monospace",color:T.green}}>{item.ticker} <span style={{fontFamily:"inherit",color:T.dark,fontWeight:600,fontSize:13}}>· {item.name}</span></div><div style={{fontSize:11,color:T.gray,marginTop:2}}>{item.sub}</div></div>
            <div style={{fontSize:16,fontWeight:700,color:item.rate>=0?T.green:"#C0392B"}}>{item.rate>=0?"+":""}{item.rate}%</div>
            <div><div style={{fontSize:13,fontWeight:700,color:T.amber}}>{(item.rate*0.805).toFixed(1)}%</div><div style={{fontSize:10,color:T.gray}}>−19.5%</div></div>
            <div><RiskBadge risk={item.risk}/></div>
            <div><AddBtn id={item.id} name={item.ticker} added={isDone} onAdd={handleAdd}/></div>
          </div>
        );
      })}
      <p style={{fontSize:11,color:T.gray,marginTop:8}}>Дохідність за останні 12 місяців через Yahoo Finance. Доступні через IBKR на LSE в EUR.</p>
      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

export default function AlternatyvniPage() {


  const [mainTab,    setMainTab]    = useState("crypto");
  const [cryptoTab,  setCryptoTab]  = useState("coins");
  const [mcTab,      setMcTab]      = useState("metals");
  const [coinReturns,setCoinReturns]= useState({});
  const [coinState,  setCoinState]  = useState("loading");
  const [added,      setAdded]      = useState({});
  const [toast,      setToast]      = useState(null);
  const [rates,      setRates]      = useState(null);

  useEffect(() => { fetch("/data/rates.json").then(r=>r.json()).then(setRates).catch(()=>setRates(null)); }, []);

  // Реальна дохідність крипто за 12 місяців через CoinGecko market_chart
  useEffect(() => {
    async function loadReturns() {
      const results = {};
      await Promise.all(COINS.map(async (c) => {
        try {
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${c.id}/market_chart?vs_currency=usd&days=365&interval=daily`);
          const data = await res.json();
          const prices = data.prices;
          if (!prices || prices.length < 2) throw new Error("no data");
          const priceNow = prices[prices.length-1][1];
          const price1yAgo = prices[0][1];
          const returnPct = ((priceNow - price1yAgo) / price1yAgo) * 100;
          results[c.id] = { ok:true, priceNow, returnPct: +returnPct.toFixed(1) };
        } catch {
          results[c.id] = { ok:false };
        }
      }));
      setCoinReturns(results);
      setCoinState("ok");
    }
    loadReturns();
  }, []);

  function handleAdd(id, name) {
    if (added[id]) return;
    setAdded(p => ({ ...p, [id]: true }));
    setToast(name);
    setTimeout(() => setToast(null), 4000);
  }

  const tabStyle = (active) => ({ flex:1, padding:"12px 8px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, transition:"all .15s", textAlign:"center", background:active?T.green:T.white, color:active?"white":T.gray, borderRight:`1px solid ${T.border}` });
  const subTabStyle = (active, activeColor=T.dark) => ({ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:`1.5px solid ${active?activeColor:T.border}`, background:active?activeColor:T.white, color:active?"white":T.gray });
  const colGrid = (cols) => ({ display:"grid", gridTemplateColumns:cols, padding:"8px 16px", alignItems:"center" });

  const realtyUa = rates?.realty_ua ?? [];
  const reit      = rates?.reit ?? [];

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>
      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a><span>›</span><span style={{ color:T.dark, fontWeight:600 }}>Альтернативні активи</span>
      </nav>

      <section style={{ marginBottom:28 }}>
        <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:12 }}>ЖИВІ ДАНІ · COINGECKO</div>
        <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 14px" }}>
          Альтернативні активи:<br/><span style={{ color:T.green }}>крипто, нерухомість, метали, сировина</span>
        </h1>
        <p style={{ fontSize:15, color:T.gray, maxWidth:600, lineHeight:1.75, margin:"0 0 24px" }}>
          Інструменти для диверсифікації портфеля. Вищий ризик — вищий потенціал. Рекомендовано <strong>не більше 10–20% портфеля</strong>.
        </p>
      </section>

      <div style={{ display:"flex", border:`1.5px solid ${T.border}`, borderRadius:12, overflow:"hidden", marginBottom:28 }}>
        {[{id:"crypto",icon:"⛓",label:"Крипто"},{id:"realty",icon:"🏨",label:"Нерухомість"},{id:"metals",icon:"🥇",label:"Метали та сировина"}].map((t,i,arr) => (
          <button key={t.id} onClick={() => setMainTab(t.id)} style={{ ...tabStyle(mainTab===t.id), borderRight: i<arr.length-1?`1px solid ${T.border}`:"none" }}>
            <span style={{ fontSize:18, display:"block", marginBottom:3 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ══ CRYPTO ══ */}
      {mainTab === "crypto" && (
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:T.greenLt, color:T.green, fontSize:11, fontWeight:700, marginBottom:14 }}>
            Реальна дохідність за 12 місяців · CoinGecko
          </div>

          <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
            {[{id:"coins",label:"₿ Монети"},{id:"staking",label:"🔒 Стейкінг"},{id:"stable",label:"💵 Стейблкоїни"}].map(t => (
              <button key={t.id} onClick={() => setCryptoTab(t.id)} style={subTabStyle(cryptoTab===t.id)}>{t.label}</button>
            ))}
          </div>

          <div style={{ background:"#FAECE7", border:"1.5px solid #C0392B", borderRadius:10, padding:"12px 16px", fontSize:12, lineHeight:1.6, marginBottom:16 }}>
            <strong style={{color:"#C0392B"}}>⚠ Високий ризик:</strong> Криптовалюти можуть втратити 50–90% вартості. Інвестуй лише те, що готовий втратити повністю.
          </div>

          {cryptoTab === "coins" && (
            <div>
              <div style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", marginBottom:8 }}>
                <div style={{ ...colGrid("32px 1fr 110px 110px 110px"), background:T.grayLt, fontSize:10, fontWeight:700, color:T.gray, letterSpacing:".04em" }}>
                  <div/><div>МОНЕТА</div><div>ЦІНА (USD)</div><div>ЗА 12 МІС.</div><div>МІЙ КАПІТАЛ</div>
                </div>
                {coinState === "loading" && <div style={{ padding:20, textAlign:"center", color:T.gray, fontSize:13 }}>⏳ Рахуємо дохідність за 12 місяців...</div>}
                {coinState === "ok" && COINS.map(c => {
                  const r = coinReturns[c.id];
                  if (!r?.ok) return (
                    <div key={c.id} style={{ ...colGrid("32px 1fr 110px 110px 110px"), borderTop:`1px solid ${T.border}` }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white" }}>{c.icon}</div>
                      <div><div style={{fontWeight:700,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:T.gray}}>{c.sym}</div></div>
                      <div colSpan={2} style={{fontSize:12,color:"#ccc"}}>немає даних</div><div/>
                    </div>
                  );
                  const pStr = r.priceNow >= 1000 ? "$"+r.priceNow.toLocaleString("en-US",{maximumFractionDigits:0}) : "$"+r.priceNow.toFixed(4);
                  return (
                    <div key={c.id} style={{ ...colGrid("32px 1fr 110px 110px 110px"), borderTop:`1px solid ${T.border}` }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white" }}>{c.icon}</div>
                      <div><div style={{fontWeight:700,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:T.gray}}>{c.sym}</div></div>
                      <div style={{fontSize:14,fontWeight:700}}>{pStr}</div>
                      <div style={{fontSize:15,fontWeight:700,color:r.returnPct>=0?T.green:"#C0392B"}}>{r.returnPct>=0?"+":""}{r.returnPct}%</div>
                      <div><AddBtn id={c.id} name={c.sym} added={!!added[c.id]} onAdd={handleAdd}/></div>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:11,color:T.gray}}>Формула: (ціна сьогодні − ціна рік тому) / ціна рік тому × 100. Джерело: CoinGecko API.</p>
            </div>
          )}

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

      {/* ══ REALTY ══ */}
      {mainTab === "realty" && (
        <div>
          <Label>НЕРУХОМІСТЬ В УКРАЇНІ</Label>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Реальні пропозиції — натисни щоб перейти на сайт</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {realtyUa.map((r, i) => (
              <a key={r.id} href={r.url} target="_blank" rel="nofollow noopener" style={{ textDecoration:"none", color:"inherit", border:`1.5px solid ${i===0?T.green:T.border}`, borderRadius:14, padding:18, background:i===0?T.greenLt:T.white, display:"block" }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontSize:15,fontWeight:700}}>🏨 {r.name} <span style={{fontSize:11,color:T.gray}}>↗</span></div><div style={{fontSize:11,color:T.gray}}>{r.sub}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:T.green}}>{r.rate}%</div><div style={{fontSize:11,color:T.gray}}>прогнозована дохідність</div></div>
                </div>
                <div style={{fontSize:12,color:T.gray,lineHeight:1.8,marginBottom:12}}>Вхід від: <strong>{r.min}</strong><br/>{r.desc}</div>
                <div style={{display:"block",textAlign:"center",padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,border:`1.5px solid ${i===0?T.green:T.border}`,background:i===0?T.green:"transparent",color:i===0?"white":T.dark}}>
                  Перейти на сайт →
                </div>
              </a>
            ))}
            <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,padding:18,background:T.grayLt,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",minHeight:160}}>
              <div style={{fontSize:24,marginBottom:8}}>⚠️</div>
              <div style={{fontSize:12,color:T.gray,lineHeight:1.6}}>Нерухомість — <strong>неліквідний</strong> актив.<br/>Вийти швидко не вийде. Горизонт 5+ років.</div>
            </div>
          </div>

          {reit.length > 0 && (
            <div style={{ background:T.grayLt, border:`1.5px solid ${T.border}`, borderRadius:14, padding:18 }}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                📈 REIT ETF через IBKR — міжнародна альтернатива
                <span style={{fontSize:11,background:T.greenLt,color:T.green,padding:"2px 8px",borderRadius:20,fontWeight:700}}>EUR · LSE</span>
              </div>
              <div style={{fontSize:12,color:T.gray,marginBottom:12}}>Інвестуй у нерухомість без фізичної купівлі — через біржові фонди на IBKR</div>
              {reit.map(r => (
                <div key={r.id} style={{ ...colGrid("80px 1fr 110px"), borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:4 }}>
                  <div style={{fontWeight:700,color:T.green,fontFamily:"monospace",fontSize:13}}>{r.ticker}</div>
                  <div><div style={{fontWeight:600,fontSize:13}}>{r.name}</div><div style={{fontSize:11,color:T.gray}}>{r.sub}</div></div>
                  <div style={{fontSize:11,color:T.gray}}>дохідність на /etf</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ METALS & ENERGY ══ */}
      {mainTab === "metals" && (
        <MetalsSection />
      )}

      <div style={{ background:T.dark, borderRadius:16, padding:"28px 32px", textAlign:"center", marginTop:40 }}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Збери диверсифікований портфель</div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>Додай альтернативні активи поруч з депозитами, ОВДП та ETF.</p>
        <a href="/kalkulator" style={{display:"inline-block",padding:"11px 26px",background:T.green,color:"white",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none"}}>Відкрити «Мій капітал» →</a>
      </div>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
