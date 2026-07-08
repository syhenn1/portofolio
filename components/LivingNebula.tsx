"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getIntroEntered, subscribeIntroEntered } from "@/lib/introState";

interface Props {
  pauseUntilEntered?: boolean;
  // Re-enables the shader's cursor-lensing warp — off by default (it read as
  // a second, uncoordinated cursor-reactive element fighting the
  // MagneticCursor blob), opted back in just for the Start screen.
  mouseReactive?: boolean;
}

// Adapted from the "living-nebula" shader (21st.dev/@dhiluxui) — recolored from
// its original deep-space palette to a pale cream base with soft orange/rust
// cloud wisps at low blend strength, so it reads as a textured backdrop (like
// the dot grid it replaces) instead of turning the whole page dark.
//
// Scoped usage only (Hero, IntroGate) — renders into its nearest positioned
// ancestor via absolute inset-0, not the global viewport.
export default function LivingNebula({ pauseUntilEntered = true, mouseReactive = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float iMouseActive;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        float t  = iTime * 0.1;

        if (iMouseActive > 0.5) {
          vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
          float md = length(uv - mouse);
          vec2 offset = normalize(uv - mouse) / (md * 60.0 + 0.001);
          uv += offset * smoothstep(0.35, 0.0, md);
        }

        float angle = t * 0.3;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 p = rot * uv;

        float c1 = fbm(p * 2.0 + vec2(t, -t));
        float c2 = fbm(p * 4.0 - vec2(-t, t));

        vec3 base       = vec3(0.969, 0.969, 0.957); // matches site --bg #f7f7f4
        vec3 gasColor1  = vec3(1.0, 0.416, 0.0);      // --em #ff6a00
        vec3 gasColor2  = vec3(0.70, 0.278, 0.0);     // deep rust #b34700
        vec3 color      = base;

        color = mix(color, gasColor1, smoothstep(0.4, 0.6, c1) * 0.30);
        color = mix(color, gasColor2, smoothstep(0.5, 0.7, c2) * 0.18);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2(-9999, -9999) },
      iMouseActive: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener("resize", onResize);
    onResize();

    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onMouseLeave: (() => void) | null = null;
    if (mouseReactive) {
      onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
        const x = (e.clientX - rect.left) / zoom;
        const y = (rect.bottom - e.clientY) / zoom; // Use rect.bottom - e.clientY for WebGL inverted-Y
        uniforms.iMouse.value.set(x, y);
        uniforms.iMouseActive.value = 1;
      };
      onMouseLeave = () => {
        uniforms.iMouseActive.value = 0;
      };
      window.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);
    }

    const renderFrame = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    // Paused while the intro splash covers the screen — it's fully hidden
    // behind that opaque layer anyway, so rendering it is wasted GPU work,
    // right when the intro's own Lanyard WebGL context needs the headroom.
    // Not applied to the instance mounted inside IntroGate itself, which is
    // the intro screen's own background and needs to run precisely then.
    const startLoop = () => renderer.setAnimationLoop(renderFrame);
    const stopLoop = () => renderer.setAnimationLoop(null);

    let unsubscribe = () => {};
    if (!pauseUntilEntered || getIntroEntered()) {
      startLoop();
    } else {
      renderFrame(); // one static frame so it's not a blank canvas until revealed
      unsubscribe = subscribeIntroEntered((val) => {
        if (val) startLoop();
        else stopLoop();
      });
    }

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
      if (onMouseLeave) container.removeEventListener("mouseleave", onMouseLeave);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      canvas.parentNode?.removeChild(canvas);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [mouseReactive, pauseUntilEntered]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
