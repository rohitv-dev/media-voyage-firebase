import { AddMediaForm } from "@features/media/forms/AddMediaForm";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddMediaForm />;
}
