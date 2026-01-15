import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewsFeed } from '@/components/news-feed';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         retry: 1,
      },
   },
});

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <NewsFeed />
      </QueryClientProvider>
   );
}

export default App;
