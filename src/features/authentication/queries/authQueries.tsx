import { queryOptions } from "@tanstack/react-query";
import { UserService } from "../api/UserService";

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
