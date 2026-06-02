import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      plan: "free" | "premium";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: "free" | "premium";
  }
}
