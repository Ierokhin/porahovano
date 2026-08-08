// /lib/instruments.js
// Єдине джерело правди для портфеля "Мій капітал".
//
// Раніше кожна сторінка (депозити/ОВДП/НПФ/ETF/альтернативні) сама формувала
// productId, назву й податок при кліку "+ Капітал", а калькулятор /kalkulator
// генерував свій ОКРЕМИЙ каталог з іншими id — тому кнопка "додати" нічого не
// додавала (калькулятор навіть не читав localStorage), а там де додавалось —
// назви/id/податки розходились. Тепер і сторінки-інструменти, і калькулятор
// імпортують ці самі функції/константи, тому productId і назва завжди
// однакові, а порівняно з тим що бачить користувач на сторінці інструменту.

export const PORTFOLIO_KEY = "porahovano_portfolio";

export const PALETTE = [
  "#0F6E56", "#1A8C6E", "#3BAD8A", "#EF9F27", "#D4891E",
  "#3B82C4", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
];

// Податкові ставки — узгоджені по всьому сайту (23% = 18% ПДФО + 5% військовий збір).
export const TAX = {
  deposit: 0.23,
  npf: 0,
  etf: 0.23,        // раніше /etf писав у портфель 0.195, хоча сама сторінка показує "-23%" — виправлено
  alternative: 0.23, // крипто, стейкінг, стейблкоїни, нерухомість, метали/сировина
};

// ─── Стабільні productId для кожного інструменту ──────────────────────────
// Той самий інструмент завжди дає той самий id незалежно від того, де саме
// натиснули "+ Капітал" — на сторінці інструменту чи всередині калькулятора.
export const ID = {
  deposit: (bankId, cur) => (cur === "eur" ? `deposit_${bankId}_eur` : `deposit_${bankId}`),
  ovdp: (cur, months) => `ovdp_${cur}_${months}`,
  npf: (fundId) => `npf_${fundId}`,
  etf: (etfId) => `etf_${etfId}`,
  crypto: (coinId) => `crypto_${coinId}`,
  staking: (id) => `staking_${id}`,
  stablecoin: (id) => `stablecoin_${id}`,
  realty: (id) => `realty_${id}`,
  commodity: (id) => `commodity_${id}`,
};

// ─── Каталоги для крипто/стейкінгу/стейблкоїнів ───────────────────────────
// Раніше жили тільки всередині /alternatyvni/page.jsx — винесено сюди, щоб
// калькулятор показував ту саму точну назву й перелік у вкладці "Альтернативні".
export const COINS = [
  { id: "bitcoin", sym: "BTC", name: "Bitcoin", color: "#F7931A", icon: "₿" },
  { id: "ethereum", sym: "ETH", name: "Ethereum", color: "#627EEA", icon: "Ξ" },
  { id: "solana", sym: "SOL", name: "Solana", color: "#9945FF", icon: "◎" },
  { id: "binancecoin", sym: "BNB", name: "BNB", color: "#F3BA2F", icon: "B" },
  { id: "avalanche-2", sym: "AVAX", name: "Avalanche", color: "#E84142", icon: "A" },
  { id: "cardano", sym: "ADA", name: "Cardano", color: "#0033AD", icon: "₳" },
  { id: "polkadot", sym: "DOT", name: "Polkadot", color: "#E6007A", icon: "●" },
  { id: "chainlink", sym: "LINK", name: "Chainlink", color: "#2A5ADA", icon: "⬡" },
];

export const STAKING = [
  { id: "s1", sym: "ETH", name: "Ethereum (ETH)", sub: "Liquid staking · Lido", rate: 4, platform: "Lido / Coinbase" },
  { id: "s2", sym: "SOL", name: "Solana (SOL)", sub: "Native staking · Phantom", rate: 7, platform: "Phantom / Binance" },
  { id: "s3", sym: "ATOM", name: "Cosmos (ATOM)", sub: "Native staking · Keplr", rate: 15, platform: "Keplr wallet" },
  { id: "s4", sym: "ADA", name: "Cardano (ADA)", sub: "Delegation · Daedalus", rate: 4, platform: "Daedalus / Eternl" },
  { id: "s5", sym: "BNB", name: "BNB (Binance)", sub: "Simple Earn · Binance", rate: 2, platform: "Binance Earn" },
];

