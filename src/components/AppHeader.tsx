import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import Logo from "@/components/Logo";
import PricingLink from "@/components/PricingLink";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppHeader() {
  return (
    <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between px-4 py-3 sm:px-8 sm:py-6">
      <Link href="/" aria-label="Message Rewriter home">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-0.5">
        <PricingLink />
        <ThemeToggle />
        <AuthNav />
      </div>
    </header>
  );
}
