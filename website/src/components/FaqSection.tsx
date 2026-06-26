const FAQ_ITEMS = [
  {
    question: "Is Recast free?",
    answer:
      "Yes. Recast is free to download and use. You run AI locally on your Mac — no subscription required.",
  },
  {
    question: "Does my text get sent to the cloud?",
    answer:
      "No. Recast uses local AI that runs entirely on your Mac. Your messages are never uploaded to external servers.",
  },
  {
    question: "Which Macs are supported?",
    answer:
      "Recast requires macOS on Apple Silicon (M1 or newer). An AI model download (~2–3 GB) is needed on first run.",
  },
  {
    question: "Why does macOS block the app on first launch?",
    answer:
      "Current builds are unsigned, so macOS Gatekeeper may block them. Right-click Recast in Applications and choose Open, or run: xattr -cr /Applications/Recast.app",
  },
  {
    question: "How is this different from Grammarly or ChatGPT?",
    answer:
      "Recast is a lightweight Mac utility focused on quick rewrites with tone presets — not a full writing suite or general chatbot. It lives in your menu bar, works offline, and keeps everything local.",
  },
  {
    question: "What rewrite styles are available?",
    answer:
      "Correct, Shorter, Longer, Casual, Formal, Friendly, Direct, Polite, Gen Z (with intensity), and Flirty (with intensity).",
  },
] as const;

export default function FaqSection() {
  return (
    <section id="faq" className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">

        <div className="text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-(--foreground) md:text-5xl">
            FAQ
          </h2>
        </div>

        <div className="mt-10 space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="faq-item group rounded-2xl border border-[rgba(17,17,16,0.09)] bg-(--surface) px-6 py-4 open:pb-5 transition-colors hover:border-[rgba(17,17,16,0.16)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[rgba(17,17,16,0.72)] transition-colors group-open:text-(--foreground)">
                {item.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.38)] transition-all duration-200 group-open:rotate-45 group-open:border-[rgba(17,17,16,0.3)] group-open:text-[rgba(17,17,16,0.7)]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-(--muted)">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
