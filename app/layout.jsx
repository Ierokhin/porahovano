// porahovano.in.ua — root layout
// /app/layout.jsx

import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── Google Analytics ─────────────────────────────────────────────────────────
// Заміни G-Y72ZS8EHT1 на свій GA4 Measurement ID з analytics.google.com
const GA_ID = "G-Y72ZS8EHT1";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://porahovano.in.ua"),
  title: {
    default: "Porahovano — порівняння інвестицій для українців",
    template: "%s · Porahovano",
  },
  description:
    "Порівнюємо депозити, ОВДП, НПФ та ETF. Показуємо реальну дохідність після 19.5% податку — у гривні і євро. Збирай власний інвестиційний портфель.",
  keywords: [
    "депозити Україна",
    "ОВДП купити",
    "НПФ рейтинг",
    "ETF з України",
    "інвестиції Україна",
    "Пораховано",
    "порівняння депозитів",
    "де краще тримати гроші",
  ],
  authors: [{ name: "Porahovano", url: "https://porahovano.in.ua" }],
  creator: "Porahovano",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://porahovano.in.ua",
    siteName: "Porahovano",
    title: "Porahovano — порівняння інвестицій для українців",
    description:
      "Депозити, ОВДП, НПФ, ETF — все в одному місці. Реальна дохідність після 19.5% податку.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Porahovano — інвестиційне порівняння",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Porahovano — порівняння інвестицій для українців",
    description: "Депозити, ОВДП, НПФ, ETF. Реальна дохідність після 19.5% податку.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: "https://porahovano.in.ua",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={manrope.variable}>
      <body>

        {/* ── Google Analytics ────────────────────────────────────────────── */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>

        {/* ── Сайт у розробці ── */}
        <div style={{
          background: "#1A2E2A",
          color: "#FFFFFF",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.5,
        }}>
          🚧 Сайт у розробці — ставки та дані можуть бути неточними. Перевіряйте умови на сайті банку/брокера перед рішенням.
        </div>

        <Header />
        <main>{children}</main>
        <Footer />

      </body>
    </html>
  );
}
