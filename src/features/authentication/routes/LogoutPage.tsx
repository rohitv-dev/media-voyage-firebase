import { LoadingScreen } from "@components/LoadingScreen";
import { useEffect } from "react";
import { AuthService } from "../api/AuthService";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";

export const LogoutPage = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const logout = async () => {
      await AuthService.logout();
      queryClient.clear();
      navigate({ to: "/login" });
    };

    logout();
  }, [navigate, queryClient, router.history]);

  return <LoadingScreen />;
};
