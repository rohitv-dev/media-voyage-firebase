import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { LoadingScreen } from "@components/LoadingScreen";
import { ErrorScreen } from "@components/ErrorScreen";
import { MantineProvider, Rating, Modal } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider, useAuthContext } from "./context/authContext";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface HistoryState {
    viewOnly?: boolean;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // 15 minutes
      gcTime: 1000 * 60 * 15,
      staleTime: Infinity,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isLoggedIn: false,
      loading: true,
      user: null,
    },
    queryClient,
  },
  defaultPendingComponent: LoadingScreen,
  defaultErrorComponent: ({ error }) => <ErrorScreen message={error.message} />,
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{
          primaryColor: "teal",
          fontFamily: "Fira Sans",
          white: "#f4f3ef",
          components: {
            Rating: Rating.extend({
              defaultProps: {
                fractions: 2,
              },
            }),
            Modal: Modal.extend({
              styles: {
                title: {
                  fontSize: 18,
                  fontWeight: "bold",
                },
              },
            }),
          },
        }}
        defaultColorScheme="light"
      >
        <Notifications position="top-center" withinPortal />
        <AuthContextProvider>
          <InnerAuth />
        </AuthContextProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function InnerAuth() {
  const auth = useAuthContext();
  const queryClient = useQueryClient();

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}
