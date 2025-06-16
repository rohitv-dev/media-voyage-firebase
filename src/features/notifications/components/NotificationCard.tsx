import { Card, Group, Stack, Text } from "@mantine/core";
import { Notification } from "../types/notification";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function NotificationCard({
  notification,
  onReadNotif,
  viewNotif,
}: {
  notification: Notification;
  viewNotif?: () => void;
  onReadNotif?: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return (
    <Card key={notification.createdAt.toString()} p="xs" shadow="md" withBorder>
      <Group align="start">
        <Stack gap="5px">
          <Text fz="sm" fw="bold">
            {notification.title}
          </Text>
          <Text fz="xs">{notification.description}</Text>
        </Stack>
        <Group>
          <Text
            fz="xs"
            fw="bold"
            c="teal"
            style={{ cursor: "pointer" }}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["friends"],
              });
              viewNotif?.();
              navigate({ to: "/profile" });
            }}
          >
            View
          </Text>
          {!notification.hasRead && (
            <Text
              fz="xs"
              c="cyan"
              fw="bold"
              style={{ cursor: "pointer" }}
              onClick={() => onReadNotif?.(notification.id)}
            >
              Mark as read
            </Text>
          )}
        </Group>
      </Group>
    </Card>
  );
}
