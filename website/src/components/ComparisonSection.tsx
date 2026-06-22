export default function ComparisonSection() {
  return (
    <section className="border-b border-black/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="site-card rounded-3xl p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
              Recast is for
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-neutral-950 md:text-5xl">
              rewriting.
            </h2>
            <ul className="mt-6 space-y-3 text-neutral-600">
              <li>One hotkey away from any app</li>
              <li>Tone presets built for real messages</li>
              <li>Private, local AI on your Mac</li>
              <li>No prompts to craft every time</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/50 p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-400">
              ChatGPT tabs are for
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-neutral-400 md:text-5xl">
              everything else.
            </h2>
            <ul className="mt-6 space-y-3 text-neutral-400">
              <li>Copy-paste your message every time</li>
              <li>Explain the tone you want again</li>
              <li>Switch apps and lose your flow</li>
              <li>Wonder where your text went</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
