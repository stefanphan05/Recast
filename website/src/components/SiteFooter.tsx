import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(17,17,16,0.09)] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

          <div>
            <p className="font-display text-base text-(--foreground)">Recast</p>
            <p className="mt-0.5 text-xs text-(--muted)">Write with confidence on Mac.</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-(--muted)">
            <Link href="/download/" className="transition-colors hover:text-(--foreground)">
              Download
            </Link>
            <a
              href="https://github.com/stefanphan05/MessageRewriter"
              className="transition-colors hover:text-(--foreground)"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-[rgba(17,17,16,0.32)]">
            © {new Date().getFullYear()} Recast
          </p>

        </div>
      </div>
    </footer>
  );
}
