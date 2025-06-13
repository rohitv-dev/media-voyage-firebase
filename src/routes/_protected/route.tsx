import { useAuthContext } from "@/context/authContext";
import { Layout } from "@/layouts/Layout";
import { LoadingScreen } from "@components/LoadingScreen";
import { Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuthContext();

  if (auth.loading) return <LoadingScreen />;
  if (auth.isLoggedIn)
    return (
      <Layout>
        <Outlet />
      </Layout>
    );

  return <Navigate to="/login" replace />;
}
