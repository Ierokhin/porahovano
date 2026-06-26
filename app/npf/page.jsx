"use client";
// porahovano.in.ua/npf — /app/npf/page.jsx

import { useState } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const FUNDS = [
  { id:"n1", name:"OTP Pension", rate:11, risk:"mid", license:"НКЦПФР" },
  { id:"n2", name:"ННПФ",        rate:10, risk:"mid", license:"НКЦПФР" },
  { id:"n3", name:"Династія",    rate:9,  risk:"mid", license:"НКЦПФР" },
];

const FAQ = [
  { q:"Що таке НПФ і як він відрізняється від депозиту?",
    a:"НПФ — недержавний пенсійний фонд. Ви робите внески, фонд інвестує їх і нараховує дохід. Головна відмінність: 0% податку на дохід фонду + держава повертає 18% ПДФО з ваших внесків якщо ви їх сплачуєте. Мінус — кошти заблоковані до досягнення пенсійного віку або особливих обставин." },
  { q:"Як отримати повернення 18% ПДФО?",
    a:"Два способи: (1) Через роботодавця — якщо він сплачує внески за вас, він просто не утримує ПДФО з цієї суми; (2) Самостійно — подаєш декларацію до 1 травня наступного року і отримуєш повернення на картку. Максимум: 18% від суми, що не перевищує 3 мінімальні зарплати на місяць (~21 600 ₴/міс у 2026). Доступно лише тим, хто офіційно сплачує ПДФО." },
  { q:"Чи можна забрати гроші з НПФ достроково?",
    a:"Так, але лише у виняткових випадках: критична хвороба, інвалідність, виїзд за кордон на постійне місце проживання або смерть учасника. В інших випадках кошти доступні лише з виходом на пенсію (55+ або 60+). Це основний мінус НПФ порівняно з депозитом." },
  { q:"Що буде з НПФ якщо фонд збанкрутує?",
    a:"Активи НПФ зберігаються окремо від активів адміністратора у незалежного зберігача (банк-кастодіан). При банкрутстві адміністратора ваші кошти переходять до іншого фонду. Але немає гарантії як ФГВФО — тому обирайте великі фонди з тривалою історією і значними активами." },
  { q:"НПФ чи депозит — що вибрати?",
    a:"Залежить від горизонту. НПФ виграє на 10+ років: 0% податку + повернення ПДФО (для тих хто його сплачує) роблять ефективну дохідність значно вищою. Депозит краще для коштів які можуть знадобитися протягом 1–3 років. Оптимально: депозит як «подушка», НПФ для довгострокового накопичення." },
];

function addToCalc(fund) {
  try {
    const prev = JSON.parse(localStorage.getItem("porahovano_portfolio") || "[]");
    if (prev.find(e => e.productId === fund.id)) return false;
    localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
      id: Date.now(), productId: fund.id,
      name: fund.name, sub: "UAH · пенсійний фонд",
      rate: fund.rate, cur: "uah", tax: 0, risk: "mid", gtee: "Немає", bonus: true,
      color: "#0F6E56", lump: 0, monthly: 3000,
    }]));
    return true;
  } catch { return false; }
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

function Label({ children }) {
  return <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:8}}>{children}</div>;
}
function Divider() {
  return <div style={{height:1,background:T.border,margin:"40px 0"}}/>;
}

