import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign in — Message Rewriter",
  description: "Sign in with Google to Message Rewriter.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <GoogleSignInButton />
    </AuthShell>
  );
}
