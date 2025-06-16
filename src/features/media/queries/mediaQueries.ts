import { queryOptions } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";

export const mediaQuery = (uid: string) =>
  queryOptions({
    queryKey: ["media"],
    queryFn: async () => {
      return await MediaService.getMedia(uid);
    },
  });

export const singleMediaQuery = (id: string) =>
  queryOptions({
    queryKey: ["media", id],
    queryFn: async () => {
      return await MediaService.getSingleMedia(id);
    },
  });

export const mediaCountQuery = (uid: string) =>
  queryOptions({
    queryKey: ["mediaCount"],
    queryFn: async () => {
      return await MediaService.getMediaCount(uid);
    },
  });
