"use client";
// porahovano.in.ua/npf — /app/npf/page.jsx
// Дані з /public/data/rates.json. Порівняння НПФ vs ОВДП (актуальні ставки).

import { useState, useEffect } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const FAQ = [
  { q:"Що таке НПФ і як він відрізняється від ОВДП?", a:"НПФ — недержавний пенсійний фонд. 0% податку на дохід + можливе повернення 18% ПДФО з внесків (якщо ви офіційно сплачуєте ПДФО). ОВДП — державні облігації з 1.5% податком. НПФ виграє на горизонті 10+ років завдяки складному відсотку без оподаткування, але кошти заблоковані до пенсії." },
  { q:"Як отримати повернення 18% ПДФО?", a:"Через роботодавця (не утримує ПДФО з суми внеску) або самостійно через декларацію до 1 травня. Максимум: 18% від суми, що не перевищує 3 мінімальні зарплати на місяць. Доступно лише тим, хто офіційно сплачує ПДФО." },
  { q:"Чи можна забрати гроші з НПФ достроково?", a:"Лише у виняткових випадках: критична хвороба, інвалідність, виїзд за кордон на ПМП, смерть учасника. В інших випадках — лише з виходом на пенсію." },
  { q:"Що буде з НПФ якщо фонд збанкрутує?", a:"Активи зберігаються окремо від адміністратора у банку-кастодіані. При банкрутстві адміністратора кошти переходять до іншого фонду. Перевірити ліцензію фонду: nssmc.gov.ua." },
  { q:"НПФ чи ОВДП — що вибрати?", a:"ОВДП — для коштів на 1-5 років з гарантованою державою дохідністю. НПФ — для довгострокового накопичення (10+ років) з податковою пільгою, особливо вигідно якщо маєш право на повернення ПДФО." },
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
function Label({ children }) { return <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:8}}>{children}</div>; }
function Divider() { return <div style={{height:1,background:T.border,margin:"40px 0"}}/>; }

