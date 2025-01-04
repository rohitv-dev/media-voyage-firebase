import { Result } from "@/types/api";
import { DBFriend, DBFriendWithUser } from "../types/friends";
import { handleResultError } from "@utils/functions";
import { addDoc, and, collection, doc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { COLLECTIONS } from "@utils/constants";
import { UserService } from "@features/authentication/api/UserService";
import { map, pipe } from "remeda";
import { firebaseConverter } from "@features/media/utils/firebaseConverters";

type FriendsService = {
  isFriend(curUid: string, otherUid: string): Promise<Result<boolean>>;

  getFriendWithUser(curUid: string, otherUid: string): Promise<Result<DBFriendWithUser>>;
  getFriends(uid: string): Promise<Result<DBFriend[]>>;
  getFriendUsers(uid: string): Promise<Result<DBFriendWithUser[]>>;

  sendRequest(curUid: string, otherUid: string): Promise<Result<void>>;
  acceptRequest(id: string): Promise<Result<string>>;
  rejectRequest(id: string): Promise<Result<string>>;
};

export const FriendsService: FriendsService = {
  async isFriend(curUid, otherUid) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.FRIENDS),
        or(
          and(where("user1", "==", curUid), where("user2", "==", otherUid)),
          and(where("user1", "==", otherUid), where("user2", "==", curUid))
        )
      ).withConverter(firebaseConverter<DBFriend>());

      const snap = await getDocs(q);

      if (snap.empty) return { ok: true, data: false };

      return { ok: true, data: true };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getFriendWithUser(curUid, otherUid) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.FRIENDS),
        or(
          and(where("user1", "==", curUid), where("user2", "==", otherUid)),
          and(where("user1", "==", otherUid), where("user2", "==", curUid))
        )
      ).withConverter(firebaseConverter<DBFriend>());

      const snap = await getDocs(q);

      if (snap.empty) return { ok: false, message: "Friendship Not Found" };

      const friend = { ...snap.docs[0].data(), id: snap.docs[0].id } as DBFriend;

      const res = await UserService.getUser(curUid);

      if (!res.ok) return { ok: false, message: "User Not Found" };

      const data: DBFriendWithUser = {
        ...friend,
        user: res.data,
      };

      return { ok: true, data };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getFriends(uid) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.FRIENDS),
        or(where("user1", "==", uid), where("user2", "==", uid))
      ).withConverter(firebaseConverter<DBFriend>());

      const snap = await getDocs(q);

      if (snap.empty) return { ok: true, data: [] };

      return { ok: true, data: snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as DBFriend)) };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getFriendUsers(uid) {
    try {
      const friends = await FriendsService.getFriends(uid);

      if (!friends.ok) return { ok: false, message: friends.message };

      const users = await UserService.getUsers(
        friends.data.map((friend) => (friend.user1 === uid ? friend.user2 : friend.user1))
      );

      if (!users.ok) return { ok: false, message: users.message };

      const data = pipe(
        friends.data,
        map((friend) => {
          const otherUid = friend.user1 === uid ? friend.user2 : friend.user1;

          const user = users.data.find((u) => u.uid === otherUid);

          return {
            ...friend,
            user,
          } as DBFriendWithUser;
        })
      );

      return { ok: true, data: data };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async sendRequest(curUid, otherUid) {
    try {
      await addDoc(collection(firestore, COLLECTIONS.FRIENDS).withConverter(firebaseConverter<Partial<DBFriend>>()), {
        user1: curUid,
        user2: otherUid,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        requestor: curUid,
        recepient: otherUid,
      });

      return { ok: true, data: undefined };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async acceptRequest(id) {
    try {
      await updateDoc(doc(firestore, COLLECTIONS.FRIENDS, id).withConverter(firebaseConverter<Partial<DBFriend>>()), {
        status: "Friends",
        updatedAt: new Date(),
      });

      return { ok: true, data: id };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async rejectRequest(id) {
    try {
      await updateDoc(doc(firestore, COLLECTIONS.FRIENDS, id).withConverter(firebaseConverter<Partial<DBFriend>>()), {
        status: "Rejected",
        updatedAt: new Date(),
      } as Partial<DBFriend>);

      return { ok: true, data: id };
    } catch (err) {
      return handleResultError(err);
    }
  },
};
