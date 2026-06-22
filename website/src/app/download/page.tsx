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
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500">
            Recast for Mac
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-tight text-neutral-950">
            Download for Mac
          </h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-600">
            Rewrite messages in different styles using AI that runs entirely on
            your Mac. Your text never leaves your device.
          </p>

          <DownloadButton className="mt-8">
            Download for Mac (Apple Silicon)
          </DownloadButton>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
            <section>
              <h2 className="text-base font-medium text-neutral-950">
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
                  Follow the in-app wizard to choose and download an AI model
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-medium text-neutral-950">
                Requirements
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>macOS on Apple Silicon (M1 or newer)</li>
                <li>Local AI engine (set up automatically by Recast)</li>
                <li>~2–3 GB free disk space for the AI model</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-neutral-950">
                Keyboard shortcut
              </h2>
              <p className="mt-2">
                Press{" "}
                <kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">
                  Option+Tab
                </kbd>{" "}
                to show or hide Recast from anywhere on your Mac.
              </p>
            </section>
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            <Link href="/" className="underline underline-offset-2">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
