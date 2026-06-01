import Link from "next/link";
import Logo from "@/components/Logo";
import PricingLink from "@/components/PricingLink";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppHeader() {
  return (
    <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" aria-label="Message Rewriter home">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-0.5">
        <PricingLink />
        <ThemeToggle />
      </div>
    </header>
  );
}