export default function NpfPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [added,   setAdded]   = useState({});

  function handleAdd(fund) {
    if (added[fund.id]) return;
    if (addToCalc(fund)) {
      setAdded(p => ({ ...p, [fund.id]: true }));
      setToast(fund.name);
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <main style={{fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif",color:T.dark,maxWidth:920,margin:"0 auto",padding:"0 20px 60px"}}>

      {/* Breadcrumbs */}
      <nav style={{fontSize:12,color:T.gray,padding:"16px 0 24px",display:"flex",gap:6}}>
        <a href="/" style={{color:T.gray,textDecoration:"none"}}>Porahovano</a>
        <span>›</span>
        <span style={{color:T.dark,fontWeight:600}}>НПФ</span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <div style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:T.greenLt,color:T.green,fontSize:11,fontWeight:700,marginBottom:12,letterSpacing:".05em"}}>
          ОНОВЛЕНО ЧЕРВЕНЬ 2026
        </div>
        <h1 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",margin:"0 0 14px"}}>
          НПФ в Україні:<br/>
          <span style={{color:T.green}}>до 11% + повернення 18% ПДФО</span>
        </h1>
        <p style={{fontSize:15,color:T.gray,maxWidth:580,lineHeight:1.75,margin:"0 0 24px"}}>
          Недержавні пенсійні фонди — єдиний інструмент де держава <strong>доплачує</strong> до ваших внесків. Повернення 18% ПДФО з кожної гривні внеску — бонус поверх відсотків, але лише для тих хто офіційно сплачує ПДФО.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{val:"до 11%",lbl:"річних · UAH"},{val:"0%",lbl:"податку на дохід НПФ"},{val:"+18%",lbl:"ПДФО повертається з внесків"}].map(({val,lbl}) => (
            <div key={lbl} style={{background:T.greenLt,borderRadius:12,padding:"12px 18px",minWidth:130}}>
              <div style={{fontSize:22,fontWeight:700,color:T.green}}>{val}</div>
              <div style={{fontSize:12,color:T.gray,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison block ─────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <div style={{background:T.amberLt,border:`2px solid ${T.amber}`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.amber,letterSpacing:".06em",marginBottom:16}}>
            🏛 ПОРІВНЯННЯ: ДЕПОЗИТ vs НПФ — однаковий внесок 10 000 ₴/міс
          </div>

          {/* VS grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 40px 1fr",gap:0,alignItems:"stretch",marginBottom:14}}>
            {/* Deposit card */}
            <div style={{background:"white",border:`1.5px solid ${T.border}`,borderRadius:10,padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                <span style={{fontSize:18}}>🏦</span>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:T.gray,letterSpacing:".04em"}}>ДЕПОЗИТ</div>
                  <div style={{fontSize:13,fontWeight:700,marginTop:1}}>Таскомбанк · 15% · UAH</div>
                </div>
              </div>
              <div style={{fontSize:13,lineHeight:2}}>
                Вклали: <strong>10 000 ₴/міс</strong><br/>
                Дохід 15%: +1 500 ₴<br/>
                <span style={{color:"#C0392B"}}>Податок 19.5%: −292 ₴</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:"#C0392B",marginTop:8,paddingTop:8,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                Чистий дохід: 1 208 ₴
              </div>
            </div>

            {/* VS separator */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:T.amber,color:"white",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>VS</div>
            </div>

            {/* NPF card */}
            <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:10,padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                <span style={{fontSize:18}}>🏛</span>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".04em"}}>НПФ</div>
                  <div style={{fontSize:13,fontWeight:700,marginTop:1}}>OTP Pension · 11% · UAH</div>
                </div>
              </div>
              <div style={{fontSize:13,lineHeight:2}}>
                Вклали: <strong>10 000 ₴/міс</strong><br/>
                Дохід 11%: +1 100 ₴<br/>
                <span style={{color:T.green}}>Податок на дохід: 0% ✓</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:T.green,marginTop:8,paddingTop:8,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                Чистий дохід: 1 100 ₴
              </div>
              {/* ПДФО bonus */}
              <div style={{marginTop:10,padding:"8px 10px",background:"rgba(239,159,39,.12)",border:`1px dashed ${T.amber}`,borderRadius:7,fontSize:12,lineHeight:1.5}}>
                ⚡ <strong style={{color:T.amber}}>Бонус: +1 800 ₴/міс</strong> — повернення ПДФО з внеску
                <span style={{display:"block",fontSize:11,color:T.gray,marginTop:3}}>Лише якщо офіційно працевлаштований або ФОП і сплачуєш ПДФО</span>
              </div>
            </div>
          </div>

          {/* Bottom summary */}
          <div style={{background:T.dark,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>Різниця (без бонусу):</span>
            <strong style={{fontSize:15,color:T.green}}>−108 ₴/міс</strong>
            <span style={{fontSize:13,color:"rgba(255,255,255,.3)"}}>·</span>
            <span style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>З бонусом ПДФО:</span>
            <strong style={{fontSize:15,color:T.amber}}>+1 692 ₴/міс</strong>
          </div>
        </div>
      </section>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <Label>ПЕНСІЙНІ ФОНДИ</Label>
        <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 14px"}}>Сортування за дохідністю ↓</h2>
        <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 110px 90px 100px 128px",padding:"9px 18px",background:T.grayLt,fontSize:10,fontWeight:700,color:T.gray,letterSpacing:".05em"}}>
            {["ФОНД","ДОХІДНІСТЬ","ПІСЛЯ ПОДАТКУ","РИЗИК","ЛІЦЕНЗІЯ","МІЙ КАПІТАЛ"].map(h => <div key={h}>{h}</div>)}
          </div>
          {FUNDS.map((f, i) => (
            <div key={f.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 110px 90px 100px 128px",padding:"13px 18px",alignItems:"center",borderTop:`1px solid ${T.border}`,background:i===0?T.greenLt:T.white}}>
              <div>
                <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                  {f.name}
                  {i===0&&<span style={{fontSize:10,background:T.green,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700}}>Топ</span>}
                </div>
                <div style={{fontSize:11,color:T.gray,marginTop:2}}>UAH · пенсійний фонд</div>
              </div>
              <div style={{fontSize:19,fontWeight:700,color:T.green}}>{f.rate}%</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:T.green}}>{f.rate}%</div>
                <div style={{fontSize:10,color:T.gray}}>0% податку</div>
              </div>
              <div><span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:"#FFF8EC",color:"#D4891E",fontWeight:600}}>Середній</span></div>
              <div style={{fontSize:12,color:T.gray}}>{f.license}</div>
              <div>
                <button onClick={() => handleAdd(f)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:`1.5px solid ${added[f.id]?T.green:T.border}`,background:added[f.id]?T.greenLt:T.white,color:added[f.id]?T.green:T.gray,fontSize:12,fontWeight:700,cursor:added[f.id]?"default":"pointer"}}>
                  {added[f.id]?"✓ Додано":"+ Мій капітал"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:T.gray,marginTop:10}}>
          Дохідність орієнтовна. Джерело: <a href="https://www.nkczpfr.gov.ua" target="_blank" rel="nofollow" style={{color:T.green}}>nkczpfr.gov.ua</a>, офіційні сайти фондів.
        </p>
      </section>

      <Divider/>

      {/* ── Guarantees ───────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <Label>ГАРАНТІЇ ТА РИЗИКИ</Label>
        <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:14,padding:"20px 24px"}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px",color:T.green}}>🏛 Ліцензія НКЦПФР — держрегулятор</h2>
          <p style={{margin:"0 0 14px",lineHeight:1.7,fontSize:13}}>
            Усі НПФ ліцензовані <strong>Національною комісією з цінних паперів та фондового ринку</strong>. Активи фонду зберігаються окремо від активів адміністратора — при банкрутстві адміністратора ваші гроші захищені.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:T.white,borderRadius:10,padding:"13px 16px",fontSize:13,color:T.gray}}>
              <strong style={{color:T.dark,display:"block",marginBottom:4}}>✓ Переваги:</strong>
              <ul style={{paddingLeft:16,lineHeight:1.9}}>
                <li>0% податку на дохід</li>
                <li>+18% ПДФО з внесків (якщо маєш право)</li>
                <li>Активи відокремлені від адміністратора</li>
                <li>Держрегулювання НКЦПФР</li>
              </ul>
            </div>
            <div style={{background:T.white,borderRadius:10,padding:"13px 16px",fontSize:13,color:T.gray}}>
              <strong style={{color:T.dark,display:"block",marginBottom:4}}>⚠ Ризики:</strong>
              <ul style={{paddingLeft:16,lineHeight:1.9}}>
                <li>Немає гарантії ФГВФО</li>
                <li>Дохідність не гарантована</li>
                <li>Обмежений доступ до коштів до пенсії</li>
                <li>Ризик зміни законодавства</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculation ──────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <Label>РЕАЛЬНА ВИГОДА</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px"}}>Скільки повертає держава щороку</h2>
        <div style={{background:T.grayLt,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.gray,marginBottom:14,letterSpacing:".05em"}}>
            ПРИКЛАД — внески 5 000 ₴/міс протягом 12 місяців
          </div>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6}}>
            {[
              {lbl:"Внесено за рік",      val:"₴60 000",   sub:"5 000 × 12 міс.",       c:T.dark},
              null,
              {lbl:"Дохід НПФ 11%",      val:"+₴3 300",   sub:"без оподаткування",      c:T.green},
              null,
              {lbl:"Повернення ПДФО",    val:"+₴10 800",  sub:"18% від 60 000 ₴ · якщо маєш право", c:T.amber},
              null,
              {lbl:"Всього за рік",       val:"₴74 100",   sub:"реально +23.5%",         c:T.green},
            ].map((item,i) =>
              item===null
                ? <div key={i} style={{fontSize:18,color:T.gray,padding:"0 2px"}}>→</div>
                : <div key={i} style={{padding:"10px 12px",textAlign:"center",flex:1,minWidth:90}}>
                    <div style={{fontSize:11,color:T.gray,fontWeight:600,marginBottom:4}}>{item.lbl}</div>
                    <div style={{fontSize:16,fontWeight:700,color:item.c}}>{item.val}</div>
                    <div style={{fontSize:11,color:T.gray,marginTop:2,lineHeight:1.4}}>{item.sub}</div>
                  </div>
            )}
          </div>
        </div>
      </section>

      <Divider/>

      {/* ── Steps ────────────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <Label>ПОКРОКОВО</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Як відкрити рахунок у НПФ</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {n:"01",t:"Обери фонд",      d:"OTP Pension — найбільший і найнадійніший за активами."},
            {n:"02",t:"Подай заяву",     d:"Онлайн або у відділенні. Паспорт + ІПН. 15–30 хвилин."},
            {n:"03",t:"Роби внески",     d:"Щомісяця будь-яка сума. Мінімуму немає. Зручно автоплатежем."},
            {n:"04",t:"Повертай ПДФО",   d:"Через декларацію або роботодавця. 18% від суми внесків."},
          ].map(({n,t,d}) => (
            <div key={n} style={{background:T.grayLt,borderRadius:12,padding:"15px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:8}}>{n}</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:5}}>{t}</div>
              <div style={{fontSize:12,color:T.gray,lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider/>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section style={{marginBottom:40}}>
        <Label>ЧАСТІ ЗАПИТАННЯ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>НПФ — що потрібно знати</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FAQ.map((item,i) => {
            const open = openFaq===i;
            return (
              <div key={i} style={{border:`1.5px solid ${open?T.green:T.border}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={() => setOpenFaq(open?null:i)} style={{width:"100%",textAlign:"left",padding:"14px 18px",background:open?T.greenLt:T.white,border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:14,fontWeight:600,color:T.dark,gap:10}}>
                  {item.q}
                  <span style={{fontSize:20,color:T.green,flexShrink:0,display:"inline-block",transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
                </button>
                {open && <div style={{padding:"0 18px 14px",fontSize:14,color:T.gray,lineHeight:1.75,background:T.greenLt}}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{background:T.dark,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>Порахуй скільки накопичиш з НПФ за 20 років</div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>Додай НПФ до портфеля у «Мій капітал» — побачиш ефект повернення ПДФО у цифрах.</p>
        <a href="/kalkulator" style={{display:"inline-block",padding:"11px 26px",background:T.green,color:"white",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none"}}>Відкрити «Мій капітал» →</a>
      </section>

      {toast && <Toast name={toast} onClose={() => setToast(null)}/>}
    </main>
  );
}
