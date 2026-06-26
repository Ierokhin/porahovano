"use client";
// /components/Header.jsx

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_MAIN = [
  { href: "/depozyty",     label: "Депозити" },
  { href: "/ovdp",         label: "ОВДП" },
  { href: "/npf",          label: "НПФ" },
  { href: "/etf",          label: "ETF" },
  { href: "/alternatyvni", label: "Альтернативні" },
];

const G  = "#0F6E56";
const GL = "#E1F5EE";
const D  = "#1A2E2A";
const GR = "#73726C";
const B  = "#E5E5E0";

function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <circle cx="17" cy="17" r="14.5" fill="none" stroke={G} strokeWidth="2.5" />
      <text x="17" y="22.5" fontFamily="var(--font-manrope), Manrope, sans-serif"
        fontSize="16" fontWeight="700" fill={G} textAnchor="middle">P</text>
    </svg>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link href={href} style={{
      padding: "6px 11px", borderRadius: 8, fontSize: 14,
      fontWeight: active ? 600 : 400,
      color: active ? G : D,
      background: active ? GL : "transparent",
      textDecoration: "none", whiteSpace: "nowrap",
      transition: "background .12s, color .12s",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F5FAF8"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >{children}</Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [drawer,   setDrawer]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setDrawer(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const active = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(255,255,255,.97)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        borderBottom: `1px solid ${scrolled ? B : "transparent"}`,
        boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,.05)" : "none",
        transition: "border-color .2s, box-shadow .2s",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 20px",
          height: 60, display: "flex", alignItems: "center", gap: 4,
        }}>

          {/* Logo */}
          <Link href="/" aria-label="Porahovano — на головну" style={{
            display: "flex", alignItems: "center", gap: 8,
            marginRight: 20, textDecoration: "none", flexShrink: 0,
          }}>
            <Logo />
            <span style={{ fontSize: 16, fontWeight: 600, color: D, letterSpacing: "-.2px", lineHeight: 1 }}>
              orahovano
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Головна навігація"
            style={{ alignItems: "center", gap: 2, flex: 1 }}>
            {NAV_MAIN.map(({ href, label }) => (
              <NavLink key={href} href={href} active={active(href)}>{label}</NavLink>
            ))}
            <div aria-hidden="true" style={{ width: 1, height: 20, background: B, margin: "0 6px" }} />
            <NavLink href="/novyny" active={active("/novyny")}>Новини</NavLink>
          </nav>

          {/* CTA */}
          <Link href="/kalkulator" className="nav-desktop" style={{
            padding: "8px 16px", borderRadius: 8, background: G, color: "white",
            fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
            flexShrink: 0, transition: "opacity .15s", marginLeft: 8,
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >Мій капітал →</Link>

          {/* Hamburger */}
          <button className="nav-mobile-only" onClick={() => setDrawer(d => !d)}
            aria-label={drawer ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={drawer} aria-controls="mobile-nav"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 6, color: D, flexShrink: 0, marginLeft: "auto",
              alignItems: "center", justifyContent: "center",
            }}>
            {drawer ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="7"  x2="19" y2="7"/>
                <line x1="3" y1="12" x2="19" y2="12"/>
                <line x1="3" y1="17" x2="19" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div id="mobile-nav" role="dialog" aria-label="Мобільне меню" aria-modal="true"
          style={{
            position: "fixed", inset: "60px 0 0 0", zIndex: 199,
            background: "white", overflowY: "auto",
            padding: "8px 20px 40px", borderTop: `1px solid ${B}`,
          }}>
          {[...NAV_MAIN, { href: "/novyny", label: "Новини" }].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: "1px solid #F0F0F0",
              fontSize: 16, fontWeight: active(href) ? 600 : 400,
              color: active(href) ? G : D, textDecoration: "none",
            }}>
              {label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke={active(href) ? G : GR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
          <Link href="/kalkulator" style={{
            display: "block", marginTop: 20, padding: "14px", textAlign: "center",
            background: G, color: "white", borderRadius: 12,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
          }}>
            Мій капітал →
          </Link>
        </div>
      )}
    </>
  );
}
