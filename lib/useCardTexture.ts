"use client";

import { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { basePath } from "@/lib/basePath";

// 8x8 transparent placeholder — a 1x1 image here previously triggered an
// intermittent "texSubImage2D: bad image data" WebGL error (and subsequent
// context loss) when drei's useTexture eagerly uploads it via gl.initTexture.
export const CARD_BLANK =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAADUlEQVR4nGNgGAUgAAABCAABgukLHQAAAABJRU5ErkJggg==";

const FRONT_UV = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

// Used by Lanyard (hero's hanging card) — needs the card.glb geometry and
// front/back texture compositing, wrapped in its own physics rig.
export function useCardTexture({
  frontImage = null,
  backImage = null,
  imageFit = "cover",
}: {
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
}) {
  const { nodes, materials } = useGLTF(`${basePath}/card.glb`) as any;

  const frontTex = useTexture(frontImage || CARD_BLANK);
  const backTex = useTexture(backImage || CARD_BLANK);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as HTMLImageElement;
    const W = baseImg?.width;
    const H = baseImg?.height;
    if (!W || !H) return baseMap;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;

    // Neutral dark base so card edges are not white (no color tint)
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(baseImg, 0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    const drawFitted = (img: HTMLImageElement, rect: typeof FRONT_UV) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image as HTMLImageElement, FRONT_UV);
    if (backImage && backTex.image) drawFitted(backTex.image as HTMLImageElement, BACK_UV);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  return { nodes, materials, cardMap };
}
