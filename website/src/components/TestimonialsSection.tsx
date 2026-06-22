const TESTIMONIALS = [
  {
    quote:
      "I rewrite Slack messages five times a day. Recast is the first tool that actually feels built for that.",
    author: "Early beta tester",
    context: "Product designer",
  },
  {
    quote:
      "No more opening ChatGPT, pasting, explaining the tone I want, copying back. Option+Tab and I'm done.",
    author: "Beta user",
    context: "Engineering lead",
  },
  {
    quote:
      "Knowing my drafts never leave my Mac sold me. Local AI for something this personal just makes sense.",
    author: "Early adopter",
    context: "Non-native English speaker",
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-b border-black/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl tracking-tight text-neutral-950 md:text-5xl">
            Grassroots love.
          </h2>
          <p className="mt-4 text-neutral-600">
            Early feedback from people who rewrite messages all day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.quote}
              className="site-card flex h-full flex-col rounded-3xl p-6 md:p-7"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-neutral-700">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-black/5 pt-4">
                <p className="text-sm font-medium text-neutral-950">
                  {item.author}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {item.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
