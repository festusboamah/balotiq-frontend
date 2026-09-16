"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { resolveSiteImageUrl, type SiteImageMap } from "@/lib/site-images";

const stories = [
  { slug: "homepage-carousel-governance", eyebrow: "Governance", title: "Participation people can trust", body: "From voter verification to the final certified result, every step is designed to feel clear, calm, and accountable." },
  { slug: "homepage-carousel-engage", eyebrow: "Balotiq Engage", title: "Make every audience moment count", body: "Purpose-built public voting for Ghanaian pageants, awards, and competitions — with verified payments and exact vote credit." },
  { slug: "homepage-carousel-organiser", eyebrow: "For organisers", title: "Run the room with confidence", body: "Bring event setup, voting operations, reconciliation, results, and settlement into one focused workspace." },
] as const;

export function GhanaStoriesCarousel({ images }: { images: SiteImageMap }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!playing || interacting || reduceMotion) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % stories.length), 7200);
    return () => window.clearInterval(timer);
  }, [playing, interacting, reduceMotion]);

  const story = stories[index];
  const storyImage = images[story.slug];
  const select = (next: number) => setIndex((next + stories.length) % stories.length);

  return <section aria-label="Balotiq in Ghana" className="relative left-1/2 w-screen -translate-x-1/2" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={() => setInteracting(false)}>
    <div role="region" aria-roledescription="carousel" aria-label="Balotiq in Ghana" className="relative min-h-[34rem] overflow-hidden bg-foreground text-background shadow-[0_28px_70px_-40px_rgba(18,26,46,.85)] sm:min-h-[42rem]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={storyImage.url} className="absolute inset-0" initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7 }}>
          {/* Admin-replaceable, backend-served src; next/image can't verify it at build time. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveSiteImageUrl(storyImage.url)} alt={storyImage.alt} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/35 to-foreground/5 sm:bg-gradient-to-r sm:from-foreground/95 sm:via-foreground/45 sm:to-transparent" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-end p-6 sm:min-h-[42rem] sm:p-10 lg:p-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={story.title} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{story.eyebrow}</p>
            <h3 className="mt-3 max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">{story.title}</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-background/75 sm:text-base">{story.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex max-w-xl flex-wrap items-center gap-2">
          <button type="button" onClick={() => select(index - 1)} aria-label="Previous Ghana story" className="flex size-11 cursor-pointer items-center justify-center border border-background/20 bg-foreground/30 text-background backdrop-blur hover:bg-background/10"><ArrowLeft className="size-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => select(index + 1)} aria-label="Next Ghana story" className="flex size-11 cursor-pointer items-center justify-center border border-background/20 bg-foreground/30 text-background backdrop-blur hover:bg-background/10"><ArrowRight className="size-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause Ghana stories" : "Play Ghana stories"} aria-pressed={!playing} className="min-h-11 cursor-pointer px-3 text-xs font-semibold text-background/75 hover:bg-background/10">{playing ? "Pause" : "Play"}</button>
          <span className="ml-auto text-xs font-semibold tabular-nums text-background/65">0{index + 1} / 0{stories.length}</span>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-3 grid max-w-6xl grid-cols-3 gap-2 px-5 sm:px-6">
      {stories.map((item, i) => <button type="button" key={item.title} onClick={() => select(i)} aria-label={`Show ${item.eyebrow}`} aria-current={i === index ? "true" : undefined} className={`min-h-11 cursor-pointer border px-3 text-xs font-semibold transition-colors ${i === index ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>{item.eyebrow}</button>)}
    </div>
  </section>;
}
