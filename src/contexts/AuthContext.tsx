"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  SessionProvider,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";
import type { AuthUser } from "@/lib/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user?.email) return null;
    return {
      id: session.user.id ?? session.user.email,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      plan: session.user.plan === "premium" ? "premium" : "free",
    };
  }, [session]);

  const signInWithGoogle = useCallback(async () => {
    await nextAuthSignIn("google", { callbackUrl: "/" });
  }, []);

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ callbackUrl: "/" });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: status === "loading",
      signInWithGoogle,
      signOut,
    }),
    [user, status, signInWithGoogle, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
