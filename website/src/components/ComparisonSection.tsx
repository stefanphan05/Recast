export default function ComparisonSection() {
  return (
    <section className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="site-card rounded-3xl p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-(--muted)">
              Recast is for
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-(--foreground) md:text-5xl">
              rewriting.
            </h2>
            <ul className="mt-6 space-y-3 text-(--muted)">
              <li>One hotkey away from any app</li>
              <li>Tone presets built for real messages</li>
              <li>Private, local AI on your Mac</li>
              <li>No prompts to craft every time</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-dashed border-[rgba(243,230,208,0.12)] bg-[rgba(255,255,255,0.02)] p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[rgba(245,237,225,0.42)]">
              ChatGPT tabs are for
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-[rgba(245,237,225,0.42)] md:text-5xl">
              everything else.
            </h2>
            <ul className="mt-6 space-y-3 text-[rgba(245,237,225,0.42)]">
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
