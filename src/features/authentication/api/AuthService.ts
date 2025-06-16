import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { UserService } from "./UserService";

type AuthService = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
};

export const AuthService: AuthService = {
  async login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  },

  async logout() {
    await signOut(auth);
  },

  async register({ name, email, password }) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await UserService.createUser({
      createdAt: new Date(),
      email,
      name,
      uid: res.user.uid,
    });
  },
};
