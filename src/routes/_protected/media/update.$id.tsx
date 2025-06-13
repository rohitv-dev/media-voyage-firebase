import { UpdateMediaForm } from "@features/media/forms/UpdateMediaForm";
import { singleMediaQuery } from "@features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute({
  loader: ({ context: { queryClient }, params: { id } }) => {
    queryClient.ensureQueryData(singleMediaQuery(id));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(singleMediaQuery(id));

  return <UpdateMediaForm media={data} />;
}
