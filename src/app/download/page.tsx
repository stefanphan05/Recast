import Link from "next/link";

const GITHUB_RELEASES_URL =
  "https://github.com/stefanphan05/MessageRewriter/releases/latest";

export const metadata = {
  title: "Download Recast for Mac",
  description: "Download Recast for macOS and rewrite messages with local AI.",
};

export default function DownloadPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          Recast for Mac
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
          Download for Mac
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          Rewrite messages in different styles using AI that runs entirely on
          your Mac. Your text never leaves your device.
        </p>

        <a
          href={GITHUB_RELEASES_URL}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-neutral-50 dark:text-neutral-950"
        >
          Download for Mac (Apple Silicon)
        </a>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <section>
            <h2 className="text-base font-medium text-neutral-950 dark:text-neutral-50">
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
            <h2 className="text-base font-medium text-neutral-950 dark:text-neutral-50">
              Requirements
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>macOS on Apple Silicon (M1 or newer)</li>
              <li>Local AI engine (set up automatically by Recast)</li>
              <li>~2–3 GB free disk space for the AI model</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-neutral-950 dark:text-neutral-50">
              Keyboard shortcut
            </h2>
            <p className="mt-2">
              Press <kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">Option+Tab</kbd>{" "}
              to show or hide Recast from anywhere on your Mac.
            </p>
          </section>
        </div>

        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/" className="underline underline-offset-2">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
