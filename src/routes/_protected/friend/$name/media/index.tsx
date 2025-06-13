import { friendMediaQuery } from "@features/friends/queries/friendQueries";
import { DBFriendWithUser } from "@features/friends/types/friends";
import { MediaTable } from "@features/media/components/MediaTable";
import { Stack, Title } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute({
  loader: ({
    context: {
      auth: { user },
      queryClient,
    },
    params: { name },
  }) => {
    const friend = queryClient.getQueryData(["friend", name]) as DBFriendWithUser;
    queryClient.ensureQueryData(friendMediaQuery(user!.uid, friend.user.uid, name));
    return friend.user.uid;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();

  const friendUid = Route.useLoaderData();

  const user = Route.useRouteContext({
    select: (state) => state.auth.user,
  });

  const { data } = useSuspenseQuery(friendMediaQuery(user!.uid, friendUid, name));

  return (
    <Stack gap="2px">
      <Title order={4}>Viewing {name}'s Media</Title>
      <MediaTable data={data} viewOnly />
    </Stack>
  );
}
