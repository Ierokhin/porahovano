"use client";
// porahovano.in.ua/ovdp — /app/ovdp/page.jsx
// Дані з /public/data/rates.json

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const BROKERS = [
  { name:"Дія",            link:"https://diia.gov.ua",            desc:"Мобільний застосунок, найпростіший спосіб. Без брокерського рахунку." },
  { name:"Monobank",       link:"https://www.monobank.ua",         desc:"Вкладка «Інвестиції» → ОВДП. Для клієнтів банку." },
  { name:"Dragon Capital", link:"https://www.dragon-capital.com",  desc:"Повноцінний брокер. Широкий вибір строків і валют." },
  { name:"Універ Капітал", link:"https://univer.ua",               desc:"Брокер з низькими комісіями для фізосіб." },
  { name:"Freedom24",      link:"https://freedom24.com",           desc:"Онлайн-брокер, доступний з України. EUR ОВДП." },
];

const FAQ = [
  { q:"Що таке ОВДП і чим відрізняються від депозиту?", a:"ОВДП — облігації внутрішньої державної позики. Лише 1.5% податку (військовий збір) замість 19.5%, тому реальна дохідність вища. Гарантія — держава, а не ФГВФО." },
  { q:"Чому ОВДП вигідніші за депозити при однаковій ставці?", a:"ОВДП звільнені від 18% ПДФО — стягується лише 1.5% військового збору. Різниця у 2.86 п.п. щороку — суттєво на горизонті 3–5 років." },
  { q:"Як купити ОВДП фізичній особі в Україні?", a:"Через застосунок Дія (найпростіше), Monobank, або брокера — Dragon Capital, Універ чи Freedom24. Рахунок відкривається онлайн за 15–30 хвилин." },
  { q:"Чи можна продати ОВДП раніше строку?", a:"Так, через вторинний ринок у брокера. Ціна визначається ринком, а не банком." },
  { q:"Що буде з ОВДП якщо Україна не зможе виплатити?", a:"Суверенний ризик. UAH ОВДП — технічний дефолт малоймовірний. EUR ОВДП мають валютний ризик." },
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
function Label({ children }) { return <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:10}}>{children}</div>; }
function Divider() { return <div style={{height:1,background:T.border,margin:"40px 0"}}/>; }

