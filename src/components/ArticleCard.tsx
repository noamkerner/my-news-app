import { ExternalLink } from "lucide-react";

const ArticleCard = ({ article }: { article: any }) => {
  // הגנה: אם אין אובייקט ארטיקל, אל תרנדר כלום
  if (!article) return null;

  const link = article.original_url || article.url || "#";
  const displayDate = article.date ? new Date(article.date).toLocaleDateString('he-IL') : "";

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group cursor-pointer transition-all duration-300 mb-4"
    >
      <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all">
        {article.image && (
          <div className="w-full h-48 overflow-hidden rounded-xl bg-slate-50">
            <img 
              src={article.image} 
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="space-y-2 text-right" dir="rtl">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {article.source || "News"}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
          
          {displayDate && (
            <div className="pt-2 text-[10px] text-slate-400 font-medium">
              {displayDate}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;