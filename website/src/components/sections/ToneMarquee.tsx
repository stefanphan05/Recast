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
    <div className="relative overflow-hidden border-b border-t border-border bg-accent/40 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent" />

      <div className="flex animate-marquee items-center gap-0">
        {items.map((tone, i) => (
          <span key={`${tone}-${i}`} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 font-mono text-sm text-muted-foreground">
              {tone}
            </span>
            <span className="mx-3 h-[3px] w-[3px] shrink-0 rounded-full bg-muted-foreground/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
