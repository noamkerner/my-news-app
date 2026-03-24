import ArticleCard from "./ArticleCard";

interface CategorySectionProps {
  category: string;
  articles: any[];
}

const CategorySection = ({ category, articles }: CategorySectionProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* שינינו ל-lg:grid-cols-3 כדי שיהיו 3 כתבות בשורה במסך רחב */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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