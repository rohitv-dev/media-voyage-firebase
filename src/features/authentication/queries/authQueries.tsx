import { queryOptions } from "@tanstack/react-query";
import { UserService } from "../api/UserService";

export const userQuery = (uid: string) =>
  queryOptions({
    queryKey: ["user", uid],
    queryFn: () => UserService.getUser(uid),
  });
