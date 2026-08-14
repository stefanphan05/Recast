import DownloadButton from "@/components/DownloadButton";
import AppMockFrame from "@/components/AppMockFrame";
import UnderlineLink from "@/components/UnderlineLink";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="ambient-glow animate-blob left-[-10%] top-[-10%] h-[420px] w-[420px] bg-accent-1"
        aria-hidden="true"
      />
      <div
        className="ambient-glow animate-blob right-[5%] top-[10%] h-[380px] w-[380px] bg-accent-3"
        style={{ animationDelay: "-8s" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:gap-12 md:py-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="md:py-28">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3.5 py-1.5 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-1" />
              Local AI for Mac
            </div>

            <h1
              className="animate-fade-up mt-7 text-[clamp(2.6rem,5.2vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-foreground"
              style={{ animationDelay: "0.08s" }}
            >
              Write with
              <br />
              confidence.
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.18s" }}
            >
              Paste your message, pick a tone — fix grammar, sound professional,
              write like Gen Z, or keep it casual — and get a rewritten version
              in seconds. No more copy-pasting into ChatGPT.
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.28s" }}
            >
              <DownloadButton />
              <UnderlineLink href="#features" showIcon={false} className="text-foreground">
                See how it works
              </UnderlineLink>
            </div>

            <p
              className="animate-fade-up mt-5 font-mono text-xs tracking-wide text-muted-foreground/70"
              style={{ animationDelay: "0.38s" }}
            >
              Free · Apple Silicon · Your text stays on your Mac
            </p>
          </div>

          <div className="animate-scale-in relative">
            <AppMockFrame
              variant="hero"
              alt="Recast rewrite interface on Mac"
              className="aspect-[4/3] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
