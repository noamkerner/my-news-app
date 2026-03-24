import { ExternalLink, Globe } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ArticleCardProps {
  title: string;
  summary: string;
  original_url: string | null;
  category?: string;
  date?: string;
  source_name?: string; // הוספתי שם מקור
}

const categoryLabels: Record<string, string> = {
  "World Economics": "כלכלה עולמית",
  "AI Developments": "פיתוחי AI",
  "Engineering Innovations": "חדשנות הנדסית",
  "Global Politics & Israel": "פוליטיקה וישראל",
};

const ArticleCard = ({
  title,
  summary,
  original_url,
  category,
  date,
}: ArticleCardProps) => {
  // חילוץ שם הדומיין מה-URL אם קיים
  const source = original_url ? new URL(original_url).hostname.replace("www.", "") : "";
  const formattedDate = date ? format(parseISO(date), "dd/MM/yyyy") : null;

  return (
    <article className="group py-6 border-b border-border/40 last:border-0 text-right" dir="rtl">
      <div className="flex flex-col gap-2">
        
        {/* שורת מטא-דאטה (קטגוריה ותאריך) */}
        <div className="flex items-center gap-3 mb-1">
          {category && (
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
              {categoryLabels[category] || category}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground font-medium">
            {formattedDate} {source && ` • ${source}`}
          </span>
        </div>

        {/* כותרת הכתבה */}
        <h3 className="text-xl md:text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors italic-none">
          <a href={original_url || "#"} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>

        {/* תקציר הכתבה - בהיר וקריא */}
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-sans font-light">
          {summary}
        </p>

        {/* כפתור פעולה */}
        {original_url && (
          <div className="mt-2">
            <a
              href={original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline decoration-2 underline-offset-4"
            >
              לכתבה המקורית 
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;