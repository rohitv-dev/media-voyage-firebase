import { firestore } from "@/services/firebase";
import { Result } from "@/types/api";
import { User } from "@/types/user";
import { handleResultError } from "@utils/functions";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { parseUser } from "../utils/converters";

export const UserService = {
  async getUser(uid: string): Promise<Result<User>> {
    try {
      const docRef = doc(firestore, "users", uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) return { ok: false, message: "User Not Found" };

      return { ok: true, data: parseUser(snap.data() as User) };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async createUser(user: User): Promise<Result<void>> {
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
};
