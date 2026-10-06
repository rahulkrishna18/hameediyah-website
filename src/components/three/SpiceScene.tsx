"use client";

import { Environment, Lightformer, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { createSpiceGeometry, spicePalette, spiceScale, type SpiceKind } from "./spiceGeometries";

const KINDS: SpiceKind[] = ["fennel", "cumin", "white-pepper", "almond", "cashew"];

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Layout = "hero" | "field";

type SpiceSceneProps = {
  active: boolean;
  layout?: Layout;
  perKind?: number;
  highlight?: SpiceKind | null;
  /** 0..1 scroll progress supplied by the parent section */
  progress?: RefObject<number>;
  interactive?: boolean;
  reduced?: boolean;
  background?: string;
  className?: string;
};

type Instance = {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  phase: number;
  speed: number;
  scale: number;
};

function placeInstances(kind: SpiceKind, count: number, layout: Layout, seed: number): Instance[] {
  const rand = mulberry32(seed);
  const list: Instance[] = [];
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (layout === "hero") {
      // Keep the headline (left/centre) clear: favour the right edge and the corners
      // Keep the headline (left / centre) clear: most spices sit to the right, a few along the edges
      const side = rand();
      if (side < 0.75) {
        x = 2.6 + rand() * 4;
        y = -3.4 + rand() * 6.8;
      } else {
        x = -6.4 + rand() * 5;
        y = rand() < 0.5 ? -4 + rand() * 1.2 : 2.8 + rand() * 1.2;
      }
      z = -5 + rand() * 5.4;
    } else {
      x = -7 + rand() * 14;
      y = -4 + rand() * 8;
      z = -6 + rand() * 7.5;
    }
    list.push({
      pos: new THREE.Vector3(x, y, z),
      rot: new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
      spin: new THREE.Vector3((rand() - 0.5) * 0.22, (rand() - 0.5) * 0.28, (rand() - 0.5) * 0.18),
      phase: rand() * Math.PI * 2,
      speed: 0.25 + rand() * 0.35,
      scale: (0.85 + rand() * 0.75) * spiceScale[kind] * (layout === "hero" ? 1.25 : 1.1),
    });
  }
  return list;
}

function SpiceInstances({
  kind,
  count,
  layout,
  seed,
  highlight,
}: {
  kind: SpiceKind;
  count: number;
  layout: Layout;
  seed: number;
  highlight?: SpiceKind | null;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createSpiceGeometry(kind), [kind]);
  const base = useMemo(() => new THREE.Color(spicePalette[kind].color), [kind]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: base.clone(),
        roughness: spicePalette[kind].roughness,
        metalness: 0,
      }),
    [base, kind],
  );
  const instances = useMemo(() => placeInstances(kind, count, layout, seed), [kind, count, layout, seed]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const emphasis = useRef(1);
  const dim = useMemo(() => new THREE.Color("#2a211a"), []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const target = !highlight ? 1 : highlight === kind ? 1.45 : 0.7;
    emphasis.current = THREE.MathUtils.damp(emphasis.current, target, 3.5, delta);
    material.color.copy(base).lerp(dim, highlight && highlight !== kind ? 0.55 : 0);
    for (let i = 0; i < instances.length; i++) {
      const d = instances[i];
      dummy.position.set(d.pos.x, d.pos.y + Math.sin(t * d.speed + d.phase) * 0.22, d.pos.z + Math.cos(t * d.speed * 0.7 + d.phase) * 0.12);
      dummy.rotation.set(d.rot.x + t * d.spin.x, d.rot.y + t * d.spin.y, d.rot.z + t * d.spin.z);
      dummy.scale.setScalar(d.scale * emphasis.current);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}

function Scene({
  layout,
  perKind,
  highlight,
  progress,
  interactive,
}: Required<Pick<SpiceSceneProps, "layout" | "perKind" | "interactive">> & Pick<SpiceSceneProps, "highlight" | "progress">) {
  const group = useRef<THREE.Group>(null);
  // The canvas sits under page content (pointer-events: none), so read the pointer from the window.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress?.current ?? 0;
    const px = pointer.current.x;
    const py = pointer.current.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.2 + (p - 0.5) * 0.45, 2.2, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.14, 2.2, delta);
    const targetY = layout === "hero" ? p * 2.6 : (p - 0.5) * -2;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 2.6, delta);
  });

  return (
    <group ref={group}>
      {KINDS.map((kind, i) => (
        <SpiceInstances key={kind} kind={kind} count={perKind} layout={layout} seed={1907 + i * 97} highlight={highlight} />
      ))}
    </group>
  );
}

export default function SpiceScene({
  active,
  layout = "field",
  perKind = 14,
  highlight = null,
  progress,
  interactive = true,
  reduced = false,
  background,
  className,
}: SpiceSceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      frameloop={reduced || !active ? "demand" : "always"}
      camera={{ position: [0, 0, 9], fov: 34, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: !background, powerPreference: "high-performance" }}
      fallback={null}
      aria-hidden
    >
      {background && <color attach="background" args={[background]} />}
      <fog attach="fog" args={[background ?? "#12100e", 7, 17]} />
      <ambientLight intensity={0.35} color="#f4e2c4" />
      <directionalLight position={[4, 6, 6]} intensity={2.6} color="#ffdcaa" />
      <pointLight position={[-6, -3, 3]} intensity={40} distance={18} color="#d99a1e" />
      <pointLight position={[6, 3, -4]} intensity={18} distance={16} color="#8b4a2b" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.6} position={[0, 5, -3]} scale={[10, 4, 1]} color="#ffe2b8" />
        <Lightformer intensity={0.8} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#d99a1e" />
      </Environment>
      <Scene layout={layout} perKind={perKind} highlight={highlight} progress={progress} interactive={interactive} />
      <Preload all />
    </Canvas>
  );
}

