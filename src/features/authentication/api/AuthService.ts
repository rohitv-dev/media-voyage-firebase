import { auth } from "@/services/firebase";
import { Result } from "@/types/api";
import { handleResultError } from "@utils/functions";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { UserService } from "./UserService";

export const AuthService = {
  async login(email: string, password: string): Promise<Result<void>> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true, data: undefined };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async logout(): Promise<Result<void>> {
    try {
      await signOut(auth);
      return { ok: true, data: undefined };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async register({ name, email, password }: { name: string; email: string; password: string }): Promise<Result<void>> {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userRes = await UserService.createUser({
        createdAt: new Date(),
        email,
        name,
        uid: res.user.uid,
      });

      if (userRes.ok) {
        return { ok: true, data: undefined };
      }

      return userRes;
    } catch (err) {
      return handleResultError(err);
    }
  },
};
