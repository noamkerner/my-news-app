import { useQuery, useQueryClient } from "@tanstack/react-query";
import DailyHeader from "@/components/DailyHeader";
import CategorySection from "@/components/CategorySection";
import DevSettingsPanel from "@/components/DevSettingsPanel";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// --- הגדרות מפתחות ---
const GNEWS_KEY = "319f27d0deb3a90409d0751b4b312819";
const NEWSAPI_KEY = "db52e83952124ba4846a12984c02aa76"; 

const fetchAllSources = async () => {
  const articles: any[] = [];

  // מקור 1: GNews
  try {
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=10&apikey=${GNEWS_KEY}`);
    const data = await res.json();
    if (res.ok) {
      data.articles.forEach((a: any) => articles.push({
        id: a.url,
        title: a.title,
        summary: a.description,
        date: a.publishedAt,
        source: "GNews",
        image: a.image,
        url: a.url
      }));
    }
  } catch (e) { console.error("GNews failed"); }

  // מקור 2: NewsAPI (גיבוי חזק)
  try {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey=${NEWSAPI_KEY}`);
    const data = await res.json();
    if (res.ok) {
      data.articles.forEach((a: any) => articles.push({
        id: a.url,
        title: a.title,
        summary: a.description,
        date: a.publishedAt,
        source: a.source.name,
        image: a.urlToImage,
        url: a.url
      }));
    }
  } catch (e) { console.error("NewsAPI failed"); }

  // הסרת כפילויות לפי כתובת ה-URL
  const uniqueArticles = Array.from(new Map(articles.map(item => [item.url, item])).values());
  
  // מיון לפי תאריך (החדש ביותר למעלה)
  return uniqueArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const Index = () => {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchAllSources,
    enabled: mounted,
    staleTime: 1000 * 60 * 30, // חצי שעה בזיכרון
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <div className="max-w-2xl mx-auto px-5">
        <DailyHeader />

        <div className="flex justify-center mb-8">
          <button 
            onClick={() => queryClient.refetchQueries({ queryKey: ["articles"] })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-80 transition-all shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            עדכן מכל המקורות
          </button>
        </div>

        {isLoading && <div className="text-center py-20 animate-pulse text-muted-foreground">סורק מקורות חדשות עולמיים...</div>}

        {!isLoading && articles && articles.length > 0 && (
          <div className="space-y-10 mb-12">
            <CategorySection category="הסקירה המשולבת" articles={articles} />
          </div>
        )}

        {articles?.length === 0 && !isLoading && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">כל המקורות הגיעו למכסה היומית. נסה שוב מחר.</p>
          </div>
        )}

        <footer className="border-t mt-12 opacity-20" />
        <p className="text-center font-sans text-[10px] text-muted-foreground py-6 uppercase tracking-widest">
          Multi-Source Intelligence Feed
        </p>
      </div>
      <DevSettingsPanel />
    </div>
  );
};

export default Index;