import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readNotificationsQuery, unreadNotificationsQuery } from "../queries/notificationQueries";
import { Divider, Drawer, Indicator, Skeleton, Stack, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useAuthContext } from "@/context/authContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NotificationService } from "../api/NotificationService";
import { findIndex } from "remeda";
import { Notification } from "../types/notification";
import { showErrorNotification } from "@utils/notifications";
import { NotificationCard } from "./NotificationCard";

export function NotificationsView() {
  const { user } = useAuthContext();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unreadNotifs, isLoading: isUnreadLoading } = useQuery(unreadNotificationsQuery(user!.uid));
  const { data: readNotifs, isLoading: isReadLoading } = useQuery(readNotificationsQuery(user!.uid, opened));

  const { mutateAsync: readNotification } = useMutation({
    mutationFn: NotificationService.readNotification,
    onSuccess: async (data) => {
      queryClient.setQueryData<Notification[]>(["notifications", "unread"], (old) => {
        if (!old) return old;
        const index = findIndex(old, (n) => n.id === data);
        if (index === -1) return old;
        old[index] = { ...old[index], hasRead: true };
        return old;
      });
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const markNotifRead = async (id: string) => {
    await readNotification(id);
  };

  if (isUnreadLoading || isReadLoading || !unreadNotifs) return <Skeleton radius="50%" w={16} h={16} />;

  return (
    <>
      <Indicator
        label={unreadNotifs.length}
        size={18}
        mt="xs"
        fw="bold"
        style={{ cursor: "pointer" }}
        onClick={() => setOpened((o) => !o)}
      >
        <IconBell />
      </Indicator>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="right"
        title={
          <Text fw="bold" fz="lg">
            Notifications
          </Text>
        }
      >
        <Stack>
          {[...unreadNotifs].map((n) => (
            <NotificationCard
              key={n.createdAt.toString()}
              notification={n}
              onReadNotif={(id) => markNotifRead(id)}
              viewNotif={() => {
                queryClient.invalidateQueries({
                  queryKey: ["friends"],
                });
                setOpened(false);
                navigate({ to: "/profile" });
              }}
            />
          ))}
          <Divider />
          {(readNotifs ?? []).map((n) => (
            <NotificationCard
              key={n.createdAt.toString()}
              notification={n}
              onReadNotif={(id) => markNotifRead(id)}
              viewNotif={() => {
                setOpened(false);
                navigate({ to: "/profile" });
              }}
            />
          ))}
        </Stack>
      </Drawer>
    </>
  );
}
