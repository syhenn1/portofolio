"use client";

// Shared flag so components outside IntroGate (e.g. LivingNebula) can know
// whether the intro splash is still covering the screen — defaults to true
// so pages that never mount IntroGate (case-study pages) aren't affected.
type Listener = (entered: boolean) => void;

let entered = true;
const listeners = new Set<Listener>();

export function setIntroEntered(value: boolean) {
  entered = value;
  listeners.forEach((l) => l(value));
}

export function getIntroEntered() {
  return entered;
}

export function subscribeIntroEntered(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
