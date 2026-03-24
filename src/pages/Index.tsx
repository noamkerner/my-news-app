import { useQuery, useQueryClient } from "@tanstack/react-query";
import DailyHeader from "@/components/DailyHeader";
import CategorySection from "@/components/CategorySection";
import DevSettingsPanel from "@/components/DevSettingsPanel";
import { RefreshCw, Beaker, Globe, TrendingUp, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

const fetchCategorizedRSS = async () => {
  const categories = {
    "בינה מלאכותית וחדשנות": [
      "https://news.google.com/rss/search?q=Artificial+Intelligence&hl=en-US&gl=US&ceid=US:en",
      "https://techcrunch.com/category/artificial-intelligence/feed/"
    ],
    "מדע וטכנולוגיה": [
      "https://www.wired.com/feed/rss",
      "https://www.technologyreview.com/feed/"
    ],
    "כלכלה ושווקים": [
      "https://www.cnbc.com/id/100003114/device/rss/rss.html"
    ],
    "חדשות מהעולם": [
      "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    ]
  };

  const results: Record<string, any[]> = {};

  for (const [categoryName, urls] of Object.entries(categories)) {
    let categoryArticles: any[] = [];
    for (const url of urls) {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.status === 'ok') {
          const mapped = data.items.map((item: any) => ({
            id: item.guid || item.link,
            title: item.title,
            summary: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 120) + "...",
            date: item.pubDate || item.date,
            source: data.feed.title?.split(' - ')[0] || "AI News",
            image: item.thumbnail || item.enclosure?.link || null,
            url: item.link
          }));
          categoryArticles = [...categoryArticles, ...mapped];
        }
      } catch (e) { console.error(`Failed: ${url}`); }
    }
    results[categoryName] = categoryArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }
  return results;
};

const Index = () => {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { data: categorizedData, isLoading } = useQuery({
    queryKey: ["categorized-rss-v4"], // שינוי מפתח כדי לרענן זיכרון
    queryFn: fetchCategorizedRSS,
    enabled: mounted,
    staleTime: 0, // רענון מיידי לצורך הבדיקה
  });

  if (!mounted) return null;

  const getIcon = (cat: string) => {
    if (cat === "בינה מלאכותית וחדשנות") return <Cpu className="w-5 h-5 text-purple-600" />;
    if (cat === "מדע וטכנולוגיה") return <Beaker className="w-5 h-5 text-blue-500" />;
    if (cat === "כלכלה ושווקים") return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <Globe className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-right pb-20" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-8"> {/* הגדלנו את המקסימום ל-1400px */}
        <DailyHeader />
        
        <div className="flex justify-center mb-12">
          <button 
            onClick={() => queryClient.refetchQueries({ queryKey: ["categorized-rss-v4"] })}
            className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-sm font-medium text-slate-600">רענן סקירה</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-24">
            {categorizedData && Object.entries(categorizedData).map(([category, articles]) => (
              articles.length > 0 && (
                <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                    {getIcon(category)}
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{category}</h2>
                  </div>
                  <CategorySection category={category} articles={articles} />
                </div>
              )
            ))}
          </div>
        )}
      </div>
      <DevSettingsPanel />
    </div>
  );
};

export default Index;