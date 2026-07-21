"use client";

// Same circle-follow mechanic as MorphingHeroText's name-hover reveal: an
// opaque circle (var(--em), same black-in-default-theme fill) tracks the
// cursor and clips a "pinned" layer underneath it. Here that pinned layer is
// a grid of ASCII characters sampled from the photo's own pixels — so instead
// of revealing alternate text, the moving black circle reveals the photo
// dissolving into colored ASCII art wherever it currently sits.
import { useEffect, useRef, useState, type CSSProperties } from "react";

const RAMP = " .:-=+*#%@";

type Cell = { char: string; color: string; x: number; y: number };

// The circle these characters sit on is opaque black, so a straight sample
// of the photo's own color would make dark pixels (hair, shadow) render as
// invisible black-on-black text. Rescale lightness proportionally into a
// [floor, 1] range — rather than clamping everything below a threshold to
// one flat value — so dark regions stay legible AND keep their relative
// shading (hair vs. shadow vs. skin crease), instead of crushing into a
// single flat gray that no longer reads as the photo.
const LIGHTNESS_FLOOR = 0.3;
function legibleOnBlack(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l2 = LIGHTNESS_FLOOR + l * (1 - LIGHTNESS_FLOOR);
  const c = (1 - Math.abs(2 * l2 - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l2 - c / 2;
  let [rr, gg, bb] = [0, 0, 0];
  if (h < 60) [rr, gg, bb] = [c, x, 0];
  else if (h < 120) [rr, gg, bb] = [x, c, 0];
  else if (h < 180) [rr, gg, bb] = [0, c, x];
  else if (h < 240) [rr, gg, bb] = [0, x, c];
  else if (h < 300) [rr, gg, bb] = [x, 0, c];
  else [rr, gg, bb] = [c, 0, x];
  return `rgb(${Math.round((rr + m) * 255)},${Math.round((gg + m) * 255)},${Math.round((bb + m) * 255)})`;
}

interface AsciiImageHoverProps {
  src: string;
  alt?: string;
  cellSize?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}

export default function AsciiImageHover({
  src,
  alt = "",
  cellSize = 9,
  radius = 110,
  className,
  style,
}: AsciiImageHoverProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cells, setCells] = useState<Cell[] | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(undefined);

  // Track the container's real size (ResizeObserver, not just window
  // resize) so the sample grid and pinned-layer sizing never go stale.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } =
        entry.borderBoxSize?.[0] ?? { inlineSize: el.offsetWidth, blockSize: el.offsetHeight };
      setContainerSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sample the photo into a character grid whenever its rendered size changes.
  useEffect(() => {
    if (containerSize.width < 1 || containerSize.height < 1) return;
    let cancelled = false;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const cols = Math.max(1, Math.round(containerSize.width / cellSize));
      const rows = Math.max(1, Math.round(containerSize.height / cellSize));
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, cols, rows);
      const data = ctx.getImageData(0, 0, cols, rows).data;
      const list: Cell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 60) continue; // transparent background — leave empty
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const ci = Math.min(RAMP.length - 1, Math.floor((1 - lum) * RAMP.length));
          list.push({
            char: RAMP[ci],
            color: legibleOnBlack(r, g, b),
            x: ((x + 0.5) / cols) * containerSize.width,
            y: ((y + 0.5) / rows) * containerSize.height,
          });
        }
      }
      if (!cancelled) setCells(list);
    };
    return () => {
      cancelled = true;
    };
  }, [src, cellSize, containerSize.width, containerSize.height]);

  // Lerp the circle toward the cursor and counter-translate the inner layer
  // so the ASCII grid stays pinned to the photo while only the circle window
  // moves — identical trick to MorphingHeroText.
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.2);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.2);
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Tracked geometrically off a window-level mousemove instead of this
  // element's own onMouseEnter/Leave. The photo's left edge overlaps the
  // name heading's own hover hit-box, which sits in a higher stacking
  // context — the browser hands that sliver's hover to the name text, which
  // fires a genuine mouseleave here and collapses the circle mid-sweep.
  // Checking "is the cursor inside this rect" ourselves sidesteps whichever
  // element the browser thinks is topmost, so the circle only closes once
  // the cursor truly leaves the photo's bounds.
  const isHoveredRef = useRef(false);
  useEffect(() => {
    const handleWindowMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
        return;
      }
      // clientX/Y are zoomed visual pixels, but this element's own transforms
      // live in the unzoomed local space of the (html { zoom: 1.3 })
      // ancestor — dividing here matches MorphingHeroText's same correction,
      // or the pinned ASCII layer drifts out of alignment with the photo.
      const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
      const p = { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
      mousePos.current = p;
      if (!isHoveredRef.current) {
        isHoveredRef.current = true;
        currentPos.current = p; // snap on entry, then lerp from there
        setIsHovered(true);
      }
    };
    window.addEventListener("mousemove", handleWindowMove);
    return () => window.removeEventListener("mousemove", handleWindowMove);
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", ...style }}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
      />

      <div
        ref={circleRef}
        className="absolute top-0 left-0 rounded-full overflow-hidden pointer-events-none"
        style={{
          background: "var(--em)",
          width: isHovered ? radius * 2 : 0,
          height: isHovered ? radius * 2 : 0,
          transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height",
        }}
      >
        {cells && (
          <div
            ref={innerRef}
            className="absolute"
            style={{ top: "50%", left: "50%", width: containerSize.width, height: containerSize.height, willChange: "transform" }}
          >
            {cells.map((cell, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: cell.x,
                  top: cell.y,
                  // Slightly larger than the sampling pitch so neighboring
                  // glyphs overlap a touch instead of leaving visible gaps —
                  // small monospace glyphs render gappy/faint at 1:1 sizing.
                  fontSize: cellSize * 1.4,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: cell.color,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {cell.char}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
