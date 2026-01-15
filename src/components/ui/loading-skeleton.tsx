export const LoadingSkeleton = () => (
   <div className="mx-4 mb-4 h-[136px] rounded-2xl bg-white shadow-sm border border-border overflow-hidden">
      <div className="flex gap-4 p-4 h-full">
         <div className="w-[104px] rounded-xl animate-shimmer shrink-0" />
         <div className="flex-1 flex flex-col justify-between">
            <div>
               <div className="h-5 w-4/5 rounded-lg animate-shimmer" />
               <div className="mt-2 h-4 w-full rounded-lg animate-shimmer" />
               <div className="mt-1.5 h-4 w-3/4 rounded-lg animate-shimmer" />
            </div>
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full animate-shimmer" />
               <div className="h-3 w-20 rounded-full animate-shimmer" />
            </div>
         </div>
      </div>
   </div>
);
