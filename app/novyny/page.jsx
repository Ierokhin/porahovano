"use client";
// porahovano.in.ua/novyny — /app/novyny/page.jsx

import { useState } from "react";
import Link from "next/link";

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", dark:"#1A2E2A", gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0", white:"#FFFFFF",
};

const CATS = [
  { id:"all",     label:"Всі" },
  { id:"deposit", label:"🏦 Депозити" },
  { id:"ovdp",    label:"📜 ОВДП" },
  { id:"market",  label:"📊 Ринок" },
  { id:"crypto",  label:"⛓ Крипто" },
  { id:"etf",     label:"📈 ETF" },
];

const CAT_STYLE = {
  deposit: { bg:"#EFF6FF", c:"#2563EB", label:"Депозити" },
  ovdp:    { bg:T.greenLt, c:T.green,   label:"ОВДП" },
  market:  { bg:"#FFF8EC", c:"#D4891E", label:"Ринок" },
  crypto:  { bg:"#F3E8FF", c:"#7C3AED", label:"Крипто" },
  etf:     { bg:"#F0FDF4", c:"#16A34A", label:"ETF" },
};

const FEATURED = {
  cat:"ovdp", icon:"📜",
  title:"НБУ знизив облікову ставку до 14.5% — що це означає для депозитів і ОВДП",
  date:"23 червня 2026",
  excerpt:"Національний банк України прийняв рішення знизити облікову ставку на 0.5 відсоткових пункти. Це сигнал для ринку: ставки за депозитами поступово підуть донизу. ОВДП з фіксованою ставкою стають вигіднішими — фіксуй прибутковість зараз. Розбираємо наслідки рішення для кожного інструменту і що робити інвестору.",
};

const NEWS = [
  { id:1, cat:"deposit", icon:"🏦", bg:"#EFF6FF", title:"Юнекс Банк підняв ставку до 17.5% — стає новим лідером ринку",                    excerpt:"Банк оголосив про підвищення ставки за 12-місячними депозитами. Після 19.5% податку реально залишається 14.1%.", date:"20 червня 2026" },
  { id:2, cat:"ovdp",    icon:"📜", bg:"#E1F5EE", title:"Мінфін розмістив ОВДП на 8.2 млрд грн — попит перевищив пропозицію",              excerpt:"На аукціоні зафіксовано рекордний попит. Ставки UAH ОВДП на 12 місяців залишились на рівні 16%.", date:"18 червня 2026" },
  { id:3, cat:"market",  icon:"📊", bg:"#FFF8EC", title:"Курс долара стабілізувався на рівні 41.5 ₴ — що чекати до кінця року",            excerpt:"НБУ утримує курс в межах коридору. Аналізуємо вплив на EUR-депозити та ОВДП в євро.", date:"15 червня 2026" },
  { id:4, cat:"crypto",  icon:"⛓", bg:"#F3E8FF", title:"Bitcoin пробив $100k знову — чи варто купувати зараз українцям",                  excerpt:"Розбираємо поточний цикл, ризики і як правильно виходити з позиції з урахуванням українського оподаткування.", date:"12 червня 2026" },
  { id:5, cat:"etf",     icon:"📈", bg:"#F0FDF4", title:"S&P 500 повернувся до максимумів — CSPX знову на піку",                           excerpt:"Аналізуємо що відбулось з ETF-портфелями українських інвесторів за перше півріччя 2026.", date:"10 червня 2026" },
  { id:6, cat:"ovdp",    icon:"📜", bg:"#E1F5EE", title:"Як купити ОВДП через Дію у 2026 році — покрокова інструкція",                     excerpt:"Оновлений гайд з актуальними скріншотами. Від реєстрації до першої покупки за 15 хвилин.", date:"5 червня 2026" },
  { id:7, cat:"deposit", icon:"🏦", bg:"#EFF6FF", title:"ФГВФО підняв ліміт гарантії до 800 000 ₴ — що це означає",                        excerpt:"Верховна Рада ухвалила зміни до закону. Нові правила вступають в силу з 1 серпня 2026 року.", date:"1 червня 2026" },
  { id:8, cat:"market",  icon:"📊", bg:"#FFF8EC", title:"Топ-5 інвестиційних інструментів першого півріччя 2026",                           excerpt:"Що показало найкращу дохідність після податків? Порівнюємо реальні цифри: ОВДП, депозити, ETF і золото.", date:"28 травня 2026" },
  { id:9, cat:"etf",     icon:"🛡", bg:"#FEF2F2", title:"NATO ETF — рік роботи: +23% і що далі для оборонного сектору",                    excerpt:"Аналіз результатів VanEck Defense ETF за рік. Чи варто купувати після такого зростання?", date:"20 травня 2026" },
];

