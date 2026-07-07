/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { useCardTexture } from '@/lib/useCardTexture';

extend({ MeshLineGeometry, MeshLineMaterial });

interface Props {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardWidth?: number;
}

export default function Lanyard({
  position = [0, 0, 15],
  gravity = [0, -40, 0],
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardWidth = 1.2,
}: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <div className="relative z-0 w-full h-full pointer-events-none">
      <Canvas
        style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}
        camera={{ position, fov }}
        dpr={[1, 2]}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
        </Suspense>
        <Environment blur={0.75}>
          <Lightformer intensity={2}  color="#f0ece8" position={[0, -1, 5]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2.5} color="#dce4f0" position={[1, 1, 1]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3}  color="#e8e8ff" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardWidth?: number;
}

const ANCHOR_X = 2.2;
const ANCHOR_Y = 4.5;

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardWidth = 1.2,
}: BandProps) {
  const band  = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1    = useRef<any>(null);
  const j2    = useRef<any>(null);
  const j3    = useRef<any>(null);
  const card  = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials, cardMap } = useCardTexture({ frontImage, backImage, imageFit });

  // Text lanyard texture: repeating role labels along the cord
  const lanyardTex = useMemo(() => {
    // 2× resolution for sharp text on HiDPI displays
    const SC = 2;
    const W  = 512 * SC;
    const H  = 40  * SC;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(SC, SC);

    // Background with subtle gradient
    const bg = ctx.createLinearGradient(0, 0, 0, 40);
    bg.addColorStop(0,   '#1a1a1a');
    bg.addColorStop(0.5, '#222222');
    bg.addColorStop(1,   '#1a1a1a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 40);

    // Thin accent lines top and bottom
    ctx.fillStyle = 'rgba(255,106,0,0.4)';
    ctx.fillRect(0, 0, 512, 1.5);
    ctx.fillRect(0, 38.5, 512, 1.5);

    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.06em';
    const midY = 20;

    const SEP = '  ✦  ';
    const A = 'FULLSTACK DEV';
    const B = 'PROJECT MANAGER';
    const chunk = A + SEP + B + SEP;

    // measure with current font
    const chunkW = ctx.measureText(chunk).width;

    let x = 0;
    while (x < 512 + chunkW) {
      ctx.fillStyle = '#f0ece8';
      ctx.fillText(A, x, midY);
      const wA = ctx.measureText(A).width;

      ctx.fillStyle = '#ff6a00';
      ctx.fillText(SEP, x + wA, midY);
      const wSep = ctx.measureText(SEP).width;

      ctx.fillStyle = '#f0ece8';
      ctx.fillText(B, x + wA + wSep, midY);
      const wB = ctx.measureText(B).width;

      ctx.fillStyle = '#ff6a00';
      ctx.fillText(SEP, x + wA + wSep + wB, midY);

      x += chunkW;
    }

    // Edge vignette
    const g = ctx.createLinearGradient(0, 0, 0, 40);
    g.addColorStop(0,    'rgba(0,0,0,0.6)');
    g.addColorStop(0.18, 'rgba(0,0,0,0)');
    g.addColorStop(0.82, 'rgba(0,0,0,0)');
    g.addColorStop(1,    'rgba(0,0,0,0.6)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 40);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = 'chordal';
    return c;
  });
  const [dragged, drag]   = useState<false | THREE.Vector3>(false);
  const [hovered, hover]  = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2,    [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3,    [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.85, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      // Clamp the drag to stay within the canvas's own visible frustum so the
      // card can never be dragged past the edge of its render area and "disappear".
      const px = THREE.MathUtils.clamp(state.pointer.x, -0.82, 0.82);
      const py = THREE.MathUtils.clamp(state.pointer.y, -0.82, 0.82);
      vec.set(px, py, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(r => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const d = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <RigidBody position={[ANCHOR_X, ANCHOR_Y, 0]} ref={fixed} {...segmentProps} type="fixed" />
      <RigidBody position={[ANCHOR_X, ANCHOR_Y - 1, 0]} ref={j1} {...segmentProps} type="dynamic">
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[ANCHOR_X, ANCHOR_Y - 2, 0]} ref={j2} {...segmentProps} type="dynamic">
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[ANCHOR_X, ANCHOR_Y - 3, 0]} ref={j3} {...segmentProps} type="dynamic">
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[ANCHOR_X, ANCHOR_Y - 4.5, 0]}
        ref={card}
        {...segmentProps}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
      >
        <CuboidCollider args={[0.8, 1.125, 0.01]} />
        <group
          scale={2.5}
          position={[0, -1.2, -0.05]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerUp={(e: any) => {
            e.target.releasePointerCapture(e.pointerId);
            drag(false);
          }}
          onPointerDown={(e: any) => {
            e.target.setPointerCapture(e.pointerId);
            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
          }}
        >
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              map={cardMap}
              map-anisotropy={16}
              roughness={0.22}
              metalness={0.88}
              reflectivity={0.9}
              clearcoat={0.4}
              clearcoatRoughness={0.12}
              envMapIntensity={0.65}
            />
          </mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </RigidBody>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={lanyardTex}
          repeat={[3, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
