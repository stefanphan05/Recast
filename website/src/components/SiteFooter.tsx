import UnderlineLink from "@/components/UnderlineLink";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <p className="text-base font-semibold tracking-tight text-foreground">
              Recast
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Write with confidence on Mac.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <UnderlineLink href="/download/" showIcon={false}>
              Download
            </UnderlineLink>
            <UnderlineLink
              href="https://github.com/stefanphan05/MessageRewriter"
              external
              showIcon={false}
            >
              GitHub
            </UnderlineLink>
          </div>

          <p className="font-mono text-[11px] tracking-wide text-muted-foreground/60">
            © {new Date().getFullYear()} Recast
          </p>
        </div>
      </div>
    </footer>
  );
}
