import { LoadingScreen } from "@components/LoadingScreen";
import { useEffect } from "react";
import { AuthService } from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";
import { useQueryClient } from "@tanstack/react-query";

export const LogoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const logout = async () => {
      const res = await AuthService.logout();
      if (res.ok) {
        queryClient.clear();
        navigate("/login");
      } else {
        showErrorNotification(res.message);
        navigate(-1);
      }
    };

    logout();
  }, [navigate, queryClient]);

  return <LoadingScreen />;
};
