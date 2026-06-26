"use client";
// porahovano.in.ua/depozyty — /app/depozyty/page.jsx

import { useState } from "react";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", amberLt:"#FFF8EC",
  dark:"#1A2E2A",  gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};
const TAX = 0.195;

const BANKS_UAH = [
  {id:"yunex",    name:"Юнекс Банк",  rate:17,   min:"5 000 ₴",  stars:3, online:true  },
  {id:"akord",    name:"Акордбанк",   rate:16.5, min:"10 000 ₴", stars:3, online:false },
  {id:"task",     name:"Таскомбанк",  rate:16,   min:"500 ₴",    stars:4, online:true  },
  {id:"pumb",     name:"ПУМБ",        rate:15,   min:"1 000 ₴",  stars:4, online:true  },
  {id:"raiff",    name:"Райффайзен",  rate:14,   min:"1 000 ₴",  stars:4, online:true  },
  {id:"mono",     name:"Monobank",    rate:13,   min:"1 ₴",      stars:5, online:true  },
  {id:"privat",   name:"ПриватБанк",  rate:12,   min:"100 ₴",    stars:5, online:true  },
  {id:"oschad",   name:"Ощадбанк",    rate:10,   min:"500 ₴",    stars:5, online:true  },
];

// EUR у повних українських банків — це зберігання, не заробіток
// Реальні ставки: 0.01%–2%. Джерело: minfin.com.ua, finance.ua
const BANKS_EUR = [
  {id:"task-e",   name:"Таскомбанк",  rate:2,    min:"200 €",   stars:4, online:true  },
  {id:"pumb-e",   name:"ПУМБ",        rate:1.5,  min:"200 €",   stars:4, online:true  },
  {id:"otp-e",    name:"ОТП Банк",    rate:1,    min:"500 €",   stars:4, online:false },
  {id:"ukrsib-e", name:"Укрсиббанк",  rate:0.5,  min:"200 €",   stars:4, online:false },
  {id:"raiff-e",  name:"Райффайзен",  rate:0.1,  min:"100 €",   stars:4, online:true  },
  {id:"privat-e", name:"ПриватБанк",  rate:0.01, min:"1 €",     stars:5, online:true  },
  {id:"oschad-e", name:"Ощадбанк",    rate:0.01, min:"500 €",   stars:5, online:false },
];

const FAQ = [
  {q:"Чи можна достроково зняти депозит?",
   a:"Так, але більшість банків анулюють нараховані відсотки. Якщо гроші можуть знадобитися раніше — обирайте накопичувальний рахунок або короткі строки (3–6 місяців)."},
  {q:"Що буде з депозитом якщо банк збанкрутує?",
   a:"ФГВФО гарантує повернення вкладу до 600 000 ₴ на одного вкладника в одному банку. Якщо у вас більше — розподіліть по кількох банках. EUR вклади теж захищені, але ліміт рахується в гривні за курсом НБУ."},
  {q:"Чому такі низькі ставки по EUR депозитах?",
   a:"Українські банки не мають де розміщати євро під хороший відсоток — ринок EUR-кредитів в Україні обмежений. EUR депозит тут — це зберігання, а не заробіток. Для EUR дохідності дивіться ОВДП в євро (4–6%) або ETF (8–10%)."},
  {q:"Коли найкраще відкривати депозит?",
   a:"Якщо ставки на піку — зараз. Ставки поступово знижуються слідом за обліковою ставкою НБУ, тому фіксувати довгострокову ставку вигідно одразу."},
  {q:"Що вигідніше — депозит чи ОВДП?",
   a:"ОВДП з тією самою ставкою дадуть більше на руки: лише 1.5% військового збору замість 19.5% по депозиту. ОВДП 16% → реально 15.76%. Депозит 16% → реально 12.9%. Різниця суттєва."},
];

function Stars({n}){
  return <span style={{fontSize:12,letterSpacing:-1}}>{"★".repeat(n)}<span style={{color:"#DDD"}}>{"★".repeat(5-n)}</span></span>;
}
function Label({children}){
  return <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:10}}>{children}</div>;
}
function Divider(){
  return <div style={{height:1,background:T.border,margin:"40px 0"}}/>;
}

