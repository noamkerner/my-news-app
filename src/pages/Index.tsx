import { useQuery, useQueryClient } from "@tanstack/react-query";
import DailyHeader from "@/components/DailyHeader";
import CategorySection from "@/components/CategorySection";
import DevSettingsPanel from "@/components/DevSettingsPanel";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// --- הגדרות ---
const API_KEY = "319f27d0deb3a90409d0751b4b312819"; 

const CATEGORIES = [
  "World Economics",
  "AI Developments",
  "Engineering Innovations",
  "Global Politics & Israel",
];

const CATEGORY_QUERIES: Record<string, string> = {
  "World Economics": '("World Economics" OR "Global Markets" OR "Stock Market" OR "Inflation")',
  "AI Developments": '("Artificial Intelligence" OR "OpenAI" OR "Machine Learning" OR "LLM")',
  "Engineering Innovations": '("Engineering Innovation" OR "SpaceX" OR "Robotics" OR "Future Tech")',
  "Global Politics & Israel": '("Global Politics" OR "Israel" OR "Middle East" OR "Geopolitics")'
};

const fetchArticles = async () => {
  const promises = CATEGORIES.map(async (category) => {
    const query = CATEGORY_QUERIES[category];
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`GNews API Error:`, errorData);
        return [];
      }
      const data = await response.json();
      return (data.articles || []).map((article: any, index: number) => ({
        id: article.url + category + index,
        title: article.title,
        summary: article.description,
        date: article.publishedAt,
        category: category, 
        original_url: article.url,
        image: article.image
      }));
    } catch (error) {
      return [];
    }
  });

  const allResults = await Promise.all(promises);
  return allResults.flat(); 
};

const Index = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 60,
    enabled: mounted,
  });

  const handleRefreshNews = async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ["articles"] });
      toast.success("הסקירה עודכנה!");
    } catch (e: any) {
      toast.error("שגיאה ברענון");
    } finally {
      setRefreshing(false);
    }
  };

  if (!mounted) return null;

  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category] = (articles || [])
      .filter((a: any) => a.category === category)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <div className="max-w-2xl mx-auto px-5">
        {/* בדיקת סנכרון - אם אתה רואה את זה באדום באתר, הסנכרון עובד! */}
        <div className="py-2 text-center bg-red-100 text-red-600 font-bold text-xs mb-4 rounded">
          בדיקת סנכרון פעילה - גרסה מעודכנת
        </div>

        <DailyHeader />

        <div className="flex justify-center mb-8">
          <button
            onClick={handleRefreshNews}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "מעדכן..." : "רענן סקירה יומית"}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20 animate-pulse text-muted-foreground">אוסף כתבות...</div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">חלה שגיאה בטעינה.</div>
        )}

        {!isLoading && !error && (
          <div className="space-y-12 mb-12">
            {CATEGORIES.map((category) => (
              <CategorySection
                key={category}
                category={category}
                articles={articlesByCategory[category] || []}
              />
            ))}
            {(articles?.length === 0) && (
              <div className="text-center py-20 text-muted-foreground text-sm">לא נמצאו כתבות.</div>
            )}
          </div>
        )}

        <footer className="border-t mt-6 opacity-20" />
        <p className="text-center font-sans text-[10px] text-muted-foreground py-6 uppercase tracking-widest">
          Personal Daily Briefing
        </p>
      </div>
      <DevSettingsPanel />
    </div>
  );
};

export default Index;