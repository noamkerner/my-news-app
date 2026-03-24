import { ExternalLink } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    date: string;
    source: string;
    image?: string;
    url: string;
    original_url?: string;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // וידוא שיש לנו לינק תקין (או מה-URL או מה-original_url)
  const link = article.original_url || article.url;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group cursor-pointer transition-all duration-300"
    >
      <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all">
        {article.image && (
          <div className="w-full h-48 overflow-hidden rounded-xl">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711432869-efd597cdd042?w=800";
              }}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {article.source}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
          
          <div className="pt-2 text-[10px] text-slate-400 font-medium">
            {new Date(article.date).toLocaleDateString('he-IL')}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;