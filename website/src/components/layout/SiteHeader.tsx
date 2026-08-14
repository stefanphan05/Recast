import Link from "next/link";
import UnderlineLink from "@/components/ui/UnderlineLink";
import ThemeToggle from "@/components/ui/ThemeToggle";
import DownloadButton from "@/components/ui/DownloadButton";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-accent">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 9.5L5 5L8 7.5L12 3.5"
                stroke="var(--foreground)"
                strokeOpacity="0.7"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Recast
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <UnderlineLink key={link.href} href={link.href} showIcon={false}>
              {link.label}
            </UnderlineLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:flex" />
          <DownloadButton size="sm">Download</DownloadButton>
        </div>
      </div>
    </header>
  );
}
