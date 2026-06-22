"use client";

import { useState } from "react";
import DemoImage from "@/components/DemoImage";
import { DEMOS, type DemoId } from "@/lib/demos";

export default function FeatureShowcase() {
  const [activeId, setActiveId] = useState<DemoId>(DEMOS[0].id);
  const active = DEMOS.find((demo) => demo.id === activeId)!;

  return (
    <section id="features" className="border-b border-black/5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl tracking-tight text-neutral-950 md:text-5xl">
            Everything you need to rewrite faster.
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Built for non-native English speakers who want to sound natural —
            without the ChatGPT tab dance.
          </p>
        </div>

        <div className="mt-12">
          <DemoImage
            key={active.id}
            src={active.imageSrc}
            alt={active.title}
            className="aspect-[16/10] w-full shadow-[0_30px_90px_rgba(26,26,26,0.12)]"
          />
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              data-active={activeId === demo.id}
              onClick={() => setActiveId(demo.id)}
              className="feature-pill shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-600 ring-1 ring-black/5"
            >
              {demo.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <h3 className="font-display text-3xl leading-tight text-neutral-950">
            {active.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            {active.description}
          </p>
          <p className="mt-3 text-xs text-neutral-400 md:hidden">
            Swipe the pills above to explore each feature.
          </p>
        </div>
      </div>
    </section>
  );
}
