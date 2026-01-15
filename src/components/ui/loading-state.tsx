import { LoadingSkeleton } from './loading-skeleton';

export const LoadingState = () => (
   <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-10 glass-effect border-b border-border">
         <div className="max-w-3xl mx-auto px-5 py-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl animate-shimmer" />
               <div>
                  <div className="h-7 w-36 rounded-lg animate-shimmer" />
                  <div className="mt-2 h-4 w-48 rounded-lg animate-shimmer" />
               </div>
            </div>
         </div>
      </header>
      <div className="max-w-3xl mx-auto py-6">
         {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
         ))}
      </div>
   </div>
);
