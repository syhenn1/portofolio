"use client";

import { motion } from "framer-motion";
import { timelineData } from "@/lib/data";
import { Carousel, Card, type CardType } from "@/components/ui/apple-cards-carousel";

function JourneyCardContent({ t }: { t: (typeof timelineData)[number] }) {
  const image = t.images?.[0];

  return (
    <div className="flex h-full flex-col">
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
        {t.desc}
      </p>

      {image && (
        <div
          className="relative mt-4 flex-1 min-h-0 overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--line)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}

// Horizontally swipeable cards (drag or touch-scroll), no rail/line. Tap a
// card to flip it in place and read the full story on its back.
export default function JourneyTimeline() {
  const cards: CardType[] = timelineData.map((t) => ({
    category: t.year,
    title: t.title,
    color: t.color,
    src: t.images?.[0]?.src,
    content: <JourneyCardContent t={t} />,
  }));

  return (
    <section className="relative z-2 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="slabel mb-3">career & growth</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            My <span className="gtx">Journey</span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm">Drag to browse, tap a card to flip it.</p>
        </motion.div>
      </div>

      <Carousel items={cards.map((card) => <Card key={card.title} card={card} />)} />
    </section>
  );
}