export default function OvdpPage() {
  const [cur,     setCur]     = useState("uah");
  const [openFaq, setOpenFaq] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [added,   setAdded]   = useState({});
  const [rates,   setRates]   = useState(null);

  useEffect(() => { fetch("/data/rates.json").then(r=>r.json()).then(setRates).catch(()=>setRates(null)); }, []);

  const tax  = rates?.ovdp?.tax ?? 0.015;
  const rows = rates?.ovdp?.[cur] ?? [];
  const topRate = rows[0]?.rate ?? null;
  const S = cur === "uah" ? "₴" : "€";
  const net = (r) => +(r * (1 - tax)).toFixed(2);

  // Динамічне порівняння з депозитом — топ ставка з rates.json
  const topDepoUah = rates?.depozyty?.uah
    ? [...rates.depozyty.uah].filter(b=>b.rate_12m!==null).sort((a,b)=>b.rate_12m-a.rate_12m)[0]
    : null;
  const depoRate = topDepoUah?.rate_12m ?? null;
  const depoTax  = 0.195;

  const EX_SUM   = cur === "uah" ? 100000 : 5000;
  const EX_RATE  = topRate ?? (cur === "uah" ? 16 : 5);
  const EX_GROSS = EX_SUM * EX_RATE / 100;
  const EX_TAX   = EX_GROSS * tax;
  const EX_NET   = EX_GROSS - EX_TAX;

  function handleAdd(item) {
    const id = `ovdp_${cur}_${item.months}`;
    if (added[id]) return;
    try {
      const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
      if (!prev.find(e => e.productId === id)) {
        localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
          id: Date.now(), productId: id, name:`ОВДП ${cur.toUpperCase()}`, sub:`${cur.toUpperCase()} · ${item.term}`,
          rate: item.rate, cur, tax, risk:"low", gtee:"Держава", color:T.green, lump:0, monthly: cur==="uah"?3000:100,
        }]));
      }
    } catch {}
    setAdded(p => ({ ...p, [id]: true }));
    setToast(`ОВДП ${cur.toUpperCase()} · ${item.term}`);
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <main style={{fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif",color:T.dark,maxWidth:920,margin:"0 auto",padding:"0 20px 60px"}}>
      <nav style={{fontSize:12,color:T.gray,padding:"16px 0 24px",display:"flex",gap:6}}>
        <a href="/" style={{color:T.gray,textDecoration:"none"}}>Porahovano</a><span>›</span><span style={{color:T.dark,fontWeight:600}}>ОВДП</span>
      </nav>

      <section style={{marginBottom:40}}>
        <div style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:T.greenLt,color:T.green,fontSize:11,fontWeight:700,marginBottom:12}}>ОНОВЛЕНО {rates?.updated || "ЧЕРВЕНЬ 2026"}</div>
        <h1 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",margin:"0 0 14px"}}>
          ОВДП в Україні:<br/><span style={{color:T.green}}>{topRate ? `до ${topRate}% річних · лише 1.5% податку` : "лише 1.5% податку"}</span>
        </h1>
        <p style={{fontSize:15,color:T.gray,maxWidth:580,lineHeight:1.75,margin:"0 0 24px"}}>
          Облігації державної позики — єдиний інструмент в Україні з пільговим оподаткуванням. Замість 19.5% стягується лише <strong>1.5% військового збору</strong>.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{val:topRate?`до ${topRate}%`:"—",lbl:"річних у гривні"},{val:`${tax*100}%`,lbl:"єдиний податок (vs 19.5%)"},{val:"Держава",lbl:"гарантія погашення"}].map(({val,lbl}) => (
            <div key={lbl} style={{background:T.greenLt,borderRadius:12,padding:"12px 18px",minWidth:130}}>
              <div style={{fontSize:22,fontWeight:700,color:T.green}}>{val}</div>
              <div style={{fontSize:12,color:T.gray,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Динамічне порівняння з топ депозитом */}
      {topRate && depoRate && (
        <section style={{marginBottom:40}}>
          <div style={{background:T.amberLt,border:`2px solid ${T.amber}`,borderRadius:14,padding:"20px 24px"}}>
            <div style={{fontSize:13,fontWeight:700,color:T.amber,letterSpacing:".06em",marginBottom:12}}>⚡ ЧОМУ ОВДП ВИГІДНІШІ ЗА ДЕПОЗИТИ — АКТУАЛЬНЕ ПОРІВНЯННЯ</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:"white",borderRadius:10,padding:"14px 18px"}}>
                <div style={{fontSize:12,color:T.gray,marginBottom:6}}>{topDepoUah.name} · депозит {depoRate}%</div>
                <div style={{fontSize:13,lineHeight:1.8}}>
                  Нараховано: <strong>{depoRate}%</strong><br/>
                  <span style={{color:"#C0392B"}}>Податок {depoTax*100}%: −{(depoRate*depoTax).toFixed(1)}%</span>
                </div>
                <div style={{fontWeight:700,fontSize:16,marginTop:4}}>На руки: <span style={{color:"#C0392B"}}>{net(depoRate*(1-depoTax)/(1-depoTax)).toFixed(0)}%</span></div>
              </div>
              <div style={{background:T.greenLt,borderRadius:10,padding:"14px 18px",border:`1.5px solid ${T.green}`}}>
                <div style={{fontSize:12,color:T.gray,marginBottom:6}}>ОВДП UAH · {topRate}%</div>
                <div style={{fontSize:13,lineHeight:1.8}}>
                  Нараховано: <strong>{topRate}%</strong><br/>
                  <span style={{color:T.green}}>Податок {tax*100}%: −{(topRate*tax).toFixed(2)}%</span>
                </div>
                <div style={{fontWeight:700,fontSize:16,marginTop:4}}>На руки: <span style={{color:T.green}}>{net(topRate)}%</span></div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div><Label>ПОТОЧНІ СТАВКИ</Label><h2 style={{fontSize:20,fontWeight:700,margin:0}}>Сортування за дохідністю ↓</h2></div>
          <div style={{display:"flex",border:`1.5px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            {["uah","eur"].map(c => (
              <button key={c} onClick={() => setCur(c)} style={{padding:"8px 20px",border:"none",cursor:"pointer",background:cur===c?T.green:T.white,color:cur===c?T.white:T.gray,fontSize:13,fontWeight:700}}>{c==="uah"?"₴ UAH":"€ EUR"}</button>
            ))}
          </div>
        </div>

        {!rates && <div style={{padding:24,textAlign:"center",color:T.gray}}>⏳ Завантажуємо дані...</div>}

        {rates && (
          <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 120px 1fr 128px",padding:"9px 18px",background:T.grayLt,fontSize:10,fontWeight:700,color:T.gray,letterSpacing:".05em"}}>
              <div>СТРОК</div><div>СТАВКА</div><div>ПІСЛЯ ПОДАТКУ</div><div>ДЕ КУПИТИ</div><div>МІЙ КАПІТАЛ</div>
            </div>
            {rows.map((item, i) => {
              const id = `ovdp_${cur}_${item.months}`;
              const isDone = !!added[id];
              return (
                <div key={item.term} style={{display:"grid",gridTemplateColumns:"1fr 80px 120px 1fr 128px",padding:"13px 18px",alignItems:"center",borderTop:`1px solid ${T.border}`,background:i===0?T.greenLt:T.white}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                      {item.term}{i===0 && <span style={{fontSize:10,background:T.green,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700}}>Найвигідніше</span>}
                    </div>
                  </div>
                  <div style={{fontSize:19,fontWeight:700,color:T.green}}>{item.rate}%</div>
                  <div><div style={{fontSize:15,fontWeight:700,color:T.amber}}>{net(item.rate)}%</div><div style={{fontSize:10,color:T.gray}}>−{tax*100}%</div></div>
                  <div style={{fontSize:12,color:T.gray}}>Дія / Monobank / брокер</div>
                  <div>
                    <button onClick={() => handleAdd(item)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:`1.5px solid ${isDone?T.green:T.border}`,background:isDone?T.greenLt:T.white,color:isDone?T.green:T.gray,fontSize:12,fontWeight:700,cursor:isDone?"default":"pointer"}}>{isDone?"✓ Додано":"+ Мій капітал"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Divider/>

      <section style={{marginBottom:40}}>
        <Label>ГАРАНТІЇ</Label>
        <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:14,padding:"20px 24px"}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px",color:T.green}}>🏛 Гарантія держави — без ліміту суми</h2>
          <p style={{margin:"0 0 14px",lineHeight:1.7}}>ОВДП гарантовані <strong>Міністерством фінансів України</strong>. На відміну від ФГВФО (ліміт 600 000 ₴), ліміту на суму немає.</p>
        </div>
      </section>

      <section style={{marginBottom:40}}>
        <Label>РЕАЛЬНА ДОХІДНІСТЬ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px"}}>Скільки залишається після {tax*100}% збору</h2>
        <div style={{background:T.grayLt,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.gray,marginBottom:14}}>ПРИКЛАД — {S}{EX_SUM.toLocaleString("uk-UA")} під {EX_RATE}% на 12 місяців</div>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:4}}>
            {[{lbl:"Вкладаєте",val:`${S}${EX_SUM.toLocaleString("uk-UA")}`,sub:`під ${EX_RATE}%`,c:T.dark},null,
              {lbl:"Нараховано",val:`+${S}${Math.round(EX_GROSS).toLocaleString("uk-UA")}`,sub:"за 12 місяців",c:T.green},null,
              {lbl:`Збір ${tax*100}%`,val:`−${S}${Math.round(EX_TAX).toLocaleString("uk-UA")}`,sub:"vs 19.5% у депозиті",c:T.amber},null,
              {lbl:"На руки",val:`${S}${Math.round(EX_NET).toLocaleString("uk-UA")}`,sub:`реально ${net(EX_RATE)}%`,c:T.green}]
              .map((item,i) => item===null
                ? <div key={i} style={{fontSize:20,color:T.gray,padding:"0 2px"}}>→</div>
                : <div key={i} style={{padding:"10px 14px",textAlign:"center",flex:1,minWidth:100}}>
                    <div style={{fontSize:11,color:T.gray,fontWeight:600,marginBottom:4}}>{item.lbl}</div>
                    <div style={{fontSize:18,fontWeight:700,color:item.c}}>{item.val}</div>
                    <div style={{fontSize:11,color:T.gray}}>{item.sub}</div>
                  </div>)}
          </div>
        </div>
      </section>

      <Divider/>

      <section style={{marginBottom:40}}>
        <Label>ДЕ КУПИТИ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>5 способів придбати ОВДП</h2>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {BROKERS.map((b, i) => (
            <div key={b.name} style={{display:"flex",alignItems:"center",gap:16,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"14px 18px",background:i===0?T.greenLt:T.white}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.green,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{String(i+1).padStart(2,"0")}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{b.name}{i===0&&<span style={{fontSize:10,background:T.green,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700,marginLeft:8}}>Найпростіше</span>}</div>
                <div style={{fontSize:13,color:T.gray}}>{b.desc}</div>
              </div>
              <a href={b.link} target="_blank" rel="nofollow noopener" style={{padding:"7px 14px",borderRadius:8,textDecoration:"none",border:`1.5px solid ${i===0?T.green:T.border}`,background:i===0?T.green:"transparent",color:i===0?T.white:T.dark,fontSize:12,fontWeight:600,flexShrink:0}}>Відкрити →</a>
            </div>
          ))}
        </div>
      </section>

      <Divider/>

      <section style={{marginBottom:40}}>
        <Label>ЧАСТІ ЗАПИТАННЯ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>ОВДП — що потрібно знати</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FAQ.map((item,i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{border:`1.5px solid ${open?T.green:T.border}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={() => setOpenFaq(open?null:i)} style={{width:"100%",textAlign:"left",padding:"14px 18px",background:open?T.greenLt:T.white,border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:14,fontWeight:600,color:T.dark}}>
                  {item.q}<span style={{fontSize:20,color:T.green,flexShrink:0,transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
                </button>
                {open && <div style={{padding:"0 18px 14px",fontSize:14,color:T.gray,lineHeight:1.75,background:T.greenLt}}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{background:T.dark,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Скільки дадуть ОВДП через 5 або 10 років?</div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>Додай ОВДП до портфеля у «Мій капітал».</p>
        <a href="/kalkulator" style={{display:"inline-block",padding:"11px 26px",background:T.green,color:"white",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none"}}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