export default function NovynyPage() {
  const [activeCat, setActiveCat] = useState("all");
  const filtered = activeCat === "all" ? NEWS : NEWS.filter(n => n.cat === activeCat);

  return (
    <main style={{ fontFamily:"'Manrope','Segoe UI',system-ui,sans-serif", color:T.dark, maxWidth:960, margin:"0 auto", padding:"0 20px 60px" }}>

      <nav style={{ fontSize:12, color:T.gray, padding:"16px 0 24px", display:"flex", gap:6 }}>
        <a href="/" style={{ color:T.gray, textDecoration:"none" }}>Porahovano</a>
        <span>›</span>
        <span style={{ color:T.dark, fontWeight:600 }}>Новини</span>
      </nav>

      <h1 style={{ fontSize:"clamp(24px,5vw,34px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-.5px", margin:"0 0 8px" }}>
        Новини та <span style={{ color:T.green }}>оновлення ставок</span>
      </h1>
      <p style={{ fontSize:14, color:T.gray, lineHeight:1.7, margin:"0 0 24px" }}>
        Актуальні зміни ставок депозитів, ОВДП та ринкові новини для інвесторів в Україні.
      </p>

      {/* Telegram CTA */}
      <div style={{ background:T.dark, borderRadius:14, padding:"18px 22px", display:"flex", alignItems:"center", gap:16, marginBottom:32, flexWrap:"wrap" }}>
        <div style={{ width:44, height:44, borderRadius:10, background:T.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21.8 2.2L1 9.5c-1.4.5-1.4 1.3-.2 1.7l5.1 1.6 1.9 5.9c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.3 1.8-.9l3.3-15.2c.3-1.4-.5-2-1.5-1.7z" fill="white"/>
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:3 }}>Новини першими — в Telegram</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>Зміни ставок, нові інструменти та поради щотижня · @porakhovano</div>
        </div>
        <a href="https://t.me/porakhovano" target="_blank" rel="noopener noreferrer"
          style={{ padding:"9px 18px", background:T.amber, color:T.dark, borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
          Підписатись →
        </a>
      </div>

      {/* Featured */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:`1.5px solid ${T.border}`, borderRadius:16, overflow:"hidden", marginBottom:32 }}>
        <div style={{ background:`linear-gradient(135deg,${T.dark} 0%,#2A4A44 100%)`, padding:28, display:"flex", flexDirection:"column", justifyContent:"flex-end", minHeight:220 }}>
          <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:T.green, color:"white", fontSize:11, fontWeight:700, marginBottom:12 }}>
            {CAT_STYLE[FEATURED.cat].label}
          </span>
          <div style={{ fontSize:17, fontWeight:700, color:"white", lineHeight:1.35, marginBottom:8 }}>{FEATURED.title}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.45)" }}>{FEATURED.date}</div>
        </div>
        <div style={{ padding:24, background:"white", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <p style={{ fontSize:13, color:T.gray, lineHeight:1.75, flex:1, marginBottom:16 }}>{FEATURED.excerpt}</p>
          <a href="#" style={{ display:"inline-block", padding:"9px 18px", background:T.green, color:"white", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", alignSelf:"flex-start" }}>
            Читати далі →
          </a>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
            padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
            border:`1.5px solid ${activeCat===c.id ? T.green : T.border}`,
            background: activeCat===c.id ? T.green : T.white,
            color: activeCat===c.id ? "white" : T.gray,
            transition:"all .15s",
          }}>{c.label}</button>
        ))}
      </div>

      {/* News grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:36 }}>
        {filtered.map(n => {
          const cs = CAT_STYLE[n.cat];
          return (
            <div key={n.id} style={{ border:`1.5px solid ${T.border}`, borderRadius:14, overflow:"hidden", background:"white", cursor:"pointer", transition:"border-color .15s, box-shadow .15s" }}>
              <div style={{ height:100, background:n.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>{n.icon}</div>
              <div style={{ padding:14 }}>
                <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:cs.bg, color:cs.c, marginBottom:8 }}>{cs.label}</span>
                <div style={{ fontSize:13, fontWeight:700, lineHeight:1.4, marginBottom:6, color:T.dark }}>{n.title}</div>
                <div style={{ fontSize:12, color:T.gray, lineHeight:1.6, marginBottom:10 }}>{n.excerpt}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, color:"#aaa" }}>
                  <span>{n.date}</span>
                  <a href="#" style={{ color:T.green, fontWeight:700, textDecoration:"none" }}>Читати →</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
