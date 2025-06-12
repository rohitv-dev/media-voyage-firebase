import { QueryClient } from "@tanstack/react-query";
import { ErrorInfo } from "react";
import { LoaderFunctionArgs } from "react-router-dom";
import { find } from "remeda";
import { Media } from "../types/media";
import { singleMediaQuery } from "./queries";

export type SingleMediaLoader = Awaited<ReturnType<ReturnType<typeof singleMediaLoader>>>;

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
      throw {
        errorType: "Media Error",
        description: "Media ID Not Found",
      } as ErrorInfo;

    queryClient.setQueryData(["media", params.id], selectedMedia);

    return params.id;
  };
