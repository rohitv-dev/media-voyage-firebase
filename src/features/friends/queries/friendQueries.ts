import { queryOptions } from "@tanstack/react-query";
import { FriendsService } from "../api/FriendsService";
import { MediaService } from "@features/media/api/MediaService";

export const friendsWithUserQuery = (uid: string) =>
  queryOptions({
    queryKey: ["friends"],
    queryFn: () => FriendsService.getFriendUsers(uid),
  });

export const friendMediaQuery = (uid: string, friendUid: string, name: string) =>
  queryOptions({
    queryKey: ["friend", "media", name],
    queryFn: async () => {
      return await MediaService.getFriendMedia(uid, friendUid);
    },
  });
