import { userQuery } from "@features/authentication/queries/authQueries";
import { FriendsCard } from "@features/friends/components/FriendsCard";
import { Center, Stack, Card, Avatar, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DATE_WITH_TIME } from "@utils/constants";
import { formatDate } from "@utils/functions";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();

  const { data } = useSuspenseQuery(userQuery(user!.uid));

  return (
    <Center>
      <Stack>
        <Card miw={400} radius="md" shadow="md">
          <Stack style={{ textAlign: "center" }}>
            <Center>
              <Avatar radius="xl" size="xl" color="initials" name={data.name} />
            </Center>
            <Text fw="bold" fz="lg">
              {data.name}
            </Text>
            <Text>{data.email}</Text>
            <Text>Registered on {formatDate(data.createdAt, DATE_WITH_TIME)}</Text>
          </Stack>
        </Card>
        <FriendsCard />
      </Stack>
    </Center>
  );
}
