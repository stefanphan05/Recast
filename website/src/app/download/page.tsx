import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DownloadButton from "@/components/DownloadButton";

export const metadata = {
  title: "Download Recast for Mac",
  description: "Download Recast for macOS and rewrite messages with local AI.",
};

export default function DownloadPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col justify-center px-6 py-16">
        <div className="site-card rounded-3xl p-8 md:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-(--muted)">
            Recast for Mac
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-tight text-(--foreground)">
            Download for Mac
          </h1>
          <p className="mt-3 text-base leading-relaxed text-(--muted)">
            Rewrite messages in different styles using AI that runs entirely on
            your Mac. Your text never leaves your device.
          </p>

          <DownloadButton className="mt-8" directDownload>
            Download for Mac (Apple Silicon)
          </DownloadButton>

          <div className="mt-4 rounded-2xl border border-[rgba(17,17,16,0.1)] bg-[rgba(17,17,16,0.03)] px-4 py-3 text-sm leading-relaxed text-(--muted)">
            <p className="font-medium text-(--foreground)">
              Unsigned app note
            </p>
            <p className="mt-1">
              macOS may say Recast can&apos;t be opened, is damaged, or is blocked.
              First try right-clicking the app in Applications and choosing{" "}
              <strong>Open</strong>. If that still fails, open Terminal and run:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-(--border) bg-[rgba(17,17,16,0.05)] px-3 py-2 font-mono text-xs text-(--foreground)">
              xattr -cr /Applications/Recast.app
            </pre>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-(--muted)">
            <section>
              <h2 className="text-base font-medium text-(--foreground)">
                First-time setup
              </h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>
                  Open the downloaded DMG and drag Recast to Applications
                </li>
                <li>
                  Right-click Recast in Applications and choose{" "}
                  <strong>Open</strong> (required for unsigned builds)
                </li>
                <li>
                  If macOS still says the app is damaged or blocked, open{" "}
                  <strong>Terminal</strong>, run{" "}
                  <code>xattr -cr /Applications/Recast.app</code>, then try
                  opening Recast again
                </li>
                <li>
                  Follow the in-app wizard to choose and download an AI model
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-medium text-(--foreground)">
                Requirements
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>macOS on Apple Silicon (M1 or newer)</li>
                <li>Local AI engine (set up automatically by Recast)</li>
                <li>~2–3 GB free disk space for the AI model</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-(--foreground)">
                Keyboard shortcut
              </h2>
              <p className="mt-2">
                Press{" "}
                <kbd className="rounded border border-(--border) bg-[rgba(17,17,16,0.04)] px-1.5 py-0.5 font-mono text-xs text-(--foreground)">
                  Option+Tab
                </kbd>{" "}
                to show or hide Recast from anywhere on your Mac.
              </p>
            </section>
          </div>

          <p className="mt-8 text-sm text-(--muted)">
            <Link href="/" className="underline underline-offset-2 hover:text-(--foreground)">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
