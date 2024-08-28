import { auth } from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useFirebaseUser = () => {
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
  }, []);

  return {
    user,
    isLoggedIn,
    loading,
  };
};