function addToCalc(bank, cur){
  try{
    const prev = JSON.parse(localStorage.getItem("porahovano_portfolio")||"[]");
    if(prev.find(e=>e.productId===bank.id)) return false;
    localStorage.setItem("porahovano_portfolio", JSON.stringify([...prev, {
      id:Date.now(), productId:bank.id, name:bank.name,
      sub:`${cur.toUpperCase()} · 12 міс.`, rate:bank.rate, cur,
      tax:TAX, risk:bank.stars>=4?"low":"mid", gtee:"ФГВФО",
      color:"#0F6E56", lump:0, monthly:cur==="uah"?3000:100,
    }]));
    return true;
  }catch{return false;}
}

function Toast({name,onClose}){
  return(
    <div style={{
      position:"fixed",bottom:24,right:24,zIndex:1000,
      background:T.dark,color:"white",borderRadius:12,
      padding:"14px 18px",boxShadow:"0 8px 24px rgba(0,0,0,.25)",
      display:"flex",alignItems:"center",gap:12,maxWidth:300,
    }}>
      <span style={{fontSize:18}}>✓</span>
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{name} — додано до портфеля</div>
        <a href="/kalkulator" style={{fontSize:12,color:T.amber,textDecoration:"none"}}>
          Перейти до «Мій капітал» →
        </a>
      </div>
      <button onClick={onClose} style={{
        background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18,padding:0,marginLeft:"auto",
      }}>×</button>
    </div>
  );
}

