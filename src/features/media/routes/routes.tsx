import { json, LoaderFunctionArgs, RouteObject } from "react-router-dom";
import { MediaPage } from "./MediaPage";
import { MediaView } from "./MediaView";
import { AddMediaView } from "./AddMediaView";
import { UpdateMediaView } from "./UpdateMediaView";
import { MediaService } from "../api/MediaService";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { Media } from "../types/media";
import { filter, first, pipe } from "remeda";
import { ErrorScreen } from "@components/ErrorScreen";
import { ErrorInfo } from "@/types/api";
import { userLoader } from "@features/authentication/routes/routes";

export const singleMediaQuery = (id: string) =>
  queryOptions({
    queryKey: ["media", id],
    queryFn: async () => {
      const res = await MediaService.getSingleMedia(id);
      if (!res.ok) {
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
      }
      return res.data;
    },
  });

export const singleMediaLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
      throw new Error("Media ID Not Provided");
    }
    const media = queryClient.getQueryData<Media[]>(["media"]);
    if (!media)
      throw json({
        errorType: "Media Error",
        description: "Invalid Media ID",
      } as ErrorInfo);
    const selectedMedia = pipe(
      media,
      filter((m) => m.id === params.id),
      first()
    );

    if (!selectedMedia)
      throw json({
        errorType: "Media Error",
        description: "Media ID Not Found",
      } as ErrorInfo);

    return selectedMedia;
  };

export const mediaLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
      throw new Error("Media ID Not Provided");
    }
    await queryClient.ensureQueryData(singleMediaQuery(params.id));
    return { id: params.id };
  };

export const mediaRoutes = (queryClient: QueryClient): RouteObject[] => [
  {
    path: "",
    loader: userLoader(queryClient),
    element: <MediaPage />,
  },
  {
    path: "view/:id",
    loader: singleMediaLoader(queryClient),
    element: <MediaView />,
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
