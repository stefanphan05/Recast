import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { hasActivePremiumSubscription } from "@/lib/billing/stripe";

const premiumEmails = new Set(
  (process.env.PREMIUM_USER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    async jwt({ token }) {
      const email = token.email?.toLowerCase();
      if (!email) {
        token.plan = "free";
        return token;
      }

      if (premiumEmails.has(email)) {
        token.plan = "premium";
        return token;
      }

      try {
        token.plan = (await hasActivePremiumSubscription(email))
          ? "premium"
          : "free";
      } catch (error) {
        console.error("Failed to resolve Stripe subscription status:", error);
        token.plan = "free";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.email ?? "";
        session.user.plan = token.plan === "premium" ? "premium" : "free";
      }
      return session;
    },
  },
});
