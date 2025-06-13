import { queryOptions } from "@tanstack/react-query";
import { ErrorInfo } from "@/types/api";
import { MediaService } from "../api/MediaService";

export const mediaQuery = (uid: string) =>
  queryOptions({
    queryKey: ["media"],
    queryFn: async () => {
      const res = await MediaService.getMedia(uid);
      if (!res.ok) {
        throw new Error(res.message);
      }
      return res.data;
    },
  });

export const singleMediaQuery = (id: string) =>
  queryOptions({
    queryKey: ["media", id],
    queryFn: async () => {
      const res = await MediaService.getSingleMedia(id);
      if (!res.ok) {
        throw {
          errorType: "Media Error",
          description: "Media ID Not Found",
        } as ErrorInfo;
      }
      return res.data;
    },
  });

export const mediaCountQuery = (uid: string) =>
  queryOptions({
    queryKey: ["mediaCount"],
    queryFn: async () => {
      const res = await MediaService.getMediaCount(uid);
      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });
