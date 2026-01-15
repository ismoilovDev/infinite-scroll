import { useEffect, type RefObject } from 'react';

interface UseInfiniteScrollOptions {
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
   fetchNextPage: () => void;
   observerRef: RefObject<HTMLDivElement | null>;
   rootRef?: RefObject<HTMLElement | null>;
   rootMargin?: string;
   threshold?: number;
}

export const useInfiniteScroll = ({
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
   observerRef,
   rootRef,
   rootMargin = '200px',
   threshold = 0.1,
}: UseInfiniteScrollOptions) => {
   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
               fetchNextPage();
            }
         },
         { root: rootRef?.current || null, rootMargin, threshold }
      );

      const target = observerRef.current;
      if (target) observer.observe(target);

      return () => {
         if (target) observer.unobserve(target);
      };
   }, [hasNextPage, isFetchingNextPage, fetchNextPage, observerRef, rootRef, rootMargin, threshold]);
};
