import { LoadingScreen } from "@components/LoadingScreen";
import { useEffect } from "react";
import { AuthService } from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const res = await AuthService.logout();
      if (res.ok) {
        navigate("/login");
      } else {
        showErrorNotification(res.message);
        navigate(-1);
      }
    };

    logout();
  }, [navigate]);

  return <LoadingScreen />;
};