export const STABLECOINS = [
  { id: "st1", name: "USDC · Coinbase", sub: "USD Coin · регульований · аудитований", rate: 4.5, display: "4.5%", risk: "mid" },
  { id: "st2", name: "USDT · Binance Earn", sub: "Tether · найбільший стейблкоїн", rate: 5, display: "5%", risk: "mid" },
  { id: "st3", name: "USDC · Aave DeFi", sub: "Децентралізований протокол позик", rate: 6, display: "4–8%", risk: "high" },
  { id: "st4", name: "DAI · Maker DSR", sub: "Decentralized stablecoin · MakerDAO", rate: 6, display: "6%", risk: "high" },
];

// ─── localStorage helpers ──────────────────────────────────────────────────
export function readPortfolio() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writePortfolio(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("porahovano:portfolio-updated"));
  } catch {}
}

export function isInPortfolio(productId) {
  return readPortfolio().some((p) => p.productId === productId);
}

// Додає продукт (з buildXProducts) у портфель, якщо його там ще нема.
// Повертає { ok, duplicate?, item? }.
export function addToPortfolio(product, overrides = {}) {
  if (typeof window === "undefined") return { ok: false };
  const prev = readPortfolio();
  if (prev.some((p) => p.productId === product.productId)) {
    return { ok: false, duplicate: true };
  }
  const item = {
    id: Date.now(),
    productId: product.productId,
    name: product.name,
    sub: product.sub,
    rate: product.rate,
    cur: product.cur,
    tax: product.tax,
    risk: product.risk,
    gtee: product.gtee,
    star: !!product.star,
    bonus: !!product.bonus,
    color: product.color || PALETTE[prev.length % PALETTE.length],
    lump: 0,
    monthly: product.cur === "uah" ? 3000 : 100,
    ...overrides,
  };
  writePortfolio([...prev, item]);
  return { ok: true, item };
}

// ─── Product builders — одна функція на категорію ─────────────────────────
// Всі беруть той самий /public/data/rates.json (+ live дохідність де потрібно),
// що й відповідна сторінка-інструмент, тому назви й ставки завжди збігаються.

export function buildDepositProducts(rates) {
  const mapBanks = (list, cur) =>
    (list ?? [])
      .filter((b) => b.rate_12m !== null)
      .sort((a, b) => b.rate_12m - a.rate_12m)
      .map((b) => ({
        productId: ID.deposit(b.id, cur),
        bankId: b.id,
        name: cur === "eur" ? `${b.name} EUR` : b.name,
        sub: `${cur.toUpperCase()} · 12 міс.`,
        rate: b.rate_12m,
        cur,
        tax: TAX.deposit,
        risk: "low",
        gtee: "ФГВФО",
      }));
  return [...mapBanks(rates?.depozyty?.uah, "uah"), ...mapBanks(rates?.depozyty?.eur, "eur")];
}

export function buildOvdpProducts(rates) {
  const tax = rates?.ovdp?.tax ?? 0.015;
  const mapRows = (rows, cur) =>
    (rows ?? [])
      .filter((r) => r.months === 12)
      .map((r) => ({
        productId: ID.ovdp(cur, r.months),
        name: `ОВДП ${cur.toUpperCase()}`,
        sub: `${cur.toUpperCase()} · ${r.term}`,
        rate: r.rate,
        cur,
        tax,
        risk: "low",
        gtee: "Держава",
        star: true,
      }));
  return [...mapRows(rates?.ovdp?.uah, "uah"), ...mapRows(rates?.ovdp?.eur, "eur")];
}

export function buildNpfProducts(rates) {
  return (rates?.npf?.funds ?? []).map((f) => ({
    productId: ID.npf(f.id),
    name: f.name,
    sub: "UAH · пенсійний фонд",
    rate: f.rate,
    cur: "uah",
    tax: TAX.npf,
    risk: "mid",
    gtee: "Немає",
    bonus: true,
  }));
}

