// /components/Footer.jsx
// Server component — no "use client" needed

import Link from "next/link";

const G = "#0F6E56";
const D = "#1A2E2A";

const COLS = [
  {
    title: "Інструменти",
    links: [
      { href: "/depozyty",     label: "Депозити" },
      { href: "/ovdp",         label: "ОВДП" },
      { href: "/npf",          label: "НПФ" },
      { href: "/etf",          label: "ETF" },
      { href: "/alternatyvni", label: "Альтернативні" },
    ],
  },
  {
    title: "Сервіси",
    links: [
      { href: "/kalkulator",   label: "Мій капітал" },
      { href: "/novyny",       label: "Новини" },
    ],
  },
  {
    title: "Про проект",
    links: [
      { href: "/pro-nas",          label: "Про нас" },
      { href: "/pro-nas#afiliaty", label: "Афіліатна політика" },
    ],
  },
];

function FooterLink({ href, children }) {
  const isExternal = href.startsWith("http");
  return (
    <Link href={href} target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="footer-link">{children}</Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: D, color: "white", marginTop: "auto" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 28px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Porahovano — на головну"
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, textDecoration: "none" }}>
              <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
                <circle cx="15" cy="15" r="13" fill="none" stroke={G} strokeWidth="2" />
                <text x="15" y="20" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="700" fill={G} textAnchor="middle">P</text>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: "white", letterSpacing: "-.2px" }}>orahovano</span>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.7, maxWidth: 220, marginBottom: 20 }}>
              Порівнюємо інвестиційні інструменти для накопичення капіталу. Реальна дохідність після 19.5% податку.
            </p>
            <a href="https://t.me/porakhovano" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: G, textDecoration: "none", background: "rgba(15,110,86,.15)", padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(15,110,86,.3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21.8 2.2L1 9.5c-1.4.5-1.4 1.3-.2 1.7l5.1 1.6 1.9 5.9c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.3 1.8-.9l3.3-15.2c.3-1.4-.5-2-1.5-1.7z" fill={G}/>
              </svg>
              @porakhovano
            </a>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".09em", marginBottom: 14, textTransform: "uppercase" }}>
                {col.title}
              </div>
              {col.links.map(({ href, label }) => (
                <FooterLink key={href} href={href}>{label}</FooterLink>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.65, marginBottom: 24 }}>
          ⚠️ Ставки на сайті орієнтовні та оновлюються щомісяця. Перевіряйте актуальні умови на сайті банку або брокера перед прийняттям інвестиційного рішення. Сайт не надає фінансових консультацій.
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.08)", marginBottom: 20 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>
            © {new Date().getFullYear()} Porahovano · porahovano.in.ua
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", maxWidth: 480, textAlign: "right", lineHeight: 1.6 }}>
            Сайт містить афіліатні посилання — ми можемо отримувати комісію при відкритті рахунку через наші посилання. Це не впливає на наші рекомендації.{" "}
            <Link href="/pro-nas#afiliaty" style={{ color: "rgba(159,225,203,.7)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Детальніше</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
