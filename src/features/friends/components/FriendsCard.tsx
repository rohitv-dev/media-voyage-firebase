import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FriendsService } from "../api/FriendsService";
import { userQuery } from "@features/authentication/queries/authQueries";
import { findIndex } from "remeda";
import { useDisclosure } from "@mantine/hooks";
import { ErrorScreen } from "@components/ErrorScreen";
import {
  Card,
  Stack,
  Group,
  Title,
  ActionIcon,
  List,
  ThemeIcon,
  Button,
  Modal,
  Text,
  Skeleton,
  Box,
} from "@mantine/core";
import { IconCheck, IconLoader, IconPlus, IconUser, IconX } from "@tabler/icons-react";
import { AddFriendForm } from "./AddFriendForm";
import { DBFriendWithUser } from "../types/friends";
import { friendsWithUserQuery } from "../queries/friendQueries";
import { useNavigate } from "@tanstack/react-router";
import { useAuthContext } from "@/context/authContext";

export const FriendsCard = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [opened, handlers] = useDisclosure(false);
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(userQuery(auth.user!.uid));

  const { data: friends, isPending, isError, error } = useQuery(friendsWithUserQuery(user.uid));

  const { mutateAsync: acceptRequest } = useMutation({
    mutationFn: FriendsService.acceptRequest,
    onSuccess: (data) => {
      queryClient.setQueryData<DBFriendWithUser[]>(["friends"], (old) => {
        if (!old) return old;
        const index = findIndex(old, (f) => f.id === data);
        if (index === -1) return old;
        old[index] = { ...old[index], status: "Friends" };
        return old;
      });
    },
  });

  const { mutateAsync: rejectRequest } = useMutation({
    mutationFn: FriendsService.rejectRequest,
    onSuccess: (data) => {
      queryClient.setQueryData<DBFriendWithUser[]>(["friends"], (old) => {
        if (!old) return old;
        const index = findIndex(old, (f) => f.id === data);
        if (index === -1) return old;
        old[index] = { ...old[index], status: "Rejected" };
        return old;
      });
    },
  });

  if (isError) return <ErrorScreen message={error.message} />;
  if (isPending) return <Skeleton miw={300} mih={200} />;

  const activeFriends = friends.filter((f) => f.status === "Friends");
  const pendingRequests = friends.filter((f) => f.status === "Pending" && f.recepient === user.uid);
  const rejectedRequests = friends.filter((f) => f.status === "Rejected" && f.recepient === auth.user!.uid);

  return (
    <Box>
      <Card miw={400} radius="md" shadow="md">
        <Stack>
          <Group justify="space-between">
            <Title order={5}>Friends</Title>
            <ActionIcon size="sm" variant="transparent" aria-label="Add friend" onClick={handlers.open}>
              <IconPlus />
            </ActionIcon>
          </Group>
          <List
            center
            spacing="md"
            icon={
              <ThemeIcon size="sm" variant="transparent">
                <IconUser />
              </ThemeIcon>
            }
          >
            {activeFriends.map((friend) => (
              <List.Item key={friend.id}>
                <Group>
                  <Text>{friend.user.name}</Text>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => navigate({ to: "/friend/$name/media", params: { name: friend.user.name } })}
                  >
                    View Media
                  </Button>
                </Group>
              </List.Item>
            ))}
          </List>
          {pendingRequests.length > 0 && (
            <>
              <Title order={5}>Pending Requests</Title>
              <List
                center
                icon={
                  <ThemeIcon size="sm" variant="transparent">
                    <IconLoader />
                  </ThemeIcon>
                }
              >
                {pendingRequests.map((friend) => (
                  <List.Item key={friend.id}>
                    <Group justify="space-between">
                      <Text>{friend.user.name}</Text>
                      <Group gap="xs">
                        <ActionIcon
                          color="green"
                          variant="transparent"
                          size="sm"
                          onClick={() => acceptRequest({ id: friend.id, friendId: friend.user.uid, user })}
                        >
                          <IconCheck />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="transparent"
                          size="sm"
                          onClick={() => rejectRequest(friend.id)}
                        >
                          <IconX />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </>
          )}
          {rejectedRequests.length > 0 && (
            <>
              <Title order={5}>Rejected Requests</Title>
              <List
                center
                icon={
                  <ThemeIcon size="sm" variant="transparent" color="red">
                    <IconX />
                  </ThemeIcon>
                }
              >
                {rejectedRequests.map((friend) => (
                  <List.Item key={friend.id}>
                    <Group justify="space-between">
                      <Text>{friend.user.name}</Text>
                      <Group gap="xs">
                        <ActionIcon
                          color="green"
                          variant="transparent"
                          size="sm"
                          onClick={() => acceptRequest({ id: friend.id, friendId: friend.user.uid, user })}
                        >
                          <IconCheck />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </>
          )}
        </Stack>
      </Card>
      <Modal opened={opened} onClose={handlers.close} title="Add Friend">
        <AddFriendForm closeForm={handlers.close} />
      </Modal>
    </Box>
  );
};
