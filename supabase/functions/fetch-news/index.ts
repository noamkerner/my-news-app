import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = [
  { key: "World Economics", query: "world economy OR global economy OR macroeconomics" },
  { key: "AI Developments", query: "artificial intelligence OR AI model OR machine learning" },
  { key: "Engineering Innovations", query: "engineering breakthrough OR technology innovation OR biotech" },
  { key: "Global Politics & Israel", query: "global politics Israel OR geopolitics Israel OR diplomacy Israel" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NEWSAPI_KEY = Deno.env.get("NEWSAPI_KEY");
    if (!NEWSAPI_KEY) throw new Error("NEWSAPI_KEY not configured");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const allArticles: any[] = [];

    for (const cat of CATEGORIES) {
      // Fetch real news from NewsAPI
      const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(cat.query)}&from=${yesterday}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${NEWSAPI_KEY}`;
      
      const newsResp = await fetch(newsUrl);
      if (!newsResp.ok) {
        console.error(`NewsAPI error for ${cat.key}:`, newsResp.status, await newsResp.text());
        continue;
      }

      const newsData = await newsResp.json();
      const rawArticles = newsData.articles || [];

      if (rawArticles.length === 0) {
        console.log(`No articles found for ${cat.key}`);
        continue;
      }

      // Build a prompt with real article data for Gemini to translate & summarize
      const articlesList = rawArticles
        .slice(0, 5)
        .map((a: any, i: number) => `${i + 1}. Title: ${a.title}\nDescription: ${a.description || "N/A"}\nURL: ${a.url}`)
        .join("\n\n");

      const prompt = `אתה עיתונאי מקצועי. להלן ${Math.min(rawArticles.length, 5)} כתבות באנגלית בנושא "${cat.key}".

${articlesList}

עבור כל כתבה, החזר אובייקט JSON עם:
- title: תרגום הכותרת לעברית (קצר ומדויק)
- summary: תקציר בדיוק ב-3 משפטים בעברית
- relevance_score: ציון רלוונטיות 1-10
- impact_on_israel: משפט אחד בעברית על ההשפעה על ישראל
- original_url: הקישור המקורי של הכתבה

החזר מערך JSON בלבד, ללא טקסט נוסף.`;

      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI error for ${cat.key}:`, aiResponse.status, errText);
        continue;
      }

      const aiData = await aiResponse.json();
      let content = aiData.choices?.[0]?.message?.content || "";
      content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

      let articles: any[];
      try {
        articles = JSON.parse(content);
      } catch {
        console.error(`Failed to parse AI response for ${cat.key}:`, content);
        continue;
      }

      for (const a of articles) {
        allArticles.push({
          title: a.title,
          summary: a.summary,
          category: cat.key,
          relevance_score: Math.min(10, Math.max(1, parseInt(a.relevance_score) || 5)),
          impact_on_israel: a.impact_on_israel || null,
          original_url: a.original_url || null,
          date: today,
        });
      }
    }

    if (allArticles.length > 0) {
      const { error: insertError } = await supabase
        .from("articles")
        .insert(allArticles);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`Failed to insert articles: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: allArticles.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
