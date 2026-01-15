import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { NewsItem as NewsItemType } from '@/api/news.api';
import { formatTimeAgo, getCategoryStyle } from '@/utils/news.utils';
import { CATEGORIES } from '@/constants/news.constants';

interface NewsItemProps {
   item: NewsItemType;
}

export const NewsItem = memo(({ item }: NewsItemProps) => {
   const numericId = parseInt(item.id.replace('news-', ''), 10) || 0;
   const categoryIndex = numericId % 5;
   const category = CATEGORIES[categoryIndex];
   const categoryStyle = getCategoryStyle(categoryIndex);

   return (
      <article className="group relative mx-4 mb-4 h-[136px] overflow-hidden rounded-2xl bg-white border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-accent/8 hover:border-accent/40 hover:-translate-y-0.5">
         <div className="relative flex gap-4 p-4 h-full">
            <div className="relative w-[104px] shrink-0 overflow-hidden rounded-xl">
               <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-200" />
               <img
                  src={item.imageUrl}
                  alt=""
                  className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
               />
               <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                     {category}
                  </span>
               </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
               <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-semibold text-text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors duration-300">
                     {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
                     {item.description}
                  </p>
               </div>

               <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-gradient-start to-gradient-end flex items-center justify-center shrink-0">
                     <span className="text-[9px] font-bold text-white">{item.author.charAt(0)}</span>
                  </div>
                  <span className="text-text-primary font-medium truncate">
                     {item.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-muted flshrink-0" />
                  <time dateTime={item.publishedAt} className="text-text-muted whitespace-nowrap">
                     {formatTimeAgo(item.publishedAt)}
                  </time>
               </div>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
               <div className="w-8 h-8 rounded-full bg-linear-to-r from-gradient-start to-gradient-end flex items-center justify-center shadow-lg shadow-accent/30">
                  <ChevronRight className="w-4 h-4 text-white" strokeWidth={2.5} />
               </div>
            </div>
         </div>
      </article>
   );
});
