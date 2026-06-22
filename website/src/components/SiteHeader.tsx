import Link from "next/link";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "/download/", label: "Download" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f4ef]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-neutral-950"
        >
          Recast
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-neutral-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/download/"
          className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-[#f7f4ef] transition-opacity hover:opacity-90"
        >
          Download
        </Link>
      </div>
    </header>
  );
}
