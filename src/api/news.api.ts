export interface NewsItem {
   id: string;
   title: string;
   description: string;
   author: string;
   publishedAt: string;
   imageUrl: string;
}

export interface NewsPage {
   items: NewsItem[];
   nextCursor: number | null;
}

const TOTAL_ITEMS = 100;
const PAGE_SIZE = 20;

const generateMockNews = (cursor: number): NewsItem[] => {
   const startId = cursor;
   const count = Math.min(PAGE_SIZE, TOTAL_ITEMS - cursor);

   return Array.from({ length: count }, (_, index) => {
      const id = startId + index + 1;
      return {
         id: `news-${id}`,
         title: `Breaking News: Major Development ${id}`,
         description: `This is a detailed description of the news item ${id}. It contains important information about current events and developments in various sectors including technology, politics, and economy.`,
         author: `Author ${(id % 10) + 1}`,
         publishedAt: new Date(Date.now() - id * 3600000).toISOString(),
         imageUrl: `https://picsum.photos/seed/news-${id}/400/250`,
      };
   });
};

export const fetchNewsPage = async (cursor: number = 0): Promise<NewsPage> => {
   await new Promise((resolve) => setTimeout(resolve, 800));

   const items = generateMockNews(cursor);
   const nextCursor = cursor + PAGE_SIZE < TOTAL_ITEMS ? cursor + PAGE_SIZE : null;

   return { items, nextCursor };
};
