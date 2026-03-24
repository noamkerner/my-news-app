import ArticleCard from "./ArticleCard";

interface CategorySectionProps {
  category: string;
  articles: any[];
}

const CategorySection = ({ category, articles }: CategorySectionProps) => {
  // הגנה: אם אין כתבות, אל תציג את הסקשן
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article.id || `article-${index}`} 
            article={article} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;