export default function NpfPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [added,   setAdded]   = useState({});
  const [rates,   setRates]   = useState(null);

  useEffect(() => { fetch("/data/rates.json").then(r=>r.json()).then(setRates).catch(()=>setRates(null)); }, []);

  const funds      = rates?.npf?.funds ?? [];
  const pdfoRefund = rates?.npf?.pdfo_refund ?? 0.18;
  const topFund    = funds[0] ?? null;
  const topOvdp    = rates?.ovdp?.uah?.[0] ?? null;
  const ovdpTax    = rates?.ovdp?.tax ?? 0.015;

  function handleAdd(fund) {
    if (added[fund.id]) return;
    try {
      const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
      if (!prev.find(e => e.productId === fund.id)) {
        localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
          id: Date.now(), productId: fund.id, name: fund.name, sub:"UAH · пенсійний фонд",
          rate: fund.rate, cur:"uah", tax:0, risk:"mid", gtee:"Немає", bonus:true, color:T.green, lump:0, monthly:3000,
        }]));
      }
    } catch {}
    setAdded(p => ({ ...p, [fund.id]: true }));
    setToast(fund.name);
    setTimeout(() => setToast(null), 4000);
  }

  // Розрахунок порівняння НПФ vs ОВДП на однаковий внесок 10 000 ₴/міс × 12
  const MONTHLY = 10000;
  const YEARLY  = MONTHLY * 12;
  const ovdpGross = topOvdp ? YEARLY * topOvdp.rate / 100 : 0;
  const ovdpNet   = ovdpGross * (1 - ovdpTax);
  const npfGross  = topFund ? YEARLY * topFund.rate / 100 : 0;
  const npfNet    = npfGross; // 0% податку
  const pdfoBonus = YEARLY * pdfoRefund;

  return (
    <main style={{fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif",color:T.dark,maxWidth:920,margin:"0 auto",padding:"0 20px 60px"}}>
      <nav style={{fontSize:12,color:T.gray,padding:"16px 0 24px",display:"flex",gap:6}}>
        <a href="/" style={{color:T.gray,textDecoration:"none"}}>Porahovano</a><span>›</span><span style={{color:T.dark,fontWeight:600}}>НПФ</span>
      </nav>

      <section style={{marginBottom:40}}>
        <div style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:T.greenLt,color:T.green,fontSize:11,fontWeight:700,marginBottom:12}}>ОНОВЛЕНО {rates?.updated || "ЧЕРВЕНЬ 2026"}</div>
        <h1 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",margin:"0 0 14px"}}>
          НПФ в Україні:<br/><span style={{color:T.green}}>{topFund ? `до ${topFund.rate}% + повернення ${pdfoRefund*100}% ПДФО` : "0% податку на дохід"}</span>
        </h1>
        <p style={{fontSize:15,color:T.gray,maxWidth:580,lineHeight:1.75,margin:"0 0 24px"}}>
          Недержавні пенсійні фонди — інструмент з 0% податку на інвестиційний дохід. Повернення 18% ПДФО з внесків — бонус поверх відсотків, лише для тих хто офіційно сплачує ПДФО.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{val:topFund?`до ${topFund.rate}%`:"—",lbl:"річних · UAH"},{val:"0%",lbl:"податку на дохід НПФ"},{val:`+${pdfoRefund*100}%`,lbl:"ПДФО повертається з внесків"}].map(({val,lbl}) => (
            <div key={lbl} style={{background:T.greenLt,borderRadius:12,padding:"12px 18px",minWidth:130}}>
              <div style={{fontSize:22,fontWeight:700,color:T.green}}>{val}</div>
              <div style={{fontSize:12,color:T.gray,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* НПФ vs ОВДП — порівняння на актуальних ставках */}
      {topFund && topOvdp && (
        <section style={{marginBottom:40}}>
          <div style={{background:T.amberLt,border:`2px solid ${T.amber}`,borderRadius:14,padding:"20px 24px"}}>
            <div style={{fontSize:12,fontWeight:700,color:T.amber,letterSpacing:".06em",marginBottom:16}}>
              🏛 ПОРІВНЯННЯ: ОВДП vs НПФ — однаковий внесок {MONTHLY.toLocaleString("uk-UA")} ₴/міс
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 40px 1fr",gap:0,alignItems:"stretch",marginBottom:14}}>
              {/* ОВДП card — neutral, no judgmental color */}
              <div style={{background:"white",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                  <span style={{fontSize:18}}>📜</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:T.gray,letterSpacing:".04em"}}>ОВДП</div>
                    <div style={{fontSize:13,fontWeight:700,marginTop:1}}>UAH · {topOvdp.term} · {topOvdp.rate}%</div>
                  </div>
                </div>
                <div style={{fontSize:13,lineHeight:2}}>
                  Внесено за рік: <strong>{YEARLY.toLocaleString("uk-UA")} ₴</strong><br/>
                  Дохід {topOvdp.rate}%: +{ovdpGross.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴<br/>
                  Податок {(ovdpTax*100).toFixed(1)}%: −{(ovdpGross*ovdpTax).toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴
                </div>
                <div style={{fontSize:16,fontWeight:700,color:T.dark,marginTop:8,paddingTop:8,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                  Чистий дохід: {ovdpNet.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴
                </div>
              </div>

              <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:T.amber,color:"white",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>VS</div>
              </div>

              {/* NPF card — highlighted as featured option, neutral color for number */}
              <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:10,padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                  <span style={{fontSize:18}}>🏛</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".04em"}}>НПФ</div>
                    <div style={{fontSize:13,fontWeight:700,marginTop:1}}>{topFund.name} · {topFund.rate}% · UAH</div>
                  </div>
                </div>
                <div style={{fontSize:13,lineHeight:2}}>
                  Внесено за рік: <strong>{YEARLY.toLocaleString("uk-UA")} ₴</strong><br/>
                  Дохід {topFund.rate}%: +{npfGross.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴<br/>
                  Податок на дохід: 0% ✓
                </div>
                <div style={{fontSize:16,fontWeight:700,color:T.dark,marginTop:8,paddingTop:8,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                  Чистий дохід: {npfNet.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴
                </div>
                <div style={{marginTop:10,padding:"8px 10px",background:"rgba(239,159,39,.12)",border:`1px dashed ${T.amber}`,borderRadius:7,fontSize:12,lineHeight:1.5}}>
                  ⚡ <strong style={{color:T.amber}}>Бонус: +{pdfoBonus.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴/рік</strong> — повернення ПДФО з внеску
                  <span style={{display:"block",fontSize:11,color:T.gray,marginTop:3}}>Лише якщо офіційно працевлаштований або ФОП і сплачуєш ПДФО</span>
                </div>
              </div>
            </div>

            <div style={{background:T.dark,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>НПФ без бонусу:</span>
              <strong style={{fontSize:15,color:"white"}}>{npfNet.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴/рік</strong>
              <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>З бонусом ПДФО:</span>
              <strong style={{fontSize:15,color:T.amber}}>{(npfNet+pdfoBonus).toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴/рік</strong>
              <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>ОВДП:</span>
              <strong style={{fontSize:15,color:"white"}}>{ovdpNet.toLocaleString("uk-UA",{maximumFractionDigits:0})} ₴/рік</strong>
            </div>
          </div>
        </section>
      )}

      <section style={{marginBottom:40}}>
        <Label>ПЕНСІЙНІ ФОНДИ</Label>
        <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 14px"}}>Натисни на фонд — перейдеш на офіційний сайт</h2>

        {!rates && <div style={{padding:24,textAlign:"center",color:T.gray}}>⏳ Завантажуємо дані...</div>}

        {rates && (
          <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 90px 110px 90px 100px 128px",padding:"9px 18px",background:T.grayLt,fontSize:10,fontWeight:700,color:T.gray,letterSpacing:".05em"}}>
              <div>ФОНД</div><div>ДОХІДНІСТЬ</div><div>ПІСЛЯ ПОДАТКУ</div><div>РИЗИК</div><div>ЛІЦЕНЗІЯ</div><div>МІЙ КАПІТАЛ</div>
            </div>
            {funds.map((f, i) => (
              <a key={f.id} href={f.url} target="_blank" rel="nofollow noopener" style={{textDecoration:"none",color:"inherit",display:"grid",gridTemplateColumns:"1fr 90px 110px 90px 100px 128px",padding:"13px 18px",alignItems:"center",borderTop:`1px solid ${T.border}`,background:i===0?T.greenLt:T.white,cursor:"pointer"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                    {f.name}{i===0&&<span style={{fontSize:10,background:T.green,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700}}>Топ</span>}
                    <span style={{fontSize:11,color:T.gray}}>↗</span>
                  </div>
                  <div style={{fontSize:11,color:T.gray,marginTop:2}}>UAH · пенсійний фонд</div>
                </div>
                <div style={{fontSize:19,fontWeight:700,color:T.green}}>{f.rate}%</div>
                <div><div style={{fontSize:15,fontWeight:700,color:T.green}}>{f.rate}%</div><div style={{fontSize:10,color:T.gray}}>0% податку</div></div>
                <div><span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:"#FFF8EC",color:"#D4891E",fontWeight:600}}>Середній</span></div>
                <div style={{fontSize:12,color:T.gray}}>{f.license}</div>
                <div>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(f); }} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:`1.5px solid ${added[f.id]?T.green:T.border}`,background:added[f.id]?T.greenLt:T.white,color:added[f.id]?T.green:T.gray,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {added[f.id]?"✓ Додано":"+ Мій капітал"}
                  </button>
                </div>
              </a>
            ))}
          </div>
        )}
        <p style={{fontSize:12,color:T.gray,marginTop:10}}>
          Дохідність орієнтовна. Реєстр та ліцензії фондів: <a href="https://www.nssmc.gov.ua" target="_blank" rel="nofollow" style={{color:T.green}}>nssmc.gov.ua</a>
        </p>
      </section>

      <Divider/>

      <section style={{marginBottom:40}}>
        <Label>ГАРАНТІЇ ТА РИЗИКИ</Label>
        <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:14,padding:"20px 24px"}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px",color:T.green}}>🏛 Нагляд НКЦПФР — держрегулятор</h2>
          <p style={{margin:"0 0 14px",lineHeight:1.7,fontSize:13}}>
            Усі НПФ ліцензовані Національною комісією з цінних паперів та фондового ринку. Активи фонду зберігаються окремо від адміністратора. Перевірити реєстрацію фонду: <a href="https://www.nssmc.gov.ua" target="_blank" rel="nofollow" style={{color:T.green,fontWeight:700}}>nssmc.gov.ua</a>
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:T.white,borderRadius:10,padding:"13px 16px",fontSize:13,color:T.gray}}>
              <strong style={{color:T.dark,display:"block",marginBottom:4}}>✓ Переваги:</strong>
              <ul style={{paddingLeft:16,lineHeight:1.9}}><li>0% податку на дохід</li><li>+{pdfoRefund*100}% ПДФО з внесків (якщо маєш право)</li><li>Активи відокремлені від адміністратора</li></ul>
            </div>
            <div style={{background:T.white,borderRadius:10,padding:"13px 16px",fontSize:13,color:T.gray}}>
              <strong style={{color:T.dark,display:"block",marginBottom:4}}>⚠ Ризики:</strong>
              <ul style={{paddingLeft:16,lineHeight:1.9}}><li>Немає гарантії ФГВФО</li><li>Дохідність не гарантована</li><li>Обмежений доступ до коштів до пенсії</li></ul>
            </div>
          </div>
        </div>
      </section>

      <Divider/>

      <section style={{marginBottom:40}}>
        <Label>ЧАСТІ ЗАПИТАННЯ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>НПФ — що потрібно знати</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FAQ.map((item,i) => {
            const open = openFaq===i;
            return (
              <div key={i} style={{border:`1.5px solid ${open?T.green:T.border}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={() => setOpenFaq(open?null:i)} style={{width:"100%",textAlign:"left",padding:"14px 18px",background:open?T.greenLt:T.white,border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:14,fontWeight:600,color:T.dark,gap:10}}>
                  {item.q}<span style={{fontSize:20,color:T.green,flexShrink:0,transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
                </button>
                {open && <div style={{padding:"0 18px 14px",fontSize:14,color:T.gray,lineHeight:1.75,background:T.greenLt}}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{background:T.dark,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Порахуй скільки накопичиш з НПФ за 20 років</div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>Додай НПФ до портфеля у «Мій капітал».</p>
        <a href="/kalkulator" style={{display:"inline-block",padding:"11px 26px",background:T.green,color:"white",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none"}}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
