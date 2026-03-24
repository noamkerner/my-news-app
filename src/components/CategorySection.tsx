import ArticleCard from "./ArticleCard";

interface Article {
  id: string;
  title: string;
  summary: string;
  relevance_score: number;
  original_url: string | null;
  impact_on_israel: string | null;
  date: string;
}

interface CategorySectionProps {
  category: string;
  articles: Article[];
}

const categoryLabels: Record<string, string> = {
  "World Economics": "כלכלה עולמית",
  "AI Developments": "התפתחויות בינה מלאכותית",
  "Engineering Innovations": "חדשנות הנדסית",
  "Global Politics & Israel": "פוליטיקה עולמית וישראל",
};

const categoryColorVar: Record<string, string> = {
  "World Economics": "var(--cat-economics)",
  "AI Developments": "var(--cat-ai)",
  "Engineering Innovations": "var(--cat-engineering)",
  "Global Politics & Israel": "var(--cat-politics)",
};

const CategorySection = ({ category, articles }: CategorySectionProps) => {
  if (articles.length === 0) return null;

  const colorVar = categoryColorVar[category] || "var(--subtext)";

  return (
    <section className="mb-10">
      <div className="editorial-divider mb-4" />
      <div className="flex items-center gap-3 mb-5">
        <span
          className="inline-block w-3 h-3 rounded-full shrink-0"
          style={{ background: `hsl(${colorVar})` }}
        />
        <h2 className="category-label mb-0">
          {categoryLabels[category] || category}
        </h2>
      </div>
      <div className="divide-y divide-divider">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            summary={article.summary}
            relevance_score={article.relevance_score}
            original_url={article.original_url}
            impact_on_israel={article.impact_on_israel}
            category={category}
            date={article.date}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
