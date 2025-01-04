import { firestore } from "@/services/firebase";
import { Result } from "@/types/api";
import { User } from "@/types/user";
import { handleResultError } from "@utils/functions";
import { collection, doc, getDoc, getDocs, or, query, setDoc, where } from "firebase/firestore";
import { parseUser } from "../utils/converters";
import { COLLECTIONS } from "@utils/constants";
import { chunk } from "remeda";

type UserService = {
  getUser(uid: string): Promise<Result<User>>;
  getUsers(uids: string[]): Promise<Result<User[]>>;
  createUser(user: User): Promise<Result<void>>;
  searchUser(text: string): Promise<Result<User>>;
};

export const UserService: UserService = {
  async getUser(uid) {
    try {
      const docRef = doc(firestore, COLLECTIONS.USERS, uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) return { ok: false, message: "User Not Found" };

      return { ok: true, data: parseUser(snap.data() as User) };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getUsers(uids) {
    try {
      const users: User[] = [];

      const promises = chunk(uids, 20).map(async (chunk) => {
        const snap = await getDocs(query(collection(firestore, COLLECTIONS.USERS), where("uid", "in", chunk)));

        if (!snap.empty) {
          return snap.docs.map((doc) => doc.data() as User);
        }

        return [];
      });

      const res = await Promise.all(promises);
      res.forEach((r) => users.push(...r));

      if (users.length === 0) return { ok: true, data: [] };

      return { ok: true, data: users };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async createUser(user) {
    try {
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        ...user,
      });

      return { ok: true, data: undefined };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async searchUser(text) {
    try {
      const snap = await getDocs(
        query(collection(firestore, COLLECTIONS.USERS), or(where("name", "==", text), where("email", "==", text)))
      );

      if (snap.empty) return { ok: false, message: "User Not Found" };

      return { ok: true, data: parseUser(snap.docs[0].data() as User) };
    } catch (err) {
      return handleResultError(err);
    }
  },
};
