"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
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

  const [resolvedPlan, setResolvedPlan] = useState<
    "free" | "premium" | null
  >(() => {
    if (status !== "authenticated") return null;
    return session?.user?.plan === "premium" ? "premium" : "free";
  });

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) {
      setResolvedPlan(null);
      return;
    }

    let cancelled = false;

    fetch("/api/billing/plan")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to resolve plan.");
        return res.json() as Promise<{ plan?: "free" | "premium" }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.plan === "premium" || data.plan === "free") {
          setResolvedPlan(data.plan);
        }
      })
      .catch(() => {
        // Keep the session-derived plan if the plan endpoint fails.
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email]);

  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user?.email) return null;
    return {
      id: session.user.id ?? session.user.email,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      plan: resolvedPlan ?? (session.user.plan === "premium" ? "premium" : "free"),
    };
  }, [session, resolvedPlan]);

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
