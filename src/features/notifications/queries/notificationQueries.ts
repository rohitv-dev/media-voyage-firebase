import { queryOptions } from "@tanstack/react-query";
import { NotificationService } from "../api/NotificationService";

export const unreadNotificationsQuery = (uid: string) =>
  queryOptions({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      return await NotificationService.getUnreadNotifications(uid);
    },
    refetchInterval: 5 * 60 * 1000,
  });

export const readNotificationsQuery = (uid: string, enabled: boolean) =>
  queryOptions({
    queryKey: ["notifications", "read"],
    queryFn: async () => {
      return await NotificationService.getReadNotifications(uid);
    },
    enabled,
  });