export function buildEtfProducts(rates, etfReturns = {}) {
  return (rates?.etf ?? [])
    .map((e) => {
      const live = etfReturns?.[e.id];
      const rate = live?.ok ? live.returnPct : null;
      if (rate === null || rate === undefined) return null;
      return {
        productId: ID.etf(e.id),
        name: e.ticker,
        sub: `${e.name} · EUR · LSE`,
        rate,
        cur: "eur",
        tax: TAX.etf,
        risk: rate >= 12 ? "high" : rate >= 7 ? "mid" : "low",
        gtee: "SIPC",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.rate - a.rate);
}

export function buildCryptoProducts(cryptoReturns = {}) {
  return COINS.map((c) => {
    const r = cryptoReturns?.[c.id];
    if (!r?.ok) return null;
    return {
      productId: ID.crypto(c.id),
      name: c.name,
      sub: `${c.sym} · крипто`,
      rate: r.returnPct,
      cur: "eur",
      tax: TAX.alternative,
      risk: "high",
      gtee: "Немає",
      color: c.color,
    };
  })
    .filter(Boolean)
    .sort((a, b) => b.rate - a.rate);
}

export function buildStakingProducts() {
  return STAKING.map((s) => ({
    productId: ID.staking(s.id),
    name: s.name,
    sub: s.sub,
    rate: s.rate,
    cur: "eur",
    tax: TAX.alternative,
    risk: "mid",
    gtee: "Немає",
  }));
}

export function buildStablecoinProducts() {
  return STABLECOINS.map((s) => ({
    productId: ID.stablecoin(s.id),
    name: s.name,
    sub: s.sub,
    rate: s.rate,
    cur: "eur",
    tax: TAX.alternative,
    risk: s.risk,
    gtee: "Немає",
  }));
}

export function buildRealtyProducts(rates) {
  return (rates?.realty_ua ?? []).map((r) => ({
    productId: ID.realty(r.id),
    name: r.name,
    sub: "UAH · готель під управлінням",
    rate: r.rate,
    cur: "uah",
    tax: TAX.alternative,
    risk: "mid",
    gtee: "Немає",
  }));
}

export function buildCommodityProducts(rates, etfReturns = {}) {
  return (rates?.commodities ?? [])
    .map((c) => {
      const live = etfReturns?.[c.id];
      const rate = live?.ok ? live.returnPct : null;
      if (rate === null || rate === undefined) return null;
      const icon = c.sector === "metals" ? "🥇" : "🛢";
      return {
        productId: ID.commodity(c.id),
        name: `${icon} ${c.ticker}`,
        sub: c.sub ?? `${c.name} · EUR · LSE`,
        rate,
        cur: "eur",
        tax: TAX.alternative,
        risk: c.risk ?? "mid",
        gtee: "IBKR",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.rate - a.rate);
}

// Все, що на сторінці /alternatyvni: крипто + стейкінг + стейблкоїни + нерухомість + метали/сировина
export function buildAlternativeProducts(rates, etfReturns = {}, cryptoReturns = {}) {
  return [
    ...buildCryptoProducts(cryptoReturns),
    ...buildStakingProducts(),
    ...buildStablecoinProducts(),
    ...buildRealtyProducts(rates),
    ...buildCommodityProducts(rates, etfReturns),
  ];
}

// 5 категорій — рівно ті самі назви й порядок, що в Header.NAV_MAIN
export function buildAllCategories(rates, etfReturns = {}, cryptoReturns = {}) {
  if (!rates) return [];
  return [
    { id: "deposit", name: "Депозити", icon: "🏦", products: buildDepositProducts(rates) },
    { id: "ovdp", name: "ОВДП", icon: "📜", products: buildOvdpProducts(rates) },
    { id: "npf", name: "НПФ", icon: "🏛", products: buildNpfProducts(rates) },
    { id: "etf", name: "ETF", icon: "📈", products: buildEtfProducts(rates, etfReturns) },
    { id: "alternative", name: "Альтернативні", icon: "🧩", products: buildAlternativeProducts(rates, etfReturns, cryptoReturns) },
  ];
}
