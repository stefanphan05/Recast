const TESTIMONIALS = [
  {
    src: "/reviews/review-1.png",
    alt: "Reddit review from u/Technoist",
    imageClassName: "scale-[1.5]",
  },
  {
    src: "/reviews/review-2.png",
    alt: "Reddit review from u/MultoSakalye",
    imageClassName: "scale-[1.5]",
  },
  {
    src: "/reviews/review-3.png",
    alt: "Third Reddit review screenshot",
    imageClassName: "scale-[1.5] object-bottom md:object-center",
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl tracking-tight text-(--foreground) md:text-5xl">
            Grassroots love.
          </h2>
          <p className="mt-4 text-(--muted)">
            Early feedback from people who rewrite messages all day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.src}
              className="site-card aspect-4/5 overflow-hidden rounded-4xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`block h-full w-full origin-center object-cover object-center ${item.imageClassName}`}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
