import { AuthContextType, useFirebaseUser } from "@/hooks/useFirebaseUser";
import { LoadingScreen } from "@components/LoadingScreen";
import { createContext, ReactNode, useContext } from "react";

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  user: null,
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseUser();

  return <AuthContext.Provider value={auth}>{auth.loading ? <LoadingScreen /> : children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext<AuthContextType>(AuthContext);
