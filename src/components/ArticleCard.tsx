import { ExternalLink } from "lucide-react";

const ArticleCard = ({ article }: { article: any }) => {
  if (!article) return null;

  const title = article.title || "כותרת חסרה";
  const summary = article.summary || "";
  const link = article.url || article.original_url || "#";
  const source = article.source || "חדשות";
  
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group transition-all duration-300"
    >
      <div className="h-full flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all text-right" dir="rtl">
        {article.image && (
          <div className="w-full h-40 overflow-hidden rounded-xl bg-slate-50">
            <img 
              src={article.image} 
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {source}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
          </div>
          
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          
          {summary && (
            <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;