import { useLoaderData } from "react-router-dom";
import { userLoader, userQuery } from "./routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Avatar, Card, Center, Stack, Text } from "@mantine/core";
import { formatDate } from "@utils/functions";

export const ProfilePage = () => {
  const id = useLoaderData() as Awaited<ReturnType<ReturnType<typeof userLoader>>>;

  const { data: user } = useSuspenseQuery(userQuery(id));

  return (
    <Center>
      <Card miw={400} radius="md" shadow="md">
        <Stack style={{ textAlign: "center" }}>
          <Center>
            <Avatar radius="xl" size="xl" color="initials" name={user.name} />
          </Center>
          <Text fw="bold" fz="lg">
            {user.name}
          </Text>
          <Text>{user.email}</Text>
          <Text>Registered on {formatDate(user.createdAt, true)}</Text>
        </Stack>
      </Card>
    </Center>
  );
};
