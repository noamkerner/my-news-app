import { useQuery, useQueryClient } from "@tanstack/react-query";
import DailyHeader from "@/components/DailyHeader";
import CategorySection from "@/components/CategorySection";
import DevSettingsPanel from "@/components/DevSettingsPanel";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_KEY = "319f27d0deb3a90409d0751b4b312819"; 

const fetchArticles = async () => {
  const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=10&apikey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("GNews Error:", data.errors || data.message);
      throw new Error(data.message || "API Error");
    }

    return (data.articles || []).map((article: any, index: number) => ({
      id: article.url + index,
      title: article.title,
      summary: article.description,
      date: article.publishedAt,
      category: "Global News",
      original_url: article.url,
      image: article.image
    }));
  } catch (error) {
    console.error("Fetch failure:", error);
    throw error;
  }
};

const Index = () => {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    enabled: mounted,
    retry: 1,
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <div className="max-w-2xl mx-auto px-5">
        
        <DailyHeader />

        <div className="flex justify-center mb-8">
          <button
            onClick={() => queryClient.refetchQueries({ queryKey: ["articles"] })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            רענן כתבות
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20 animate-pulse text-muted-foreground">
            טוען כתבות אחרונות...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive border border-destructive/20 rounded-lg bg-destructive/5 px-4">
            <p className="font-medium">כרגע לא ניתן לטעון כתבות חדשות</p>
            <p className="text-xs opacity-70 mt-2">
              יתכן שהגענו למכסה היומית של ספק התוכן. נסה שוב בעוד כמה שעות.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-12 mb-12">
            <CategorySection
              category="חדשות מהעולם"
              articles={articles || []}
            />
            {articles?.length === 0 && (
              <p className="text-center text-muted-foreground">לא נמצאו כתבות כרגע.</p>
            )}
          </div>
        )}

        <footer className="border-t mt-12 opacity-20" />
        <p className="text-center font-sans text-[10px] text-muted-foreground py-6 uppercase tracking-widest">
          Personal Daily Briefing
        </p>
      </div>
      <DevSettingsPanel />
    </div>
  );
};

export default Index;