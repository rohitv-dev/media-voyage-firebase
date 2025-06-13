import { queryOptions } from "@tanstack/react-query";
import { FriendsService } from "../api/FriendsService";
import { MediaService } from "@features/media/api/MediaService";
import { ErrorInfo } from "@/types/api";

export const friendsWithUserQuery = (uid: string) =>
  queryOptions({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await FriendsService.getFriendUsers(uid);
      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });

export const friendMediaQuery = (uid: string, friendUid: string, name: string) =>
  queryOptions({
    queryKey: ["friend", "media", name],
    queryFn: async () => {
      const res = await MediaService.getFriendMedia(uid, friendUid);
      if (!res.ok) {
        throw {
          errorType: "Media Error",
          description: "Media Not Found",
        } as ErrorInfo;
      }

      return res.data;
    },
  });
