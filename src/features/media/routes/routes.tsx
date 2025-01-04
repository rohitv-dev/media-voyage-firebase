import { RouteObject } from "react-router-dom";
import { MediaPage } from "./MediaPage";
import { AddMediaView } from "./AddMediaView";
import { UpdateMediaView } from "./UpdateMediaView";
import { QueryClient } from "@tanstack/react-query";
import { ErrorScreen } from "@components/ErrorScreen";
import { MediaViewPage } from "./MediaViewPage";
import { singleMediaLoader } from "../api/loaders";

export const mediaRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: "",
    element: <MediaPage />,
  },
  {
    path: "view/:id",
    loader: singleMediaLoader(queryClient),
    element: <MediaViewPage />,
    errorElement: <ErrorScreen />,
  },
  {
    path: "add",
    element: <AddMediaView />,
  },
  {
    path: "update/:id",
    loader: singleMediaLoader(queryClient),
    element: <UpdateMediaView />,
    errorElement: <ErrorScreen />,
  },
];
