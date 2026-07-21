"use client";

// A curved, momentum-scrolling image gallery rendered with WebGL (ogl).
// Reimplemented from the well-known "Circular Gallery" pattern (the same
// family of component as reactbits.dev's version) — not a byte-for-byte
// copy of any specific source, but the same core approach: a row of planes
// bent along an arc via the vertex shader, dragged/scrolled with inertia,
// and looped infinitely by re-positioning planes that scroll off-screen.
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

export interface GalleryItem {
  image: string;
}

interface CircularGalleryProps {
  items: GalleryItem[];
  bend?: number;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  /** Fires with the index of the item currently under the pointer, or null when none. */
  onHover?: (index: number | null) => void;
  /** Fires with the index of the item clicked (not dragged); the gallery also scrolls to center it. */
  onSelect?: (index: number) => void;
}

type GL = Renderer["gl"];
type ScreenSize = { width: number; height: number };
type ViewportSize = { width: number; height: number };

// Auto-advance: how long each card stays focused before moving to the next, in ms.
const AUTO_ADVANCE_MS = 4000;

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

interface MediaParams {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: ScreenSize;
  viewport: ViewportSize;
  bend: number;
  borderRadius: number;
}

class Media {
  extra = 0;
  geometry!: Plane;
  gl!: GL;
  image!: string;
  index!: number;
  length!: number;
  scene!: Transform;
  screen!: ScreenSize;
  viewport!: ViewportSize;
  bend!: number;
  borderRadius!: number;
  program!: Program;
  plane!: Mesh;
  scale = 1;
  padding = 2;
  width = 1;
  widthTotal = 1;
  x = 0;
  isBefore = false;
  isAfter = false;

