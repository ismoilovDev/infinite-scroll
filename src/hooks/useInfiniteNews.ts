import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNewsPage, type NewsItem } from '@/api/news.api';
import { QUERY_KEYS } from '@/api/query-keys';

export const useInfiniteNews = () => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.NEWS],
    queryFn: ({ pageParam }) => fetchNewsPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const allItems: NewsItem[] = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items: allItems,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error?.message ?? null,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
