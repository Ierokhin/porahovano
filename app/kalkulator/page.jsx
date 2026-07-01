"use client";
// porahovano.in.ua/kalkulator — /app/kalkulator/page.jsx
import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── Brand ───────────────────────────────────────────────────────────────────
const G  = "#0F6E56";
const A  = "#EF9F27";
const D  = "#1A2E2A";
const M  = "#E1F5EE";
const SU = "#F5FAF8";
const PALETTE = ["#0F6E56","#1A8C6E","#3BAD8A","#EF9F27","#D4891E","#3B82C4","#8B5CF6","#EC4899","#14B8A6","#F97316"];

// ─── Static catalogue (fallback поки rates.json не завантажився) ─────────────
const CATEGORIES_DEFAULT = [
  { id:"deposit", name:"Депозити", icon:"🏦", products:[]},
  { id:"ovdp",    name:"ОВДП",     icon:"📜", products:[]},
  { id:"npf",     name:"НПФ",      icon:"🏛", products:[]},
  { id:"etf",     name:"ETF",      icon:"📈", products:[
    {id:"e2",name:"CSPX",sub:"S&P 500 · EUR",    rate:9.5,cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
    {id:"e1",name:"VWCE",sub:"All World · EUR",   rate:8.5,cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
    {id:"e3",name:"EUNL",sub:"iShares Core · EUR",rate:8,  cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
  ]},
  { id:"crypto", name:"Блокчейн", icon:"⛓", products:[
    {id:"c3",name:"Bitcoin",     sub:"BTC · волатильний",rate:15,cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
    {id:"c1",name:"Binance Earn",sub:"USDT stable",      rate:5, cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
    {id:"c2",name:"Aave DeFi",   sub:"USDC stable",      rate:4, cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
  ]},
  { id:"realty", name:"Нерухомість", icon:"🏨", products:[
    {id:"r1",name:"Ribas Invest",sub:"UAH",rate:12,cur:"uah",tax:0.195,risk:"mid",gtee:"Немає"},
    {id:"r2",name:"ARCHotel",    sub:"UAH",rate:13.4,cur:"uah",tax:0.195,risk:"mid",gtee:"Немає"},
  ]},
  { id:"gold", name:"Золото", icon:"🥇", products:[
    {id:"g1",name:"Gold ETF IGLN",sub:"EUR · LSE",rate:7,cur:"eur",tax:0.195,risk:"low",gtee:"Немає"},
  ]},
];

// ─── Build categories from rates.json ────────────────────────────────────────
function buildCategories(rates) {
  if (!rates) return CATEGORIES_DEFAULT;

  // Депозити UAH + EUR з rates.json (тільки ті що мають ставку)
  const depoUah = (rates.depozyty?.uah ?? [])
    .filter(b => b.rate_12m !== null)
    .sort((a,b) => b.rate_12m - a.rate_12m)
    .map(b => ({ id:`d_${b.id}`, name:b.name, sub:`UAH · 12 міс.`, rate:b.rate_12m, cur:"uah", tax:0.195, risk:"low", gtee:"ФГВФО" }));
  const depoEur = (rates.depozyty?.eur ?? [])
    .filter(b => b.rate_12m !== null)
    .sort((a,b) => b.rate_12m - a.rate_12m)
    .map(b => ({ id:`d_${b.id}_eur`, name:`${b.name} EUR`, sub:`EUR · 12 міс.`, rate:b.rate_12m, cur:"eur", tax:0.195, risk:"low", gtee:"ФГВФО" }));

  // ОВДП — тільки 12 місяців
  const ovdpUah = (rates.ovdp?.uah ?? [])
    .filter(r => r.months === 12)
    .map(r => ({ id:`o_uah_12`, name:"ОВДП UAH", sub:"12 міс. · Держава", rate:r.rate, cur:"uah", tax:rates.ovdp.tax ?? 0.015, risk:"low", gtee:"Держава", star:true }));
  const ovdpEur = (rates.ovdp?.eur ?? [])
    .filter(r => r.months === 12)
    .map(r => ({ id:`o_eur_12`, name:"ОВДП EUR", sub:"12 міс. · Держава", rate:r.rate, cur:"eur", tax:rates.ovdp.tax ?? 0.015, risk:"low", gtee:"Держава", star:true }));

  // НПФ з rates.json
  const npf = (rates.npf?.funds ?? [])
    .map(f => ({ id:`n_${f.id}`, name:f.name, sub:"UAH · пенсійний фонд", rate:f.rate, cur:"uah", tax:0, risk:"mid", gtee:"Немає", bonus:true }));

  // Нерухомість з rates.json
  const realty = (rates.realty_ua ?? [])
    .map(r => ({ id:`r_${r.id}`, name:r.name, sub:"UAH", rate:r.rate, cur:"uah", tax:0.195, risk:"mid", gtee:"Немає" }));

  return [
    { id:"deposit", name:"Депозити",     icon:"🏦", products:[...depoUah, ...depoEur] },
    { id:"ovdp",    name:"ОВДП",         icon:"📜", products:[...ovdpUah, ...ovdpEur] },
    { id:"npf",     name:"НПФ",          icon:"🏛", products:npf },
    { id:"etf",     name:"ETF",          icon:"📈", products:[
      {id:"e2",name:"CSPX",sub:"S&P 500 · EUR",    rate:9.5,cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
      {id:"e1",name:"VWCE",sub:"All World · EUR",   rate:8.5,cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
      {id:"e3",name:"EUNL",sub:"iShares Core · EUR",rate:8,  cur:"eur",tax:0.195,risk:"mid",gtee:"SIPC"},
    ]},
    { id:"crypto",  name:"Блокчейн",     icon:"⛓", products:[
      {id:"c3",name:"Bitcoin",     sub:"BTC · волатильний",rate:15,cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
      {id:"c1",name:"Binance Earn",sub:"USDT stable",      rate:5, cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
      {id:"c2",name:"Aave DeFi",   sub:"USDC stable",      rate:4, cur:"eur",tax:0.195,risk:"high",gtee:"Немає"},
    ]},
    { id:"realty",  name:"Нерухомість",  icon:"🏨", products:realty.length ? realty : CATEGORIES_DEFAULT.find(c=>c.id==="realty").products },
    { id:"gold",    name:"Золото",       icon:"🥇", products:[
      {id:"g1",name:"Gold ETF IGLN",sub:"EUR · LSE",rate:7,cur:"eur",tax:0.195,risk:"low",gtee:"Немає"},
    ]},
  ];
}

const RISK = {
  low:  {label:"Низький",  bg:"#E1F5EE",c:"#0F6E56"},
  mid:  {label:"Середній", bg:"#FFF8EC",c:"#D4891E"},
  high: {label:"Високий",  bg:"#FAECE7",c:"#C0392B"},
};

// ─── Math helpers ─────────────────────────────────────────────────────────────
function calcFV(lump, monthly, rateAnn, years) {
  const r = rateAnn / 100 / 12, n = years * 12;
  if (r === 0) return lump + monthly * n;
  return lump * Math.pow(1+r,n) + monthly*(Math.pow(1+r,n)-1)/r;
}
function itemNetFV(item, years) {
  const gross    = calcFV(item.lump, item.monthly, item.rate, years);
  const contrib  = item.lump + item.monthly*12*years;
  const interest = Math.max(0, gross - contrib);
  return contrib + interest*(1 - item.tax);
}
function fmtFull(n) { return Math.round(n).toLocaleString("uk-UA"); }
function fmtK(n) {
  const a = Math.abs(n);
  if (a >= 1e6) return (n/1e6).toFixed(1)+"M";
  if (a >= 1e3) return (n/1e3).toFixed(0)+"k";
  return Math.round(n);
}
const sym = (cur) => cur === "uah" ? "₴" : "€";

// ─── Main component ───────────────────────────────────────────────────────────
export default function MyCapital() {
  // Name options: "Мій капітал" | "Назапас" | "Для майбутнього" | "На потім" | "Збираю"
  const TITLE = "Мій капітал";

  const [tab,          setTab]          = useState("deposit");
  const [portfolio,    setPortfolio]    = useState([]);
  const [years,        setYears]        = useState(10);
  const [payoutMonths, setPayoutMonths] = useState(60);
  const [eurUah,       setEurUah]       = useState(42);
  const [curFilter,    setCurFilter]    = useState({});
  const [CATEGORIES,   setCategories]   = useState(CATEGORIES_DEFAULT);

  // Завантажуємо свіжі ставки з rates.json
  useEffect(() => {
    fetch("/data/rates.json")
      .then(r => r.json())
      .then(data => setCategories(buildCategories(data)))
      .catch(() => {}); // fallback to CATEGORIES_DEFAULT
  }, []);

  const cat       = CATEGORIES.find(c => c.id === tab);
  const tabFilter = curFilter[tab] || "all";
  const hasUAH    = cat.products.some(p => p.cur === "uah");
  const hasEUR    = cat.products.some(p => p.cur === "eur");

  const filteredProducts = useMemo(() =>
    [...cat.products]
      .filter(p => tabFilter === "all" || p.cur === tabFilter)
      .sort((a,b) => b.rate - a.rate),
  [cat, tabFilter]);

  // Portfolio mutations
  function addProduct(prod) {
    if (portfolio.find(p => p.productId === prod.id)) return;
    const color = PALETTE[portfolio.length % PALETTE.length];
    setPortfolio(prev => [...prev, {
      id:Date.now(), productId:prod.id, name:prod.name, sub:prod.sub,
      rate:prod.rate, cur:prod.cur, tax:prod.tax, risk:prod.risk, gtee:prod.gtee,
      star:!!prod.star, bonus:!!prod.bonus, color,
      lump:0, monthly: prod.cur==="uah" ? 3000 : 100,
    }]);
  }
  function removeItem(id) { setPortfolio(p => p.filter(x => x.id !== id)); }
  function updateItem(id, field, val) {
    setPortfolio(p => p.map(x => x.id===id ? {...x,[field]:Number(val)||0} : x));
  }

  // Totals
  const uahItems = portfolio.filter(p => p.cur==="uah");
  const eurItems = portfolio.filter(p => p.cur==="eur");

  const uahContrib = useMemo(()=>uahItems.reduce((s,p)=>s+p.lump+p.monthly*12*years,0),[uahItems,years]);
  const eurContrib = useMemo(()=>eurItems.reduce((s,p)=>s+p.lump+p.monthly*12*years,0),[eurItems,years]);
  const uahTotal   = useMemo(()=>uahItems.reduce((s,p)=>s+itemNetFV(p,years),0),[uahItems,years]);
  const eurTotal   = useMemo(()=>eurItems.reduce((s,p)=>s+itemNetFV(p,years),0),[eurItems,years]);

  // Combined in UAH (EUR converted at today's rate)
  const totalInUAH   = uahTotal + eurTotal * eurUah;
  const contribInUAH = uahContrib + eurContrib * eurUah;
  const incomeInUAH  = totalInUAH - contribInUAH;
  const totalROI     = contribInUAH>0 ? (incomeInUAH/contribInUAH*100) : 0;
  const annualROI    = contribInUAH>0 ? (Math.pow(totalInUAH/contribInUAH,1/years)-1)*100 : 0;
  const monthlyPay   = payoutMonths>0 ? totalInUAH/payoutMonths : 0;
  const hasPortfolio = portfolio.length > 0;
  const hasEurInPortfolio = eurItems.length > 0;

  // Chart: all values converted to UAH for unified view
  const chartData = useMemo(() => {
    const pts = years<=10
      ? Array.from({length:years+1},(_,i)=>i)
      : [0,5,10,Math.round(years/2),years].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
    return pts.map(y => {
      const row = { label: y===0?"Старт":`Рік ${y}` };
      portfolio.forEach(p => {
        const valInUah = itemNetFV(p,y) * (p.cur==="eur" ? eurUah : 1);
        row[p.name+"_"+p.id] = Math.round(valInUah);
      });
      return row;
    });
  }, [portfolio, years, eurUah]);

  const isAdded = (pid) => !!portfolio.find(p => p.productId===pid);

  // ── UI ────────────────────────────────────────────────────────────────────
  const inputStyle = {
    width:"100%",padding:"5px 4px 5px 16px",borderRadius:6,
    border:"1.5px solid #E0E0E0",fontSize:12,fontWeight:600,
    boxSizing:"border-box",outline:"none",color:D,
  };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",color:D,maxWidth:720,margin:"0 auto",padding:"0 2px"}}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none" stroke={G} strokeWidth="2.5"/>
          <text x="16" y="22" fontFamily="system-ui" fontSize="17" fontWeight="700" fill={G} textAnchor="middle">P</text>
        </svg>
        <div>
          <h1 style={{margin:0,fontSize:18,fontWeight:700,letterSpacing:"-.3px"}}>{TITLE}</h1>
          <p style={{margin:0,fontSize:12,color:"#888"}}>Збирай портфель інструментів — бачи дохід через роки</p>
        </div>
      </div>

      {/* ── Category tabs ───────────────────────────────────────────────── */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",margin:"14px 0 0",borderBottom:`1px solid #E5E5E5`,paddingBottom:10}}>
        {CATEGORIES.map(c => {
          const count = portfolio.filter(p=>c.products.find(pr=>pr.id===p.productId)).length;
          const on    = c.id===tab;
          return (
            <button key={c.id} onClick={()=>setTab(c.id)} style={{
              padding:"5px 12px",borderRadius:20,position:"relative",cursor:"pointer",
              border:on?`2px solid ${G}`:"1.5px solid #E0E0E0",
              background:on?G:"white",color:on?"white":D,
              fontSize:12,fontWeight:on?700:400,
            }}>
              {c.icon} {c.name}
              {count>0&&<span style={{
                position:"absolute",top:-7,right:-7,background:A,color:"white",
                borderRadius:"50%",width:17,height:17,fontSize:10,fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Instrument list ─────────────────────────────────────────────── */}
      <div style={{border:"1.5px solid #E0E0E0",borderRadius:12,marginBottom:14,marginTop:12,overflow:"hidden"}}>

        {/* Filter bar */}
        <div style={{background:SU,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #EEEEEE"}}>
          <span style={{fontSize:11,fontWeight:600,color:"#aaa"}}>
            {filteredProducts.length} інструментів · за дохідністю ↓
          </span>
          <div style={{display:"flex",gap:4}}>
            {(["all","uah","eur"]).map(cv=>{
              if(cv==="uah"&&!hasUAH) return null;
              if(cv==="eur"&&!hasEUR) return null;
              const on=tabFilter===cv;
              return <button key={cv} onClick={()=>setCurFilter(p=>({...p,[tab]:cv}))} style={{
                padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",
                border:on?`1.5px solid ${G}`:"1px solid #E0E0E0",
                background:on?M:"white",color:on?G:"#888",
              }}>{cv==="all"?"Всі":cv==="uah"?"₴ UAH":"€ EUR"}</button>;
            })}
          </div>
        </div>

        {/* Column headers */}
        <div style={{display:"grid",gridTemplateColumns:"56px 1fr 72px 88px 76px 86px",padding:"6px 14px",background:"#FAFAFA",borderBottom:"1px solid #F0F0F0"}}>
          {["Ставка","Назва","Валюта","Ризик","Гарантія",""].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:".04em"}}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filteredProducts.map((prod,i)=>{
          const added=isAdded(prod.id), r=RISK[prod.risk];
          return (
            <div key={prod.id} style={{
              display:"grid",gridTemplateColumns:"56px 1fr 72px 88px 76px 86px",
              padding:"9px 14px",
              background:added?M:"white",
              borderBottom:i<filteredProducts.length-1?"1px solid #F7F7F7":"none",
              transition:"background .12s",
            }}>
              <div style={{fontSize:18,fontWeight:700,color:G,alignSelf:"center"}}>{prod.rate}%</div>
              <div style={{alignSelf:"center"}}>
                <span style={{fontSize:13,fontWeight:600}}>{prod.name}</span>
                {prod.star&&<span style={{fontSize:10,color:A,marginLeft:5,fontWeight:700}}>⚡ пільга</span>}
                {prod.bonus&&<span style={{fontSize:10,color:G,marginLeft:5,fontWeight:700}}>+18%</span>}
                <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{prod.sub}</div>
              </div>
              <div style={{alignSelf:"center"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,
                  background:prod.cur==="uah"?"#EFF6FF":"#F5F3FF",
                  color:prod.cur==="uah"?"#2563EB":"#7C3AED"}}>
                  {prod.cur==="uah"?"₴ UAH":"€ EUR"}
                </span>
              </div>
              <div style={{alignSelf:"center"}}>
                <span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:r.bg,color:r.c,fontWeight:600}}>{r.label}</span>
              </div>
              <div style={{alignSelf:"center",fontSize:11,color:"#888"}}>{prod.gtee}</div>
              <div style={{alignSelf:"center"}}>
                <button onClick={()=>addProduct(prod)} style={{
                  padding:"5px 12px",borderRadius:8,border:"none",
                  background:added?G:"#EBEBEB",color:added?"white":"#666",
                  fontSize:12,fontWeight:700,cursor:added?"default":"pointer",
                  width:"100%",
                }}>{added?"✓ Додано":"+ Додати"}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Portfolio ───────────────────────────────────────────────────── */}
      {hasPortfolio ? (
        <div style={{border:`2px solid ${G}`,borderRadius:12,padding:"14px",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:G,letterSpacing:".07em",marginBottom:10}}>МІЙ ПОРТФЕЛЬ</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 108px 108px 64px 28px",gap:6,marginBottom:6}}>
            {["Інструмент","Одноразово","Щомісяця","Ставка",""].map(h=>(
              <div key={h} style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:".04em"}}>{h}</div>
            ))}
          </div>
          {portfolio.map((item,idx)=>(
            <div key={item.id} style={{
              display:"grid",gridTemplateColumns:"1fr 108px 108px 64px 28px",
              gap:6,alignItems:"center",padding:"7px 0",
              borderTop:idx>0?"1px solid #F2F2F2":"none",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:item.color,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:12,fontWeight:600}}>
                    {item.name}
                    {item.star&&<span style={{fontSize:10,color:A,marginLeft:4}}>⚡</span>}
                    {item.bonus&&<span style={{fontSize:10,color:G,marginLeft:4}}>+18%</span>}
                  </div>
                  <div style={{fontSize:10,color:"#aaa"}}>{item.sub}</div>
                </div>
              </div>
              {["lump","monthly"].map(f=>(
                <div key={f} style={{position:"relative"}}>
                  <span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#bbb"}}>{sym(item.cur)}</span>
                  <input type="number" value={item[f]}
                    onChange={e=>updateItem(item.id,f,e.target.value)}
                    style={inputStyle}/>
                </div>
              ))}
              <div style={{fontSize:15,fontWeight:700,color:G,textAlign:"center"}}>{item.rate}%</div>
              <button onClick={()=>removeItem(item.id)} style={{
                width:26,height:26,borderRadius:6,border:"1.5px solid #E0E0E0",
                background:"white",cursor:"pointer",color:"#ccc",fontSize:16,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{border:"2px dashed #E5E5E5",borderRadius:12,padding:"22px",textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:28,marginBottom:6}}>📋</div>
          <div style={{fontSize:13,fontWeight:600,color:"#ccc",marginBottom:3}}>Портфель порожній</div>
          <div style={{fontSize:12,color:"#bbb"}}>Обери інструменти вище і натисни «+ Додати»</div>
        </div>
      )}

      {/* ── Horizon slider ─────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:".07em"}}>ГОРИЗОНТ НАКОПИЧЕННЯ</span>
          <span style={{fontSize:20,fontWeight:700,color:G}}>
            {years} {years===1?"рік":years<5?"роки":"років"}
          </span>
        </div>
        <input type="range" min={1} max={25} step={1} value={years}
          onChange={e=>setYears(Number(e.target.value))}
          style={{width:"100%",accentColor:G}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#ccc",marginTop:3}}>
          {[1,5,10,15,20,25].map(y=><span key={y}>{y}</span>)}
        </div>
      </div>

      {/* ── Payout slider ──────────────────────────────────────────────── */}
      {hasPortfolio && (
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:".07em"}}>ВИПЛАТИ РОЗТЯГНУТИ НА</span>
            <span style={{fontSize:20,fontWeight:700,color:"#3B82C4"}}>
              {payoutMonths} міс.&nbsp;
              <span style={{fontSize:13,color:"#aaa",fontWeight:500}}>({(payoutMonths/12).toFixed(payoutMonths%12===0?0:1)} р.)</span>
            </span>
          </div>
          <input type="range" min={12} max={240} step={12} value={payoutMonths}
            onChange={e=>setPayoutMonths(Number(e.target.value))}
            style={{width:"100%",accentColor:"#3B82C4"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#ccc",marginTop:3}}>
            {["1р","2","3","5","7","10","15","20р"].map(l=><span key={l}>{l}</span>)}
          </div>
        </div>
      )}

      {/* ── EUR/UAH rate ───────────────────────────────────────────────── */}
      {hasPortfolio && hasEurInPortfolio && (
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
          background:"#EFF6FF",borderRadius:8,border:"1px solid #BFDBFE",marginBottom:14}}>
          <span style={{fontSize:12,color:"#1D4ED8",flexShrink:0}}>Курс EUR/UAH для підсумку:</span>
          <input type="number" value={eurUah}
            onChange={e=>setEurUah(Number(e.target.value)||42)}
            style={{width:68,padding:"4px 8px",borderRadius:6,border:"1.5px solid #93C5FD",
              fontSize:14,fontWeight:700,color:D,outline:"none",textAlign:"center"}}/>
          <span style={{fontSize:12,color:"#1D4ED8"}}>₴/€</span>
          <span style={{fontSize:11,color:"#93C5FD",marginLeft:"auto"}}>Сьогодні ~42 ₴/€</span>
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────── */}
      {hasPortfolio && (
        <>
          {/* Main dark result card */}
          <div style={{
            background:`linear-gradient(135deg,${D} 0%,#2A4A44 100%)`,
            borderRadius:14,padding:"16px 18px",marginBottom:12,color:"white",
          }}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#9FE1CB",letterSpacing:".06em",marginBottom:4}}>ВНЕСЕНО (₴)</div>
                <div style={{fontSize:16,fontWeight:700}}>₴{fmtFull(contribInUAH)}</div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#FCD34D",letterSpacing:".06em",marginBottom:4}}>ДОХІД ЧИСТИЙ (₴)</div>
                <div style={{fontSize:16,fontWeight:700,color:"#FCD34D"}}>+₴{fmtFull(incomeInUAH)}</div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#9FE1CB",letterSpacing:".06em",marginBottom:4}}>РАЗОМ (₴)</div>
                <div style={{fontSize:16,fontWeight:700}}>₴{fmtFull(totalInUAH)}</div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,
              paddingTop:12,borderTop:"1px solid rgba(255,255,255,.1)"}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#9FE1CB",letterSpacing:".06em",marginBottom:4}}>ДОХІД ВІД ВКЛАДЕНЬ</div>
                <div style={{fontSize:26,fontWeight:700,color:A}}>+{totalROI.toFixed(1)}%</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>за {years} р.</div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#9FE1CB",letterSpacing:".06em",marginBottom:4}}>СЕРЕДНЄ/РІК</div>
                <div style={{fontSize:26,fontWeight:700,color:"white"}}>{annualROI.toFixed(1)}%</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>ефективна ставка</div>
              </div>
              <div style={{background:"rgba(255,255,255,.07)",borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#9FE1CB",letterSpacing:".06em",marginBottom:4}}>ВИПЛАТА / МІСЯЦЬ</div>
                <div style={{fontSize:22,fontWeight:700,color:"white"}}>₴{fmtFull(monthlyPay)}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>
                  {payoutMonths} міс. ({(payoutMonths/12).toFixed(0)} р.)
                  {hasEurInPortfolio && ` · EUR конвертовано ×${eurUah}`}
                </div>
              </div>
            </div>
          </div>

          {/* Per-item breakdown */}
          {portfolio.length>1 && (
            <div style={{background:"white",borderRadius:12,border:"0.5px solid #E8E8E8",padding:"12px 14px",marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:".06em",marginBottom:10}}>
                РОЗБИВКА ПО ІНСТРУМЕНТАХ · у ₴ через {years} р.
              </div>
              {portfolio.map(item=>{
                const nfv   = itemNetFV(item, years);
                const nfvUA = nfv * (item.cur==="eur" ? eurUah : 1);
                const cont  = (item.lump + item.monthly*12*years) * (item.cur==="eur" ? eurUah : 1);
                const inc   = nfvUA - cont;
                const pct   = totalInUAH>0 ? (nfvUA/totalInUAH)*100 : 0;
                return (
                  <div key={item.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,alignItems:"center"}}>
                      <div style={{display:"flex",gap:7,alignItems:"center"}}>
                        <div style={{width:9,height:9,borderRadius:"50%",background:item.color}}/>
                        <span style={{fontSize:12,fontWeight:600}}>{item.name}</span>
                        <span style={{fontSize:11,color:"#aaa"}}>{item.rate}% {item.cur==="eur"&&<span style={{color:"#7C3AED"}}>€→₴</span>}</span>
                      </div>
                      <div>
                        <span style={{fontSize:13,fontWeight:700}}>₴{fmtFull(nfvUA)}</span>
                        <span style={{fontSize:11,color:A,marginLeft:6}}>+₴{fmtK(inc)}</span>
                        <span style={{fontSize:11,color:"#ccc",marginLeft:6}}>{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div style={{height:5,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${Math.min(100,pct)}%`,height:"100%",background:item.color,borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Chart */}
          {chartData.length>1 && (
            <div style={{background:"white",borderRadius:12,border:"0.5px solid #E8E8E8",padding:"14px 8px 6px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginLeft:8,marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:"#bbb",letterSpacing:".06em"}}>ЗРОСТАННЯ ПОРТФЕЛЯ (₴)</div>
                {hasEurInPortfolio&&<div style={{fontSize:10,color:"#bbb"}}>EUR × {eurUah} ₴</div>}
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginLeft:8,marginBottom:8}}>
                {portfolio.map(p=>(
                  <span key={p.id} style={{fontSize:11,color:"#888",display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
                    {p.name}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{top:4,right:12,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false}/>
                  <XAxis dataKey="label" tick={{fontSize:11,fill:"#bbb"}} tickLine={false} axisLine={false}/>
                  <YAxis tick={{fontSize:10,fill:"#bbb"}} tickLine={false} axisLine={false} width={46}
                    tickFormatter={v=>`₴${fmtK(v)}`}/>
                  <Tooltip
                    formatter={(v,n)=>[`₴${fmtFull(v)}`, n.split("_")[0]]}
                    labelStyle={{fontWeight:600,color:D}}
                    contentStyle={{border:`1px solid ${G}`,borderRadius:8,fontSize:12}}/>
                  {portfolio.map((p,i)=>(
                    <Bar key={p.id} dataKey={p.name+"_"+p.id} stackId="a" fill={p.color}
                      radius={i===portfolio.length-1?[4,4,0,0]:[0,0,0,0]}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Smart insights */}
          {portfolio.some(p=>p.star) && (
            <div style={{background:"#FFFBE6",border:`1.5px solid ${A}`,borderRadius:10,
              padding:"10px 14px",fontSize:12,lineHeight:1.6,marginBottom:8}}>
              <strong style={{color:A}}>⚡ ОВДП у портфелі:</strong> Лише 1.5% замість 19.5% податку. ОВДП за 16% вигідніші за депозит за 17% — після оподаткування дають більше.
            </div>
          )}
          {portfolio.some(p=>p.bonus) && (
            <div style={{background:M,border:`1.5px solid ${G}`,borderRadius:10,
              padding:"10px 14px",fontSize:12,lineHeight:1.6,marginBottom:8}}>
              <strong style={{color:G}}>🏛 НПФ у портфелі:</strong> Повернення 18% ПДФО з кожного внеску — це реальний додатковий дохід зверху.
            </div>
          )}
        </>
      )}

      <div style={{fontSize:11,color:"#ccc",textAlign:"center",marginTop:8,paddingBottom:4}}>
        Porahovano · porahovano.com.ua · Ставки орієнтовні · Оновлення щомісяця
      </div>
    </div>
  );
}
