const TONES = [
  "Correct",
  "Shorter",
  "Longer",
  "Casual",
  "Formal",
  "Friendly",
  "Direct",
  "Polite",
  "Gen Z",
  "Flirty",
] as const;

export default function ToneMarquee() {
  const items = [...TONES, ...TONES];

  return (
    <div className="site-divider relative overflow-hidden border-b border-t bg-[rgba(17,17,16,0.025)] py-5">
      {/* Edge fade-outs */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-(--background) to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-(--background) to-transparent" />

      <div className="flex animate-marquee items-center gap-0">
        {items.map((tone, i) => (
          <span key={`${tone}-${i}`} className="flex shrink-0 items-center">
            <span className="rounded-full border border-[rgba(17,17,16,0.1)] bg-[rgba(255,255,255,0.6)] px-4 py-1.5 text-sm text-(--muted) whitespace-nowrap">
              {tone}
            </span>
            <span className="mx-3 h-[3px] w-[3px] rounded-full bg-[rgba(17,17,16,0.18)] shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
