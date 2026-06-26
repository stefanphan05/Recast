import Link from "next/link";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(17,17,16,0.09)] bg-[rgba(248,247,246,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(17,17,16,0.1)] bg-[rgba(17,17,16,0.05)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 9.5L5 5L8 7.5L12 3.5"
                stroke="rgba(17,17,16,0.7)"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-lg tracking-tight text-(--foreground)">
            Recast
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm text-(--muted) md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-150 hover:text-(--foreground)"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/download/"
          className="site-button-primary rounded-full px-4 py-2 text-sm font-medium"
        >
          Download
        </Link>
      </div>
    </header>
  );
}
