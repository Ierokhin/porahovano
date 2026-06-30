// /app/api/etf-returns/route.js
// Рахує реальну дохідність ETF + металів/сировини за 12 міс через Yahoo Finance
// Формула: (ціна сьогодні - ціна 12 міс тому) / ціна 12 міс тому × 100

import rates from "@/public/data/rates.json";

export const revalidate = 3600; // кеш на 1 годину

async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Yahoo fetch failed for ${symbol}`);
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const closes = result.indicators?.quote?.[0]?.close?.filter(c => c !== null);
  if (!closes || closes.length < 2) throw new Error(`Insufficient data for ${symbol}`);

  const priceNow = closes[closes.length - 1];
  const price1yAgo = closes[0];
  const returnPct = ((priceNow - price1yAgo) / price1yAgo) * 100;

  return { priceNow, price1yAgo, returnPct: +returnPct.toFixed(1) };
}

export async function GET() {
  const items = [...(rates.etf || []), ...(rates.commodities || [])];
  const results = {};

  await Promise.all(
    items.map(async (item) => {
      try {
        const data = await fetchYahoo(item.yahoo);
        results[item.id] = { ok: true, ...data };
      } catch (e) {
        results[item.id] = { ok: false, error: String(e.message || e) };
      }
    })
  );

  return Response.json({ updated: new Date().toISOString(), results });
}
