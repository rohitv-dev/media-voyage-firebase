import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useFirebaseUser();

  if (loading) return <LoadingScreen />;

  if (isLoggedIn) return <Outlet />;

  return <Navigate to="login" replace />;
};
