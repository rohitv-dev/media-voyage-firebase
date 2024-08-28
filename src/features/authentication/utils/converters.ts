import { User } from "@/types/user";
import { getDate } from "@utils/functions";

export const parseUser = (user: User): User => ({
  ...user,
  createdAt: getDate(user.createdAt),
});