  constructor(params: MediaParams) {
    Object.assign(this, params);
    this.createShader();
    this.createMesh();
    this.onResize({ screen: params.screen, viewport: params.viewport });
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: /* glsl */ `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 3.5 + uTime) * 0.5 + cos(p.y * 2.0 + uTime) * 0.5) * uSpeed * 0.6;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edge = 0.002;
          float alpha = 1.0 - smoothstep(-edge, edge, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll: { current: number; last: number }, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B = Math.abs(this.bend);
      const R = (H * H + B * B) / (2 * B);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(R * R - effectiveX * effectiveX, 0));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    const speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: ViewportSize } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class GalleryApp {
  container: HTMLElement;
  items: GalleryItem[];
  bend: number;
  borderRadius: number;
  scrollSpeed: number;
  onHover?: (index: number | null) => void;
  onSelect?: (index: number) => void;
  lastHovered: number | null = null;
  downX = 0;
  downY = 0;
  dragMoved = false;
  autoIndex = 0;
  autoTimer = 0;

  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  screen: ScreenSize = { width: 0, height: 0 };
  viewport: ViewportSize = { width: 0, height: 0 };

  scroll = { ease: 0.05, current: 0, target: 0, last: 0 };
  isDown = false;
  start = 0;
  raf = 0;
  lastFrameTime = 0;
  boundOnResize: () => void;
  boundOnPointerDown: (e: PointerEvent) => void;
  boundOnPointerMove: (e: PointerEvent) => void;
  boundOnPointerUp: (e: PointerEvent) => void;
  boundOnContainerPointerMove: (e: PointerEvent) => void;
  boundOnPointerLeave: () => void;

  constructor(container: HTMLElement, opts: Omit<CircularGalleryProps, "items"> & { items: GalleryItem[] }) {
    this.container = container;
    this.items = opts.items;
    this.bend = opts.bend ?? 3;
    this.borderRadius = opts.borderRadius ?? 0.05;
    this.scrollSpeed = opts.scrollSpeed ?? 2;
    // Snappy by default: auto-advance should read as "snap to the next
    // card, then hold" rather than a continuous drift — a slow ease left
    // it still visibly gliding well into each 1.5s focus window.
    this.scroll.ease = opts.scrollEase ?? 0.18;
    this.onHover = opts.onHover;
    this.onSelect = opts.onSelect;

    this.boundOnResize = this.onResize.bind(this);
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);
    this.boundOnContainerPointerMove = this.onContainerPointerMove.bind(this);
    this.boundOnPointerLeave = this.onPointerLeave.bind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    if (this.medias[0]) this.focus(this.medias[0]);
    this.addEventListeners();
    this.lastFrameTime = performance.now();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 20, widthSegments: 20 });
  }

  createMedias() {
    this.medias = this.items.map(
      (item, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: item.image,
          index,
          length: this.items.length,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          bend: this.bend,
          borderRadius: this.borderRadius,
        })
    );
  }

  onPointerDown(e: PointerEvent) {
    this.isDown = true;
    this.dragMoved = false;
    this.downX = e.clientX;
    this.downY = e.clientY;
    this.scroll.last = this.scroll.current;
    this.start = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    this.onPointerLeave();
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDown) return;
    if (Math.abs(e.clientX - this.downX) > 4 || Math.abs(e.clientY - this.downY) > 4) {
      this.dragMoved = true;
    }
    const distance = (this.start - e.clientX) * (0.04 * this.scrollSpeed);
    this.scroll.target = this.scroll.last + distance;
  }

  onPointerUp(e: PointerEvent) {
    this.isDown = false;
    if (!this.dragMoved) this.selectAt(e.clientX);
  }

  // Approximates hit-testing in the WebGL scene: projects a screen point's
  // X into world space and picks whichever plane's x-span contains it
  // (cards only vary along X, so Y isn't needed).
  hitTest(clientX: number): Media | null {
    if (!this.viewport.width) return null;
    const rect = this.container.getBoundingClientRect();
    if (!rect.width) return null;
    const nx = (clientX - rect.left) / rect.width;
    const worldX = (nx - 0.5) * this.viewport.width;

    let found: Media | null = null;
    let bestDist = Infinity;
    for (const media of this.medias) {
      const half = media.plane.scale.x / 2;
      const dist = Math.abs(media.plane.position.x - worldX);
      if (dist < half && dist < bestDist) {
        bestDist = dist;
        found = media;
      }
    }
    return found;
  }

  // Used by a DOM tooltip to track "which card is under the cursor".
  onContainerPointerMove(e: PointerEvent) {
    if (this.isDown) return;
    const found = this.hitTest(e.clientX)?.index ?? null;
    if (found !== this.lastHovered) {
      this.lastHovered = found;
      this.onHover?.(found);
    }
  }

  // A genuine click (not a drag) scrolls the clicked card to center and
  // reports its index so a caller can show a fuller description. Also
  // resyncs the auto-advance cycle to continue on from here.
  selectAt(clientX: number) {
    const media = this.hitTest(clientX);
    if (!media) return;
    this.focus(media);
    this.autoIndex = media.index;
    this.autoTimer = 0;
  }

  // Centers a card and reports its index, shared by manual clicks and auto-advance.
  focus(media: Media) {
    this.scroll.target = media.x - media.extra;
    this.onSelect?.(media.index);
  }

  onPointerLeave() {
    if (this.lastHovered !== null) {
      this.lastHovered = null;
      this.onHover?.(null);
    }
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  update() {
    const now = performance.now();
    const dt = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Auto-advance: focus the next card every AUTO_ADVANCE_MS — pauses
    // only while actively dragging (resets so it doesn't immediately jump
    // right after you let go), never on mere hover, since a resting
    // cursor is the common case and pausing on that made a carousel
    // elsewhere on this site look permanently stuck.
    if (this.isDown) {
      this.autoTimer = 0;
    } else {
      this.autoTimer += dt;
      if (this.autoTimer >= AUTO_ADVANCE_MS && this.medias.length > 0) {
        this.autoTimer = 0;
        this.autoIndex = (this.autoIndex + 1) % this.medias.length;
        this.focus(this.medias[this.autoIndex]);
      }
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";

    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });

    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("pointerdown", this.boundOnPointerDown);
    window.addEventListener("pointermove", this.boundOnPointerMove);
    window.addEventListener("pointerup", this.boundOnPointerUp);
    this.container.addEventListener("pointermove", this.boundOnContainerPointerMove);
    this.container.addEventListener("pointerleave", this.boundOnPointerLeave);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("pointerdown", this.boundOnPointerDown);
    window.removeEventListener("pointermove", this.boundOnPointerMove);
    window.removeEventListener("pointerup", this.boundOnPointerUp);
    this.container.removeEventListener("pointermove", this.boundOnContainerPointerMove);
    this.container.removeEventListener("pointerleave", this.boundOnPointerLeave);
    if (this.gl?.canvas.parentNode === this.container) {
      this.container.removeChild(this.gl.canvas);
    }
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export function CircularGallery({ items, bend = 3, borderRadius = 0.05, scrollSpeed = 2, scrollEase = 0.18, onHover, onSelect }: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    const app = new GalleryApp(containerRef.current, { items, bend, borderRadius, scrollSpeed, scrollEase, onHover, onSelect });
    return () => app.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, bend, borderRadius, scrollSpeed, scrollEase]);

  return <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }} />;
}
