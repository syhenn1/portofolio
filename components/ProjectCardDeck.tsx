"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import AtroposProjectCard from "@/components/AtroposProjectCard";
import type { Project } from "@/lib/data";

// One horizontal row, one constant vertical center (top: 50%, y: "-50%" on every
// card below) — the waiting stack on the right, the active card sweeping
// through the middle, and the finished pile on the left all sit on the exact
// same line. Nothing ever drops below another; only x/scale/rotate change.
const P_ARRIVE   = 0.4;  // sweep progress where the incoming card reaches center
const P_HOLD_END = 0.62; // sweep progress where it starts leaving center for the pile

const CARD_W = 300;
const CARD_H = 400;

const ENTER_LEFT     = 122; // % — offscreen right, where a card's sweep begins
const CENTER_LEFT    = 68;  // % — the resting/interactive spot, clear of the info panel
const PILE_BASE_LEFT = 17;
const PILE_STEP_LEFT = 3;
const QUEUE_BASE_LEFT = 102;
const QUEUE_STEP_LEFT = 6.5;
const QUEUE_VISIBLE   = 3;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic  = (t: number) => t * t * t;

function pileSlot(index: number) {
  return {
    left: PILE_BASE_LEFT + index * PILE_STEP_LEFT,
    scale: 0.56 + Math.min(index, 6) * 0.015,
    z: 10 + index, // later arrivals sit on top of the pile
  };
}

interface Props {
  projects: Project[];
  activeIndex: number;
  sweep: MotionValue<number>;
}

export default function ProjectCardDeck({ projects, activeIndex, sweep }: Props) {
  const active = projects[activeIndex];
  const pile = projects.slice(0, activeIndex);
  const queue = projects.slice(activeIndex + 1, activeIndex + 1 + QUEUE_VISIBLE);
  const activeSlot = pileSlot(activeIndex);

  const left = useTransform(sweep, (s) => {
    if (s < P_ARRIVE) {
      const t = easeOutCubic(s / P_ARRIVE);
      return `${ENTER_LEFT + (CENTER_LEFT - ENTER_LEFT) * t}%`;
    }
    if (s < P_HOLD_END) return `${CENTER_LEFT}%`;
    const t = easeInCubic((s - P_HOLD_END) / (1 - P_HOLD_END));
    return `${CENTER_LEFT + (activeSlot.left - CENTER_LEFT) * t}%`;
  });

  const scale = useTransform(sweep, (s) => {
    if (s < P_HOLD_END) return 1;
    const t = easeInCubic((s - P_HOLD_END) / (1 - P_HOLD_END));
    return 1 + (activeSlot.scale - 1) * t;
  });

  const opacity = useTransform(sweep, [0, 0.14], [0, 1]);

  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      {/* Upcoming — a stack peeking in from the right, waiting its turn */}
      {queue.map((p, i) => (
        <div
          key={p.slug}
          className="absolute"
          style={{
            top: "50%",
            left: `${QUEUE_BASE_LEFT + i * QUEUE_STEP_LEFT}%`,
            width: CARD_W,
            height: CARD_H,
            transform: `translate(-50%, -50%) scale(${0.58 - i * 0.04}) rotate(${i % 2 ? 2 : -2}deg)`,
            zIndex: QUEUE_VISIBLE - i,
            opacity: 0.6 - i * 0.15,
          }}
        >
          <AtroposProjectCard project={p} interactive={false} />
        </div>
      ))}

      {/* Finished — piled up on the left, most recently arrived on top */}
      {pile.map((p, i) => {
        const slot = pileSlot(i);
        return (
          <div
            key={p.slug}
            className="absolute"
            style={{
              top: "50%",
              left: `${slot.left}%`,
              width: CARD_W,
              height: CARD_H,
              transform: `translate(-50%, -50%) scale(${slot.scale}) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
              zIndex: slot.z,
            }}
          >
            <AtroposProjectCard project={p} href={`/projects/${p.slug}`} />
          </div>
        );
      })}

      {/* Active — sweeps right → center → left as the user scrolls */}
      {active && (
        <motion.div
          className="absolute"
          style={{
            top: "50%",
            left,
            width: CARD_W,
            height: CARD_H,
            x: "-50%",
            y: "-50%",
            scale,
            opacity,
            zIndex: 20,
          }}
        >
          <AtroposProjectCard project={active} href={`/projects/${active.slug}`} />
        </motion.div>
      )}
    </div>
  );
}
