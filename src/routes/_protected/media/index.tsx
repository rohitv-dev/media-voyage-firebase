import { userQuery } from "@features/authentication/queries/authQueries";
import { MediaTable } from "@features/media/components/MediaTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@mantine/core";
import { MediaCountSection } from "@features/media/components/MediaCountSection";
import { Outlet } from "@tanstack/react-router";
import { mediaQuery } from "@features/media/queries/mediaQueries";

export const Route = createFileRoute({
  loader: ({ context: { auth, queryClient } }) => {
    if (auth.user) {
      queryClient.ensureQueryData(userQuery(auth.user.uid));
      queryClient.ensureQueryData(mediaQuery(auth.user.uid));
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useRouteContext({
    select: (state) => state.auth.user,
  });

  const { data } = useSuspenseQuery(mediaQuery(user!.uid));

  return (
    <Box>
      <MediaCountSection />
      <MediaTable data={data} />
      <Outlet />
    </Box>
  );
}
