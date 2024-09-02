import { redirect, RouteObject } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { LogoutPage } from "./LogoutPage";
import { auth } from "@/services/firebase";
import { queryOptions, QueryClient } from "@tanstack/react-query";
import { UserService } from "../api/UserService";
import { ProfilePage } from "./ProfilePage";

export type UserLoader = Awaited<ReturnType<ReturnType<typeof userLoader>>>;

export const userQuery = (uid: string) =>
  queryOptions({
    queryKey: ["user", uid],
    queryFn: async () => {
      const res = await UserService.getUser(uid);
      if (!res.ok) {
        throw new Response("", {
          status: 401,
          statusText: "Unauthorized: " + res.message,
        });
      }
      return res.data;
    },
  });

export const userLoader = (queryClient: QueryClient) => async () => {
  await auth.authStateReady();

  if (auth.currentUser) {
    await queryClient.ensureQueryData(userQuery(auth.currentUser.uid));
    return auth.currentUser.uid;
  } else return redirect("login");
};

export const authRoutes = (): RouteObject[] => [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "logout",
    element: <LogoutPage />,
  },
];

export const profileRoute: RouteObject = {
  path: "profile",
  element: <ProfilePage />,
};
