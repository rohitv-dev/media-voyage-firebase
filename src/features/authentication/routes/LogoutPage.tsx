import { LoadingScreen } from "@components/LoadingScreen";
import { useEffect } from "react";
import { AuthService } from "../api/AuthService";
import { showErrorNotification } from "@utils/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";

export const LogoutPage = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const logout = async () => {
      const res = await AuthService.logout();
      if (res.ok) {
        queryClient.clear();
        navigate({ to: "/login" });
      } else {
        showErrorNotification(res.message);
        router.history.back();
      }
    };

    logout();
  }, [navigate, queryClient, router.history]);

  return <LoadingScreen />;
};
