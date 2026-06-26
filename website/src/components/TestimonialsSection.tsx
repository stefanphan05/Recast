const TESTIMONIALS = [
  {
    src: "/reviews/review-1.png",
    alt: "Reddit review from u/Technoist",
    user: "u/Technoist",
    imageClassName: "scale-[1.5]",
  },
  {
    src: "/reviews/review-2.png",
    alt: "Reddit review from u/MultoSakalye",
    user: "u/MultoSakalye",
    imageClassName: "scale-[1.5]",
  },
  {
    src: "/reviews/review-3.png",
    alt: "Third Reddit review screenshot",
    user: "Via Reddit",
    imageClassName: "scale-[1.5] object-bottom md:object-center",
  },
] as const;

function RedditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 5.522 4.477 10 10 10s10-4.478 10-10zm-13.75 1.875c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25zm7.5 0c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25zM10 15c-1.79 0-3.16-.56-3.75-1.25h7.5C13.16 14.44 11.79 15 10 15zm6.56-6.25a1.875 1.875 0 0 0-1.22.45C14.27 8.5 12.24 8 10 8s-4.27.5-5.34 1.2A1.875 1.875 0 1 0 6.88 11c.16-.52.82-.9 1.75-1.1.62-.13 1.28-.2 1.97-.2s1.35.07 1.97.2c.93.2 1.59.58 1.75 1.1a1.875 1.875 0 1 0 2.24-2.25z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight text-(--foreground) md:text-5xl">
              People are<br className="hidden sm:block" /> switching.
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgba(17,17,16,0.1)] bg-(--surface) px-4 py-2 text-xs text-(--muted)">
            <RedditIcon />
            <span>Real reviews from r/macapps</span>
          </div>
        </div>

        {/* Screenshot grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.src}
              className="site-card group relative aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`block h-full w-full origin-center object-cover object-top transition-transform duration-700 group-hover:scale-[1.6] ${item.imageClassName}`}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 text-xs font-medium text-white/65">
                {item.user}
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
