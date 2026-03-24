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

// מיפוי שאילתות חיפוש לכל קטגוריה כדי להבטיח גיוון
const CATEGORY_QUERIES: Record<string, string> = {
  "World Economics": '("World Economics" OR "Global Markets" OR "Stock Market" OR "Inflation")',
  "AI Developments": '("Artificial Intelligence" OR "OpenAI" OR "Machine Learning" OR "LLM")',
  "Engineering Innovations": '("Engineering Innovation" OR "SpaceX" OR "Robotics" OR "Future Tech")',
  "Global Politics & Israel": '("Global Politics" OR "Israel" OR "Middle East" OR "Geopolitics")'
};

const fetchArticles = async () => {
  // יצירת מערך של בקשות fetch - אחת לכל קטגוריה
  const promises = CATEGORIES.map(async (category) => {
    const query = CATEGORY_QUERIES[category];
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`GNews API Error for ${category}:`, errorData);
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
      console.error(`Network Error fetching ${category}:`, error);
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

  // פתרון לשגיאת Hydration (418): מוודא שהקומפוננטה תרונדר רק בצד הלקוח
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 60, // שמירה בזיכרון לשעה
    enabled: mounted, // יתחיל להריץ רק אחרי שהדף נטען
  });

  const handleRefreshNews = async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ["articles"] });
      toast.success("הסקירה עודכנה מכל המקורות!");
    } catch (e: any) {
      toast.error("שגיאה ברענון: " + (e.message || "נסה שוב"));
    } finally {
      setRefreshing(false);
    }
  };

  // אם הדף עדיין לא נטען בדפדפן, נחזיר דף ריק כדי למנוע התנגשות עם Vercel
  if (!mounted) return null;

  // חלוקת הכתבות לקבוצות לפי הקטגוריה
  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category] = (articles || [])
      .filter((a: any) => a.category === category)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <div className="max-w-2xl mx-auto px-5">
        <DailyHeader />

        <div className="flex justify-center mb-8">
          <button
            onClick={handleRefreshNews}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "מעדכן את כל הנושאים..." : "רענן סקירה יומית"}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-muted-foreground animate-pulse">
              אוסף כתבות מכל הקטגוריות...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-destructive">
              חלה שגיאה בטעינת הנתונים. וודא שמפתח ה-API תקין.
            </p>
          </div>
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
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm">לא נמצאו כתבות חדשות. נסה שוב מאוחר יותר.</p>
              </div>
            )}
          </div>
        )}

        <footer className="border-t mt-6 opacity-20" />
        <p className="text-center font-sans text-[10px] text-muted-foreground py-6 uppercase tracking-widest">
          Personal Daily Briefing • Multi-Source Feed
        </p>
      </div>

      <DevSettingsPanel />
    </div>
  );
};

export default Index;