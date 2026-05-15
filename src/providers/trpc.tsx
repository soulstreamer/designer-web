import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

// Backend disabled - using mock tRPC client
export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false, // Disable all queries since backend is off
      retry: false,
    },
  },
});

// Create a proper mock client
const mockTrpcClient = trpc.createClient({
  links: [
    () =>
      ({ op }) => {
        console.warn(`[MOCK] Backend disabled. Operation "${op.type}.${op.path}" not executed.`);
        // Return an observable-like object
        return {
          subscribe: (observer: any) => {
            observer.next?.({
              result: {
                type: "data",
                data: undefined,
              },
            });
            observer.complete?.();
            return {
              unsubscribe: () => {},
            };
          },
        } as any;
      },
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={mockTrpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
