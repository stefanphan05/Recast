import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-(--muted) md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-lg text-(--foreground)">Recast</p>
          <p className="mt-1">Write with confidence on Mac.</p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/download/" className="hover:text-(--foreground)">
            Download
          </Link>
          <a
            href="https://github.com/stefanphan05/MessageRewriter"
            className="hover:text-(--foreground)"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <p className="text-center md:text-right">
          © {new Date().getFullYear()} Recast
        </p>
      </div>
    </footer>
  );
}