export default function DepozytyPage(){
  const [cur,     setCur]     = useState("uah");
  const [openFaq, setOpenFaq] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [added,   setAdded]   = useState({});

  const banks   = cur==="uah" ? BANKS_UAH : BANKS_EUR;
  const topRate = banks[0].rate;
  const net     = r => +(r*(1-TAX)).toFixed(2);

  const EX_SUM   = cur==="uah" ? 100000 : 5000;
  const EX_RATE  = cur==="uah" ? 15 : 1.5;
  const EX_GROSS = EX_SUM*EX_RATE/100;
  const EX_TAX   = EX_GROSS*TAX;
  const EX_NET   = EX_GROSS-EX_TAX;
  const S        = cur==="uah"?"₴":"€";

  function handleAdd(bank){
    if(added[bank.id]) return;
    if(addToCalc(bank,cur)){
      setAdded(p=>({...p,[bank.id]:true}));
      setToast(bank.name);
      setTimeout(()=>setToast(null), 4000);
    }
  }

  return(
    <main style={{fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif",color:T.dark,maxWidth:920,margin:"0 auto",padding:"0 20px 60px"}}>

      {/* Хлібні крихти */}
      <nav style={{fontSize:12,color:T.gray,padding:"16px 0 24px",display:"flex",gap:6}}>
        <a href="/" style={{color:T.gray,textDecoration:"none"}}>Porahovano</a>
        <span>›</span>
        <span style={{color:T.dark,fontWeight:600}}>Депозити</span>
      </nav>

      {/* Hero */}
      <section style={{marginBottom:40}}>
        <div style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:T.greenLt,color:T.green,fontSize:11,fontWeight:700,marginBottom:12,letterSpacing:".05em"}}>
          ОНОВЛЕНО ЧЕРВЕНЬ 2026
        </div>
        <h1 style={{fontSize:"clamp(24px,5vw,36px)",fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",margin:"0 0 14px"}}>
          Депозити в Україні:<br/>
          <span style={{color:T.green}}>до {topRate}% річних</span> у гривні
        </h1>
        <p style={{fontSize:15,color:T.gray,maxWidth:560,lineHeight:1.75,margin:"0 0 24px"}}>
          Фіксований відсоток, вклад до 600 000 ₴ гарантований ФГВФО. Банк утримує 19.5% податку автоматично — ми показуємо реальну суму на руки.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{val:`до ${topRate}%`,lbl:"річних у гривні"},{val:"600 000 ₴",lbl:"гарантія ФГВФО на банк"},{val:"від 1 ₴",lbl:"мін. сума онлайн"}].map(({val,lbl})=>(
            <div key={lbl} style={{background:T.greenLt,borderRadius:12,padding:"12px 18px",minWidth:130}}>
              <div style={{fontSize:22,fontWeight:700,color:T.green}}>{val}</div>
              <div style={{fontSize:12,color:T.gray,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Таблиця */}
      <section style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div>
            <Label>ПОРІВНЯННЯ БАНКІВ</Label>
            <h2 style={{fontSize:20,fontWeight:700,margin:0}}>За 12 місяців · Сортування за ставкою ↓</h2>
          </div>
          <div style={{display:"flex",border:`1.5px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            {["uah","eur"].map(c=>(
              <button key={c} onClick={()=>setCur(c)} style={{
                padding:"8px 20px",border:"none",cursor:"pointer",
                background:cur===c?T.green:T.white, color:cur===c?T.white:T.gray,
                fontSize:13,fontWeight:700,transition:"all .15s",
              }}>{c==="uah"?"₴ UAH":"€ EUR"}</button>
            ))}
          </div>
        </div>

        {/* EUR попередження */}
        {cur==="eur"&&(
          <div style={{background:T.amberLt,border:`1.5px solid ${T.amber}`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,lineHeight:1.65}}>
            <strong style={{color:T.amber}}>Чому такі низькі ставки в EUR?</strong> Українські банки не мають де розміщати євро під хороший відсоток — EU-кредитний ринок для них закритий. EUR депозит в Україні = зберігання, не заробіток.{" "}
            Хочете дохідності в EUR → <a href="/ovdp" style={{color:T.green,fontWeight:700}}>ОВДП EUR (4–6%)</a> або <a href="/etf" style={{color:T.green,fontWeight:700}}>ETF (8–10%)</a>.
          </div>
        )}

        <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
          {/* Заголовки */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 76px 110px 88px 52px 120px 128px",padding:"9px 18px",background:T.grayLt,fontSize:10,fontWeight:700,color:T.gray,letterSpacing:".05em"}}>
            {["БАНК","СТАВКА","ПІСЛЯ ПОДАТКІВ","МІН. СУМА","ОНЛАЙН","ВІДКРИТИ","МІЙ КАПІТАЛ"].map(h=><div key={h}>{h}</div>)}
          </div>

          {banks.map((b,i)=>{
            const isTop   = i===0;
            const isAdded = !!added[b.id];
            return(
              <div key={b.id} style={{
                display:"grid",gridTemplateColumns:"1fr 76px 110px 88px 52px 120px 128px",
                padding:"13px 18px",alignItems:"center",
                borderTop:`1px solid ${T.border}`,
                background:isTop?T.greenLt:T.white,
              }}>
                <div>
                  <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    {b.name}
                    {isTop&&<span style={{fontSize:10,background:T.green,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700}}>Топ</span>}
                  </div>
                  <Stars n={b.stars}/>
                </div>
                <div style={{fontSize:19,fontWeight:700,color:T.green}}>{b.rate}%</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:T.amber}}>{net(b.rate)}%</div>
                  <div style={{fontSize:10,color:T.gray}}>−19.5% податку</div>
                </div>
                <div style={{fontSize:12,color:T.gray}}>{b.min}</div>
                <div style={{fontSize:15,color:b.online?T.green:T.gray}}>{b.online?"✓":"—"}</div>
                <div>
                  <a href="#" style={{
                    display:"block",textAlign:"center",padding:"7px 10px",borderRadius:8,textDecoration:"none",
                    background:isTop?T.green:"transparent",
                    border:`1.5px solid ${isTop?T.green:T.border}`,
                    color:isTop?T.white:T.dark,fontSize:12,fontWeight:600,
                  }}>Відкрити →</a>
                </div>
                <div>
                  <button onClick={()=>handleAdd(b)} style={{
                    width:"100%",padding:"7px 10px",borderRadius:8,
                    border:`1.5px solid ${isAdded?T.green:T.border}`,
                    background:isAdded?T.greenLt:T.white,
                    color:isAdded?T.green:T.gray,
                    fontSize:12,fontWeight:700,cursor:isAdded?"default":"pointer",
                  }}>
                    {isAdded?"✓ Додано":"+ Мій капітал"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{fontSize:12,color:T.gray,marginTop:10}}>
          Ставки орієнтовні. Джерело: <a href="https://minfin.com.ua/ua/deposits/" target="_blank" rel="nofollow" style={{color:T.green}}>minfin.com.ua</a>, <a href="https://banki.ua/deposit" target="_blank" rel="nofollow" style={{color:T.green}}>banki.ua</a>.
        </p>
      </section>

      <Divider/>

      {/* ФГВФО */}
      <section style={{marginBottom:40}}>
        <Label>ГАРАНТІЇ</Label>
        <div style={{background:T.greenLt,border:`1.5px solid ${T.green}`,borderRadius:14,padding:"20px 24px"}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px",color:T.green}}>🛡 Гарантія ФГВФО — 600 000 ₴</h2>
          <p style={{margin:"0 0 14px",lineHeight:1.7}}>
            Усі банки в таблиці — учасники <strong>Фонду гарантування вкладів</strong>. При банкрутстві ФГВФО поверне до <strong>600 000 ₴</strong> на вкладника на банк.
          </p>
          <div style={{background:T.white,borderRadius:10,padding:"13px 16px",fontSize:13,color:T.gray,lineHeight:1.7}}>
            <strong style={{color:T.dark}}>Є більше 600 000 ₴?</strong> Розподіліть між кількома банками — на кожен окремий ліміт. EUR вклади також захищені, але ліміт рахується в гривні за курсом НБУ на день виплати.
          </div>
          <div style={{marginTop:10,fontSize:12,color:T.gray}}>
            Реєстр ФГВФО: <a href="https://www.fgvfo.gov.ua" target="_blank" rel="nofollow" style={{color:T.green}}>fgvfo.gov.ua</a>
          </div>
        </div>
      </section>

      {/* Розрахунок після податків */}
      <section style={{marginBottom:40}}>
        <Label>РЕАЛЬНА ДОХІДНІСТЬ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 10px"}}>Скільки залишається після 19.5% податку</h2>
        <p style={{color:T.gray,lineHeight:1.7,margin:"0 0 16px"}}>
          Банк утримує автоматично: <strong>18% ПДФО + 1.5% військовий збір</strong>. Отримуєте вже очищену суму.
        </p>
        <div style={{background:T.grayLt,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px 24px"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.gray,marginBottom:14,letterSpacing:".05em"}}>
            ПРИКЛАД — {S}{EX_SUM.toLocaleString("uk-UA")} під {EX_RATE}% на 12 місяців
          </div>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:4}}>
            {[
              {lbl:"Вкладаєте",    val:`${S}${EX_SUM.toLocaleString("uk-UA")}`,        sub:`під ${EX_RATE}%`,    c:T.dark},
              null,
              {lbl:"Нараховано",  val:`+${S}${Math.round(EX_GROSS).toLocaleString("uk-UA")}`, sub:"за 12 місяців", c:T.green},
              null,
              {lbl:"Податок",     val:`−${S}${Math.round(EX_TAX).toLocaleString("uk-UA")}`,  sub:"19.5% авто",    c:"#C0392B"},
              null,
              {lbl:"На руки",     val:`${S}${Math.round(EX_NET).toLocaleString("uk-UA")}`,   sub:`реально ${net(EX_RATE)}%`, c:T.amber},
            ].map((item,i)=>
              item===null
                ? <div key={i} style={{fontSize:20,color:T.gray,padding:"0 2px"}}>→</div>
                : <div key={i} style={{padding:"10px 14px",textAlign:"center",flex:1,minWidth:100}}>
                    <div style={{fontSize:11,color:T.gray,fontWeight:600,marginBottom:4}}>{item.lbl}</div>
                    <div style={{fontSize:18,fontWeight:700,color:item.c}}>{item.val}</div>
                    <div style={{fontSize:11,color:T.gray}}>{item.sub}</div>
                  </div>
            )}
          </div>
        </div>
      </section>

      <Divider/>

      {/* UAH vs EUR */}
      <section style={{marginBottom:40}}>
        <Label>ЯКУ ВАЛЮТУ ОБРАТИ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>Гривня чи євро?</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{border:`2px solid ${T.green}`,borderRadius:14,padding:"18px 20px"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>₴ Гривня — для заробітку</div>
            <ul style={{margin:0,padding:"0 0 0 16px",lineHeight:1.85,color:T.gray,fontSize:13}}>
              <li>Ставка 10–17% річних</li>
              <li>Підходить якщо витрати в Україні</li>
              <li>Ризик: знецінення при девальвації</li>
              <li>Гарантія ФГВФО до 600 000 ₴</li>
            </ul>
            <div style={{marginTop:12,fontSize:13,fontWeight:700,color:T.green}}>✓ Горизонт 6–24 місяці</div>
          </div>
          <div style={{border:`1.5px solid ${T.border}`,borderRadius:14,padding:"18px 20px"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>€ Євро — для зберігання</div>
            <ul style={{margin:0,padding:"0 0 0 16px",lineHeight:1.85,color:T.gray,fontSize:13}}>
              <li>Ставка 0.01–2% — майже нульова</li>
              <li>Захист від курсових коливань</li>
              <li>Підходить якщо є витрати в EUR</li>
              <li>Для заробітку — ОВДП або ETF</li>
            </ul>
            <div style={{marginTop:12,fontSize:13,fontWeight:700,color:T.amber}}>
              ⚡ Для EUR дохідності → <a href="/ovdp" style={{color:T.green}}>ОВДП EUR 4–6%</a>
            </div>
          </div>
        </div>
      </section>

      {/* Покроково */}
      <section style={{marginBottom:40}}>
        <Label>ПОКРОКОВО</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 16px"}}>Як відкрити депозит за 5 хвилин</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {n:"01",t:"Обери банк",        d:"У таблиці вище — орієнтуйся на ставку і надійність"},
            {n:"02",t:"Завантаж додаток",  d:"Більшість банків відкривають депозит онлайн без відділення"},
            {n:"03",t:"Верифікація",       d:"Паспорт + ІПН через BankID або Дія — 2–5 хвилин"},
            {n:"04",t:"Поповни рахунок",   d:"Обери суму, строк і ставку. Відсотки нараховуються з першого дня"},
          ].map(({n,t,d})=>(
            <div key={n} style={{background:T.grayLt,borderRadius:12,padding:"15px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:".1em",marginBottom:8}}>{n}</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:5}}>{t}</div>
              <div style={{fontSize:12,color:T.gray,lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider/>

      {/* FAQ */}
      <section style={{marginBottom:40}}>
        <Label>ЧАСТІ ЗАПИТАННЯ</Label>
        <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 14px"}}>Депозити — що потрібно знати</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FAQ.map((item,i)=>{
            const open=openFaq===i;
            return(
              <div key={i} style={{border:`1.5px solid ${open?T.green:T.border}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={()=>setOpenFaq(open?null:i)} style={{
                  width:"100%",textAlign:"left",padding:"14px 18px",
                  background:open?T.greenLt:T.white, border:"none",cursor:"pointer",
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  fontSize:14,fontWeight:600,color:T.dark,
                }}>
                  {item.q}
                  <span style={{fontSize:20,color:T.green,flexShrink:0,marginLeft:12,
                    display:"inline-block",transform:open?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
                </button>
                {open&&(
                  <div style={{padding:"0 18px 14px",fontSize:14,color:T.gray,lineHeight:1.75,background:T.greenLt}}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{background:T.dark,borderRadius:16,padding:"28px 32px",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:8}}>
          Хочеш побачити скільки накопичиш?
        </div>
        <p style={{color:"#9FE1CB",margin:"0 0 20px",fontSize:14}}>
          Додай депозит до портфеля у «Мій капітал» і отримай прогноз на 5, 10 або 20 років.
        </p>
        <a href="/kalkulator" style={{
          display:"inline-block",padding:"11px 26px",
          background:T.green,color:"white",borderRadius:10,
          fontSize:14,fontWeight:700,textDecoration:"none",
        }}>Відкрити «Мій капітал» →</a>
      </section>

      {toast&&<Toast name={toast} onClose={()=>setToast(null)}/>}
    </main>
  );
}
