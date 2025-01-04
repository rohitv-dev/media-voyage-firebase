import { User } from "@/types/user";
import { z } from "zod";

export const DBFriendStatusEnum = z.enum(["Pending", "Friends", "Rejected"]);
export type FriendStatus = z.infer<typeof DBFriendStatusEnum>;

export interface DBFriend {
  id: string;
  user1: string;
  user2: string;
  requestor: string;
  recepient: string;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBFriendWithUser extends DBFriend {
  user: User;
}

export interface Friend {
  id: string;
  uid: string;
  status: FriendStatus;
  user: User;
}
