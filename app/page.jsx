// porahovano.in.ua — головна сторінка
// /app/page.jsx — динамічна, дані з /public/data/rates.json

import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

const G  = "#0F6E56";
const GL = "#E1F5EE";
const A  = "#EF9F27";
const D  = "#1A2E2A";
const GR = "#73726C";
const B  = "#E5E5E0";
const S  = "#F5FAF8";

// ── Зчитуємо rates.json на сервері при кожному запиті ────────────────────────
async function getRates() {
  try {
    const file = path.join(process.cwd(), "public", "data", "rates.json");
    const json = await fs.readFile(file, "utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Допоміжні функції ────────────────────────────────────────────────────────
function net(rate, tax = 0.195) {
  return +(rate * (1 - tax)).toFixed(1);
}

function bestDeposit(banks = []) {
  return [...banks]
    .filter(b => b.rate_12m !== null)
    .sort((a, b) => b.rate_12m - a.rate_12m)[0] ?? null;
}

// ── Статичні дані ─────────────────────────────────────────────────────────────
const RISK_STYLE = {
  low:  { bg: GL,       c: G },
  mid:  { bg: "#FFF8EC", c: "#D4891E" },
  high: { bg: "#FAECE7", c: "#C0392B" },
};
const RISK_LABEL = { low:"Низький", mid:"Середній", high:"Високий" };

const WHY = [
  { icon:"🔢", title:"Реальна дохідність після податків",
    text:"Показуємо скільки залишиться на руки після 18% ПДФО та 1.5% військового збору — не рекламну ставку." },
  { icon:"📊", title:"Конструктор портфеля",
    text:"Додай кілька інструментів, встанови суму і горизонт — побачиш прогноз на 1–25 років і щомісячну виплату." },
  { icon:"🇺🇦", title:"Для українців",
    text:"Тільки те, що доступно з України. UAH і EUR. Без USD і американських брокерів без доступу." },
];

// ── Сторінка ──────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const rates = await getRates();

  // Кращі ставки для Hero-картки
  const topDepoUah  = bestDeposit(rates?.depozyty?.uah);
  const topDepoEur  = bestDeposit(rates?.depozyty?.eur);
  const topOvdpUah  = rates?.ovdp?.uah?.[0] ?? null;
  const topEtf      = rates?.etf?.[0] ?? null;
  const updatedDate = rates?.updated ?? "";

  // Картки інструментів — ставки з rates.json де є, інакше статичні
  const INSTRUMENTS = [
    {
      icon:"🏦", name:"Депозити", sub:"UAH / EUR · ФГВФО 600k",
      rate: topDepoUah ? `${topDepoUah.rate_12m}%` : "—",
      rateLbl: topDepoUah ? `${topDepoUah.name} · UAH · 12 міс.` : "топ ставка · UAH",
      risk:"low", badge:null, href:"/depozyty",
    },
    {
      icon:"📜", name:"ОВДП", sub:"UAH / EUR · Держава",
      rate: topOvdpUah ? `${topOvdpUah.rate}%` : "—",
      rateLbl: topOvdpUah ? `${topOvdpUah.rate}% до ${net(topOvdpUah.rate, 0.015)}% після 1.5%` : "топ ставка · UAH",
      risk:"low", badge:"⚡ лише 1.5% податку", href:"/ovdp",
    },
    {
      icon:"🏛", name:"НПФ", sub:"UAH · пенсійні фонди",
      rate:`${rates?.npf?.[0]?.rate ?? 11}%`,
      rateLbl:"середня дохідність · 0% податку",
      risk:"mid", badge:"+18% ПДФО повертається", href:"/npf",
    },
    {
      icon:"📈", name:"ETF", sub:"EUR · IBKR · LSE",
      rate: topEtf ? `${topEtf.rate}%` : "—",
      rateLbl: topEtf ? `${topEtf.ticker} · довгострокове` : "S&P 500 · довгострокове",
      risk:"mid", badge:null, href:"/etf",
    },
    {
      icon:"🏨", name:"Нерухомість", sub:"UAH · готелі та апарти",
      rate:"14%", rateLbl:"FEST Hospitality · UAH",
      risk:"mid", badge:null, href:"/alternatyvni",
    },
    {
      icon:"🥇", name:"Золото", sub:"EUR · ETF через IBKR",
      rate:"~7%", rateLbl:"IGLN Gold ETF · LSE",
      risk:"low", badge:null, href:"/alternatyvni",
    },
    {
      icon:"⛓", name:"Блокчейн", sub:"EUR · крипто / стейблкоїни",
      rate:"4–15%", rateLbl:"стейкінг / стейблкоїни",
      risk:"high", badge:null, href:"/alternatyvni",
    },
  ];

  // Топ-3 після податків
  const top3 = [
    {
      pos:"🥇 МІСЦЕ 1", name:"ОВДП UAH",
      sub: topOvdpUah ? `${topOvdpUah.term} · Держава` : "12 місяців · Держава",
      rate: topOvdpUah ? `${net(topOvdpUah.rate, 0.015)}%` : "15.76%",
      note: topOvdpUah ? `реально на руки (${topOvdpUah.rate}% − 1.5%)` : "реально на руки",
      tag:"⚡ пільговий податок", dark:true,
    },
    {
      pos:"🥈 МІСЦЕ 2",
      name: topDepoUah?.name ?? "Юнекс Банк",
      sub:"Депозит · 12 міс. · ФГВФО",
      rate: topDepoUah ? `${net(topDepoUah.rate_12m)}%` : "13.7%",
      note: topDepoUah ? `реально на руки (${topDepoUah.rate_12m}% − 19.5%)` : "реально на руки",
      tag:"надійний, онлайн", dark:false,
    },
    {
      pos:"🥉 МІСЦЕ 3", name:"Нерухомість",
      sub:"Готель під управлінням · UAH",
      rate:"11.3%", note:"реально на руки (14% − 19.5%)",
      tag:"пасивний дохід", dark:false,
    },
  ];

  return (
    <main style={{ color:D, maxWidth:1100, margin:"0 auto", padding:"0 20px 60px" }}>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ padding:"56px 0 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
        <div>
          <div style={{ display:"inline-block", padding:"3px 12px", borderRadius:20, background:GL, color:G, fontSize:11, fontWeight:700, marginBottom:16, letterSpacing:".05em" }}>
            ПОРІВНЯННЯ ІНВЕСТИЦІЙ · УКРАЇНА{updatedDate ? ` · ${updatedDate}` : " · 2026"}
          </div>
          <h1 style={{ fontSize:"clamp(28px,4vw,38px)", fontWeight:700, lineHeight:1.18, letterSpacing:"-.6px", margin:"0 0 16px" }}>
            Де краще<br/>тримати гроші<br/><span style={{ color:G }}>в Україні?</span>
          </h1>
          <p style={{ fontSize:15, color:GR, lineHeight:1.75, margin:"0 0 28px", maxWidth:440 }}>
            Порівнюємо депозити, ОВДП, ETF та НПФ. Показуємо реальну дохідність після 19.5% податку — у гривні та євро.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link href="/kalkulator" style={{ padding:"12px 22px", background:G, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>
              Зібрати портфель →
            </Link>
            <Link href="/depozyty" style={{ padding:"12px 22px", border:`1.5px solid ${B}`, color:D, borderRadius:10, fontSize:14, fontWeight:600, textDecoration:"none", background:"white" }}>
              Порівняти все
            </Link>
          </div>
        </div>

        {/* ── Динамічна картка топ ставок ─────────────────────────────── */}
        <div style={{ background:`linear-gradient(135deg,${D} 0%,#2A4A44 100%)`, borderRadius:20, padding:28, color:"white" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9FE1CB", letterSpacing:".08em", marginBottom:18 }}>
            ТОП СТАВКИ ЗАРАЗ
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              {
                name: topDepoUah ? `${topDepoUah.name} — депозит` : "Юнекс Банк — депозит",
                sub:  "₴ UAH · 12 місяців · ФГВФО",
                rate: topDepoUah ? `${topDepoUah.rate_12m}%` : "17%",
                net:  topDepoUah ? `${net(topDepoUah.rate_12m)}% після податків` : "13.7% після податків",
                rateColor: A,
              },
              {
                name: "ОВДП UAH",
                sub:  "₴ UAH · 12 місяців · Держава",
                rate: topOvdpUah ? `${topOvdpUah.rate}%` : "16%",
                net:  topOvdpUah ? `${net(topOvdpUah.rate, 0.015)}% після 1.5% збору ⚡` : "15.76% після 1.5% збору ⚡",
                rateColor:"#9FE1CB",
              },
              {
                name: topEtf ? `${topEtf.ticker} — ${topEtf.name.split(" ").slice(0,2).join(" ")}` : "CSPX — S&P 500 ETF",
                sub:  "€ EUR · довгострокове",
                rate: topEtf ? `${topEtf.rate}%` : "9.5%",
                net:  topEtf ? `~${net(topEtf.rate)}% після податків` : "~7.65% після податків",
                rateColor:"#c0d4f0",
              },
            ].map(p => (
              <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"rgba(255,255,255,.07)", borderRadius:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.45)" }}>{p.sub}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:22, fontWeight:700, color:p.rateColor }}>{p.rate}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginTop:1 }}>{p.net}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, fontSize:11, color:"rgba(255,255,255,.35)", textAlign:"center" }}>
            {updatedDate ? `Ставки оновлено ${updatedDate}` : "Ставки оновлюються щомісяця"}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:B, border:`1px solid ${B}`, borderRadius:14, overflow:"hidden", marginBottom:48 }}>
        {[
          { val:"7",         lbl:"інструментів порівняно" },
          { val:"19.5%",     lbl:"реальний податок на депозити" },
          { val:"1.5%",      lbl:"податок на ОВДП (пільга)" },
          { val:"600 000 ₴", lbl:"гарантія ФГВФО на банк" },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{ background:"white", padding:"16px 20px" }}>
            <div style={{ fontSize:22, fontWeight:700, color:G, marginBottom:3 }}>{val}</div>
            <div style={{ fontSize:12, color:GR }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Instruments ───────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ІНСТРУМЕНТИ</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Всі способи зберегти та примножити</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:48 }}>
        {INSTRUMENTS.map(ins => {
          const r = RISK_STYLE[ins.risk];
          return (
            <Link key={ins.name} href={ins.href} style={{ border:`1.5px solid ${B}`, borderRadius:14, padding:18, background:"white", textDecoration:"none", color:D, display:"block" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:22 }}>{ins.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:r.bg, color:r.c }}>{RISK_LABEL[ins.risk]}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{ins.name}</div>
              <div style={{ fontSize:11, color:GR, marginBottom:12 }}>{ins.sub}</div>
              <div style={{ fontSize:26, fontWeight:700, color:G, lineHeight:1 }}>{ins.rate}</div>
              <div style={{ fontSize:11, color:GR, marginTop:2 }}>{ins.rateLbl}</div>
              {ins.badge && <div style={{ marginTop:10, fontSize:10, color:A, fontWeight:700 }}>{ins.badge}</div>}
            </Link>
          );
        })}

        {/* Альтернативні */}
        <Link href="/alternatyvni" style={{ border:`1.5px dashed ${B}`, borderRadius:14, padding:18, background:S, textDecoration:"none", color:GR, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div style={{ fontSize:22, marginBottom:8 }}>🌐</div>
          <div style={{ fontSize:13, fontWeight:700, color:D, marginBottom:4 }}>Альтернативні</div>
          <div style={{ fontSize:11 }}>Крипто, метали, сировина →</div>
        </Link>
      </div>

      {/* ── Top-3 ─────────────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ТОП-3</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Найвигідніше зараз після податків</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:48 }}>
        {top3.map(t => (
          <div key={t.name} style={{ borderRadius:14, padding:20, background:t.dark?D:S, border:t.dark?"none":`1.5px solid ${B}`, color:t.dark?"white":D }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:".08em", marginBottom:10, opacity:.6 }}>{t.pos}</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{t.name}</div>
            <div style={{ fontSize:12, opacity:.55, marginBottom:14 }}>{t.sub}</div>
            <div style={{ fontSize:32, fontWeight:700, color:t.dark?A:G, lineHeight:1 }}>{t.rate}</div>
            <div style={{ fontSize:12, marginTop:4, opacity:.5 }}>{t.note}</div>
            <div style={{ display:"inline-block", marginTop:14, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:t.dark?"rgba(255,255,255,.1)":GL, color:t.dark?"rgba(255,255,255,.6)":G }}>
              {t.tag}
            </div>
          </div>
        ))}
      </div>

      {/* ── Why ───────────────────────────────────────────────────────── */}
      <div style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", marginBottom:8 }}>ЧОМУ PORAHOVANO</div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 20px" }}>Ми рахуємо те, що інші приховують</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:48 }}>
        {WHY.map(w => (
          <div key={w.title} style={{ padding:20, borderRadius:14, background:S, border:`1px solid ${B}` }}>
            <div style={{ fontSize:24, marginBottom:10 }}>{w.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>{w.title}</div>
            <div style={{ fontSize:13, color:GR, lineHeight:1.65 }}>{w.text}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div style={{ background:D, borderRadius:20, padding:"40px", display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:"white", marginBottom:8 }}>Скільки накопичиш за 10 років?</div>
          <div style={{ fontSize:14, color:"#9FE1CB", lineHeight:1.65 }}>
            Зберіть власний портфель у «Мій капітал» — депозити, ОВДП, ETF разом.<br/>
            Побачиш дохід, графік зростання і суму щомісячної виплати.
          </div>
        </div>
        <Link href="/kalkulator" style={{ padding:"14px 28px", background:A, color:D, borderRadius:12, fontSize:14, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}>
          Відкрити «Мій капітал» →
        </Link>
      </div>

    </main>
  );
}
