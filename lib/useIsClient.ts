"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// True only once hydrated on the client — lets portal-based components (CvModal,
// ImageLightbox) defer their `document.body` access without the extra
// render-then-setState effect that a plain `useState` + `useEffect` would need.
export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
