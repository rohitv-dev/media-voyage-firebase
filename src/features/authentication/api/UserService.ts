import { firestore } from "@/services/firebase";
import { User } from "@/types/user";
import { collection, doc, getDoc, getDocs, or, query, setDoc, where } from "firebase/firestore";
import { parseUser } from "../utils/converters";
import { COLLECTIONS } from "@utils/constants";
import { chunk } from "remeda";

type UserService = {
  getUser(uid: string): Promise<User>;
  getUsers(uids: string[]): Promise<User[]>;
  createUser(user: User): Promise<void>;
  searchUser(text: string): Promise<User | null>;
};

export const UserService: UserService = {
  async getUser(uid) {
    const docRef = doc(firestore, COLLECTIONS.USERS, uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) throw new Error("User Not Found");

    return parseUser(snap.data() as User);
  },

  async getUsers(uids) {
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

    if (users.length === 0) return [];

    return users;
  },

  async createUser(user) {
    const docRef = doc(firestore, "users", user.uid);
    await setDoc(docRef, {
      ...user,
    });
  },

  async searchUser(text) {
    const snap = await getDocs(
      query(collection(firestore, COLLECTIONS.USERS), or(where("name", "==", text), where("email", "==", text)))
    );

    if (snap.empty) return null;

    return parseUser(snap.docs[0].data() as User);
  },
};
