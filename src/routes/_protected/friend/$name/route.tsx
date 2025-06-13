import { friendsWithUserQuery } from "@features/friends/queries/friendQueries";
import { Outlet } from "@tanstack/react-router";
import { find } from "remeda";

export const Route = createFileRoute({
  beforeLoad: async ({
    context: {
      auth: { user },
      queryClient,
    },
    params: { name },
  }) => {
    if (user) {
      const friends = await queryClient.ensureQueryData(friendsWithUserQuery(user.uid));
      const friend = find(friends, (f) => f.user.name === name);

      if (!friend) throw new Error("Friend not found");

      queryClient.setQueryData(["friend", name], friend);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
