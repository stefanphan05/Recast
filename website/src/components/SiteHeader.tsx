import Link from "next/link";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
  { href: "/download/", label: "Download" },
] as const;

export default function SiteHeader() {
  return (
    <header className="site-divider sticky top-0 z-50 border-b bg-[rgba(17,14,12,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-(--foreground)"
        >
          Recast
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-(--muted) md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-(--foreground)"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/download/"
          className="site-button-primary rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Download
        </Link>
      </div>
    </header>
  );
}
