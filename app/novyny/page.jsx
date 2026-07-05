// porahovano.in.ua/novyny — /app/novyny/page.jsx
// Читає статті з Notion API (Published = true)
// Database ID: 393064d5-8038-80d9-a408-da2a5df4b18d

const T = {
  green:"#0F6E56", greenLt:"#E1F5EE",
  amber:"#EF9F27", dark:"#1A2E2A", gray:"#73726C",
  grayLt:"#F5FAF8", border:"#E5E5E0",
};

const CAT_STYLE = {
  "Депозити":    { bg:"#EFF6FF", c:"#2563EB", icon:"🏦" },
  "ОВДП":        { bg:T.greenLt, c:T.green,   icon:"📜" },
  "Ринок":       { bg:"#FFF8EC", c:"#D4891E", icon:"📊" },
  "ETF":         { bg:"#F0FDF4", c:"#16A34A", icon:"📈" },
  "Крипто":      { bg:"#F3E8FF", c:"#7C3AED", icon:"⛓" },
  "Нерухомість": { bg:"#FEF2F2", c:"#C0392B", icon:"🏨" },
  "Золото":      { bg:"#FFF8EC", c:"#D4891E", icon:"🥇" },
};
const DEFAULT_CAT = { bg:T.grayLt, c:T.gray, icon:"📰" };

const NOTION_DB_ID  = "393064d5-8038-80d9-a408-da2a5df4b18d";
const NOTION_TOKEN  = process.env.NOTION_TOKEN; // додай в Vercel env vars

// ─── Fetch articles from Notion ───────────────────────────────────────────────
async function getArticles() {
  if (!NOTION_TOKEN) return [];
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type":   "application/json",
      },
      body: JSON.stringify({
        filter: { property:"Published", checkbox:{ equals:true } },
        sorts:  [{ property:"Date", direction:"descending" }],
        page_size: 20,
      }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map(page => ({
      id:       page.id,
      title:    page.properties?.Name?.title?.[0]?.plain_text ?? "",
      excerpt:  page.properties?.Excerpt?.rich_text?.[0]?.plain_text ?? "",
      content:  page.properties?.Content?.rich_text?.[0]?.plain_text ?? "",
      category: page.properties?.Category?.select?.name ?? "Ринок",
      date:     page.properties?.Date?.date?.start ?? "",
    })).filter(a => a.title);
  } catch (e) {
    console.error("Notion fetch error:", e);
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("uk-UA", { day:"numeric", month:"long", year:"numeric" });
}

// ─── Article card (server component — розкривається через details/summary) ───
function ArticleCard({ article, featured }) {
  const cat = CAT_STYLE[article.category] ?? DEFAULT_CAT;
  return (
    <details style={{ border:`1.5px solid ${featured ? T.green : T.border}`, borderRadius:14, overflow:"hidden", background: featured ? T.greenLt : "white" }}>
      <summary style={{ listStyle:"none", cursor:"pointer", padding:"16px 18px", display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:cat.bg, color:cat.c }}>
            {cat.icon} {article.category}
          </span>
          {article.date && (
            <span style={{ fontSize:11, color:T.gray }}>{formatDate(article.date)}</span>
          )}
          {featured && (
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:T.green, color:"white" }}>Нова</span>
          )}
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:T.dark, lineHeight:1.3 }}>{article.title}</div>
        <div style={{ fontSize:13, color:T.gray, lineHeight:1.65 }}>{article.excerpt}</div>
        <div style={{ fontSize:12, color:T.green, fontWeight:600, marginTop:2 }}>Читати повністю ↓</div>
      </summary>
      <div style={{ padding:"0 18px 18px", fontSize:14, color:T.gray, lineHeight:1.8, whiteSpace:"pre-wrap", borderTop:`1px solid ${T.border}`, marginTop:0, paddingTop:16 }}>
        {article.content}
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const revalidate = 300; // ISR — оновлення кожні 5 хв (no-store в fetch забезпечує свіжість даних)

export const metadata = {
  title: "Новини · Porahovano",
  description: "Актуальні зміни ставок депозитів, ОВДП та ринкові новини для інвесторів в Україні.",
};

export default async function NovynyPage() {
  const articles = await getArticles();
  const hasArticles = articles.length > 0;

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
      <p style={{ fontSize:14, color:T.gray, lineHeight:1.7, margin:"0 0 28px" }}>
        Актуальні фінансові новини для українських інвесторів. Оновлюється щодня.
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
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>Щоденні огляди ринку · @porahovano</div>
        </div>
        <a href="https://t.me/porahovano" target="_blank" rel="noopener noreferrer"
          style={{ padding:"9px 18px", background:T.amber, color:T.dark, borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
          Підписатись →
        </a>
      </div>

      {/* Articles */}
      {hasArticles ? (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} featured={i === 0} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div style={{ textAlign:"center", padding:"60px 20px", border:`2px dashed ${T.border}`, borderRadius:20, background:T.grayLt }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📰</div>
          <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10, color:T.dark }}>
            Новини з'являться незабаром
          </h2>
          <p style={{ fontSize:14, color:T.gray, lineHeight:1.75, maxWidth:420, margin:"0 auto 24px" }}>
            Ми готуємо регулярні огляди ставок депозитів, новини ОВДП та ринкову аналітику. Підпишись на Telegram щоб не пропустити перші публікації.
          </p>
          <a href="https://t.me/porahovano" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-block", padding:"11px 24px", background:T.green, color:"white", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none" }}>
            Підписатись на @porahovano →
          </a>
        </div>
      )}

    </main>
  );
}
