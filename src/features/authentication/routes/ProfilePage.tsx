import { useRouteLoaderData } from "react-router-dom";
import { UserLoader, userQuery } from "./routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Avatar, Card, Center, Stack, Text } from "@mantine/core";
import { formatDate } from "@utils/functions";
import { isString } from "remeda";

export const ProfilePage = () => {
  const id = useRouteLoaderData("root") as UserLoader;

  const { data: user } = useSuspenseQuery(userQuery(isString(id) ? id : ""));

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
