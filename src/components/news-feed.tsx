import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Newspaper, Search, Bell, Check } from 'lucide-react';
import { useInfiniteNews } from '@/hooks/useInfiniteNews';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { NewsItem } from './news-item';
import { LoadingState } from './ui/loading-state';
import { ErrorState } from './ui/error-state';
import { ITEM_HEIGHT } from '@/constants/news.constants';

export const NewsFeed = () => {
   const {
      items,
      isLoading,
      isFetchingNextPage,
      error,
      hasNextPage,
      fetchNextPage,
   } = useInfiniteNews();

   const parentRef = useRef<HTMLDivElement>(null);
   const observerRef = useRef<HTMLDivElement>(null);

   const virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => ITEM_HEIGHT,
      overscan: 5,
   });

   useInfiniteScroll({
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      observerRef,
      rootRef: parentRef,
   });

   if (isLoading) return <LoadingState />;
   if (error) return <ErrorState message={error} />;

   return (
      <div className="min-h-screen bg-bg-primary">
         <header className="sticky top-0 z-10 glass-effect border-b border-border">
            <div className="max-w-3xl mx-auto px-5 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-gradient-start to-gradient-end flex items-center justify-center shadow-lg shadow-accent/25">
                        <Newspaper className="w-6 h-6 text-white" strokeWidth={2} />
                     </div>
                     <div>
                        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-text-primary">
                           Yangiliklar
                        </h1>
                        <p className="text-text-secondary text-sm font-medium">
                           Eng so'nggi voqealar
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-accent/30 transition-all duration-200">
                        <Search className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                     </button>
                     <button className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-accent/30 transition-all duration-200">
                        <Bell className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                     </button>
                  </div>
               </div>
            </div>
         </header>

         <div ref={parentRef} className="h-[calc(100vh-90px)] overflow-auto">
            <div className="max-w-3xl mx-auto py-5">
               <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
                  {virtualizer.getVirtualItems().map((virtualRow) => (
                     <div
                        key={virtualRow.key}
                        className="animate-fade-in-up"
                        style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           width: '100%',
                           height: `${virtualRow.size}px`,
                           transform: `translateY(${virtualRow.start}px)`,
                        }}
                     >
                        <NewsItem item={items[virtualRow.index]} />
                     </div>
                  ))}
               </div>

               <div ref={observerRef} className="h-4" />

               {isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-3 py-8">
                     <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                           <div
                              key={i}
                              className="w-2.5 h-2.5 rounded-full bg-linear-to-r from-gradient-start to-gradient-end"
                              style={{
                                 animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
                              }}
                           />
                        ))}
                     </div>
                     <span className="text-text-secondary text-sm font-medium">Yuklanmoqda...</span>
                  </div>
               )}

               {!hasNextPage && items.length > 0 && (
                  <div className="text-center py-12">
                     <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-linear-to-r from-accent-light to-purple-100 border border-accent/20">
                        <div className="w-8 h-8 rounded-full bg-linear-to-r from-gradient-start to-gradient-end flex items-center justify-center">
                           <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-text-primary font-semibold">Barcha yangiliklar ko'rildi</span>
                     </div>
                  </div>
               )}
            </div>
         </div>

         <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      </div>
   );
};
