import { QueryClient } from "@tanstack/react-query";
import { RouteObject } from "react-router-dom";
import { FriendMediaPage } from "./FriendMediaPage";
import { FriendMediaView } from "./FriendMediaView";
import { ErrorScreen } from "@components/ErrorScreen";
import { friendLoader, friendMediaLoader, singleMediaLoader } from "../api/loaders";

export const friendMediaRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: ":name",
    id: "friend",
    errorElement: <ErrorScreen />,
    loader: friendLoader(queryClient),
    children: [
      {
        path: "media",
        children: [
          {
            path: "",
            loader: friendMediaLoader(queryClient),
            element: <FriendMediaPage />,
          },
          {
            path: "view/:id",
            loader: singleMediaLoader(queryClient),
            element: <FriendMediaView />,
          },
        ],
      },
    ],
  },
];
