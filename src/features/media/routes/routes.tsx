import { json, LoaderFunctionArgs, RouteObject } from "react-router-dom";
import { MediaPage } from "./MediaPage";
import { AddMediaView } from "./AddMediaView";
import { UpdateMediaView } from "./UpdateMediaView";
import { MediaService } from "../api/MediaService";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { Media } from "../types/media";
import { find } from "remeda";
import { ErrorScreen } from "@components/ErrorScreen";
import { ErrorInfo } from "@/types/api";
import { MediaViewPage } from "./MediaViewPage";

export type MediaLoader = Awaited<ReturnType<ReturnType<typeof mediaLoader>>>;
export type SingleMediaLoader = Awaited<ReturnType<ReturnType<typeof singleMediaLoader>>>;

export const singleMediaQuery = (id: string) =>
  queryOptions({
    queryKey: ["media", id],
    queryFn: async () => {
      const res = await MediaService.getSingleMedia(id);
      if (!res.ok) {
        throw json({
          errorType: "Media Error",
          description: "Media ID Not Found",
        } as ErrorInfo);
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

    if (!media) {
      await queryClient.ensureQueryData(singleMediaQuery(params.id));
      return params.id;
    }

    const selectedMedia = find(media, (m) => m.id === params.id);

    if (!selectedMedia)
      throw json({
        errorType: "Media Error",
        description: "Media ID Not Found",
      } as ErrorInfo);

    await queryClient.setQueryData(["media", params.id], selectedMedia);

    return params.id;
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
