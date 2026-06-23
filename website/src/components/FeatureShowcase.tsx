"use client";

import { useState } from "react";
import DemoImage from "@/components/DemoImage";
import { DEMOS, type DemoId } from "@/lib/demos";

export default function FeatureShowcase() {
  const [activeId, setActiveId] = useState<DemoId>(DEMOS[0].id);
  const active = DEMOS.find((demo) => demo.id === activeId)!;

  return (
    <section id="features" className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl tracking-tight text-(--foreground) md:text-5xl">
            Everything you need to rewrite faster.
          </h2>
          <p className="mt-4 text-lg text-(--muted)">
            Built for non-native English speakers who want to sound natural —
            without the ChatGPT tab dance.
          </p>
        </div>

        <div className="mt-12">
          <DemoImage
            key={active.id}
            variant={active.id}
            alt={active.title}
            className="aspect-16/10 w-full shadow-[0_34px_100px_rgba(0,0,0,0.34)]"
          />
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              data-active={activeId === demo.id}
              onClick={() => setActiveId(demo.id)}
              className="feature-pill shrink-0 rounded-full border border-(--border) bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-(--muted)"
            >
              {demo.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <h3 className="font-display text-3xl leading-tight text-(--foreground)">
            {active.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-(--muted)">
            {active.description}
          </p>
          <p className="mt-3 text-xs text-(--muted) md:hidden">
            Swipe the pills above to explore each feature.
          </p>
        </div>
      </div>
    </section>
  );
}
