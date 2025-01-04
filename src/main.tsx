import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, Modal, Rating } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./layouts/Layout.tsx";
import { mediaRoutes } from "@features/media/routes/routes.tsx";
import { authRoutes, profileRoute, userLoader } from "@features/authentication/routes/routes.tsx";
import { ProtectedRoute } from "@components/ProtectedRoute.tsx";
import { friendMediaRoutes } from "@features/friends/routes/routes.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";

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

const router = createBrowserRouter([
  ...authRoutes(),
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        id: "root",
        element: <Layout />,
        loader: userLoader(queryClient),
        children: [
          ...mediaRoutes(queryClient),
          profileRoute(),
          { path: "friend", children: friendMediaRoutes(queryClient) },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{
          primaryColor: "teal",
          fontFamily: "Fira Sans",
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
        <RouterProvider router={router} />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
