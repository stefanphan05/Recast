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
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl tracking-tight text-(--foreground) md:text-5xl">
            FAQ
          </h2>
          <p className="mt-4 text-(--muted)">
            Quick answers before you download.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="faq-item site-card group rounded-2xl px-5 py-4 open:pb-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-[rgba(245,237,225,0.82)]">
                {item.question}
                <span className="text-xl text-(--muted) transition-transform group-open:rotate-45">
                  +
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
