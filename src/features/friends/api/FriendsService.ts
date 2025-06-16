import { DBFriend, DBFriendWithUser } from "../types/friends";
import { addDoc, and, collection, doc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { COLLECTIONS } from "@utils/constants";
import { UserService } from "@features/authentication/api/UserService";
import { map, pipe } from "remeda";
import { firebaseConverter } from "@features/media/utils/firebaseConverters";
import { NotificationService } from "@features/notifications/api/NotificationService";
import { User } from "@/types/user";

type FriendsService = {
  isFriend(curUid: string, otherUid: string): Promise<boolean>;

  getFriendWithUser(curUid: string, otherUid: string): Promise<DBFriendWithUser>;
  getFriends(uid: string): Promise<DBFriend[]>;
  getFriendUsers(uid: string): Promise<DBFriendWithUser[]>;

  sendRequest(data: { curUid: string; otherUid: string; username: string }): Promise<void>;
  acceptRequest(data: { id: string; friendId: string; user: User }): Promise<string>;
  rejectRequest(id: string): Promise<string>;
};

export const FriendsService: FriendsService = {
  async isFriend(curUid, otherUid) {
    const q = query(
      collection(firestore, COLLECTIONS.FRIENDS),
      or(
        and(where("user1", "==", curUid), where("user2", "==", otherUid)),
        and(where("user1", "==", otherUid), where("user2", "==", curUid))
      )
    ).withConverter(firebaseConverter<DBFriend>());

    const snap = await getDocs(q);

    if (snap.empty) return false;

    return true;
  },

  async getFriendWithUser(curUid, otherUid) {
    const q = query(
      collection(firestore, COLLECTIONS.FRIENDS),
      or(
        and(where("user1", "==", curUid), where("user2", "==", otherUid)),
        and(where("user1", "==", otherUid), where("user2", "==", curUid))
      )
    ).withConverter(firebaseConverter<DBFriend>());

    const snap = await getDocs(q);

    if (snap.empty) throw new Error("Friendship Not Found");

    const friend = { ...snap.docs[0].data(), id: snap.docs[0].id } as DBFriend;

    const user = await UserService.getUser(curUid);

    const data: DBFriendWithUser = {
      ...friend,
      user,
    };

    return data;
  },

  async getFriends(uid) {
    const q = query(
      collection(firestore, COLLECTIONS.FRIENDS),
      or(where("user1", "==", uid), where("user2", "==", uid))
    ).withConverter(firebaseConverter<DBFriend>());

    const snap = await getDocs(q);

    if (snap.empty) return [];

    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as DBFriend);
  },

  async getFriendUsers(uid) {
    const friends = await FriendsService.getFriends(uid);

    const users = await UserService.getUsers(
      friends.map((friend) => (friend.user1 === uid ? friend.user2 : friend.user1))
    );

    const data = pipe(
      friends,
      map((friend) => {
        const otherUid = friend.user1 === uid ? friend.user2 : friend.user1;

        const user = users.find((u) => u.uid === otherUid);

        return {
          ...friend,
          user,
        } as DBFriendWithUser;
      })
    );

    return data;
  },

  async sendRequest({ curUid, otherUid, username }) {
    await addDoc(collection(firestore, COLLECTIONS.FRIENDS).withConverter(firebaseConverter<Partial<DBFriend>>()), {
      user1: curUid,
      user2: otherUid,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      requestor: curUid,
      recepient: otherUid,
    });

    await NotificationService.sendNotification({
      title: "Friend Request",
      description: `You have received a friend request from ${username}`,
      for: otherUid,
    });
  },

  async acceptRequest({ id, friendId, user }) {
    await updateDoc(doc(firestore, COLLECTIONS.FRIENDS, id).withConverter(firebaseConverter<Partial<DBFriend>>()), {
      status: "Friends",
      updatedAt: new Date(),
    });

    await NotificationService.sendNotification({
      title: "Friend Request Accepted",
      description: `${user.name} has accepted your request!`,
      for: friendId,
    });

    return id;
  },

  async rejectRequest(id) {
    await updateDoc(doc(firestore, COLLECTIONS.FRIENDS, id).withConverter(firebaseConverter<Partial<DBFriend>>()), {
      status: "Rejected",
      updatedAt: new Date(),
    } as Partial<DBFriend>);

    return id;
  },
};
