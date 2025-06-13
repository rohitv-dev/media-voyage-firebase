import { auth } from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
}

export const useFirebaseUser = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    isLoggedIn,
    loading,
  };
};
