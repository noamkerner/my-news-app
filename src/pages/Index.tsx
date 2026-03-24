import { useQuery, useQueryClient } from "@tanstack/react-query";
import DailyHeader from "@/components/DailyHeader";
import CategorySection from "@/components/CategorySection";
import DevSettingsPanel from "@/components/DevSettingsPanel";
import { RefreshCw, Beaker, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const fetchCategorizedRSS = async () => {
  const categories = {
    "מדע וטכנולוגיה": [
      "https://www.wired.com/feed/rss",
      "https://www.technologyreview.com/feed/",
      "https://www.nasa.gov/news-release/feed/"
    ],
    "חדשות מהעולם": [
      "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    ]
  };

  const results: Record<string, any[]> = {};

  for (const [categoryName, urls] of Object.entries(categories)) {
    const categoryArticles: any[] = [];
    
    for (const url of urls) {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await res.json();
        
        if (data.status === 'ok') {
          data.items.forEach((item: any) => {
            categoryArticles.push({
              id: item.guid || item.link,
              title: item.title,
              summary: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...",
              date: item.pubDate,
              source: data.feed.title || categoryName,
              image: item.thumbnail || item.enclosure?.link || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
              url: item.link
            });
          });
        }
      } catch (e) {
        console.error(`Failed: ${url}`);
      }
    }
    // מיון לפי תאריך ולקיחת ה-10 הכי חדשים לכל קטגוריה
    results[categoryName] = categoryArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }

  return results;
};

const Index = () => {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { data: categorizedData, isLoading } = useQuery({
    queryKey: ["categorized-rss"],
    queryFn: fetchCategorizedRSS,
    enabled: mounted,
    staleTime: 1000 * 60 * 15, // 15 דקות
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-right" dir="rtl">
      <div className="max-w-2xl mx-auto px-5">
        <DailyHeader />

        <div className="flex justify-center mb-10">
          <button 
            onClick={() => queryClient.refetchQueries({ queryKey: ["categorized-rss"] })}
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-slate-700 font-medium">עדכן סקירה יומית</span>
          </button>
        </div>

        {isLoading && (
          <div className="space-y-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && categorizedData && (
          <div className="space-y-16 mb-20">
            {Object.entries(categorizedData).map(([category, articles]) => (
              <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                  {category === "מדע וטכנולוגיה" ? <Beaker className="w-5 h-5 text-blue-500" /> : <Globe className="w-5 h-5 text-green-500" />}
                  <h2 className="text-xl font-bold text-slate-800">{category}</h2>
                </div>
                <CategorySection category={category} articles={articles} />
              </div>
            ))}
          </div>
        )}

        <footer className="border-t border-slate-100 mt-12 py-10 text-center">
          <p className="font-serif italic text-slate-400 text-sm">הסקירה מבוססת על מקורות מידע גלובליים</p>
        </footer>
      </div>
      <DevSettingsPanel />
    </div>
  );
};

export default Index;