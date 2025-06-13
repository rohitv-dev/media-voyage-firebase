import { useAuthContext } from "@/context/authContext";
import { LoadingScreen } from "@components/LoadingScreen";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuthContext();

  if (auth.loading) return <LoadingScreen />;
  if (auth.isLoggedIn) return <Navigate to="/media" />;

  return <Navigate to="/login" />;
}
