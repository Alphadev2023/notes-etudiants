import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./routes/AppRouter";
import { useWebSocketConnection } from "./application/notification/useWebSocketConnection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  useWebSocketConnection();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
