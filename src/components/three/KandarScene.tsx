"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * The kandar: a bamboo shoulder pole with two baskets — "two basketfuls of nasi kandar
 * balanced on a pole" (NST, 2019). Built from primitives; no external assets.
 */

const POLE_HALF = 2.15;
const RIM_Y = -1.45;
const BASKET_DEPTH = 0.85;

function makeCanvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function bambooTexture() {
  return makeCanvasTexture(
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#b48a45");
      g.addColorStop(0.5, "#d8b56b");
      g.addColorStop(1, "#a57a3a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) {
        ctx.strokeStyle = `rgba(${90 + Math.random() * 40},${60 + Math.random() * 20},25,${0.08 + Math.random() * 0.12})`;
        ctx.lineWidth = Math.random() * 1.6;
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(w * 0.3, y + 1, w * 0.6, y - 1, w, y + (Math.random() - 0.5) * 2);
        ctx.stroke();
      }
    },
    1024,
    64,
  );
}

function weaveTexture() {
  return makeCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#8a6334";
      ctx.fillRect(0, 0, w, h);
      const cell = 16;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const over = ((x + y) / cell) % 2 === 0;
          const g = over ? ctx.createLinearGradient(x, y, x + cell, y) : ctx.createLinearGradient(x, y, x, y + cell);
          g.addColorStop(0, "#c49a5c");
          g.addColorStop(0.5, over ? "#f0d29a" : "#e2bd7e");
          g.addColorStop(1, "#b48a4e");
          ctx.fillStyle = g;
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
    },
    256,
    256,
  );
}

function Cord({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5), quaternion: q, length: len };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.011, 0.011, length, 6]} />
      <meshStandardMaterial color="#5a3b20" roughness={0.9} />
    </mesh>
  );
}

function BrassPot({ y = 0, scale = 1, lid = true }: { y?: number; scale?: number; lid?: boolean }) {
  const body = useMemo(() => {
    const pts = [
      [0.0, 0.0],
      [0.26, 0.0],
      [0.38, 0.08],
      [0.44, 0.22],
      [0.42, 0.38],
      [0.33, 0.5],
      [0.28, 0.56],
      [0.32, 0.6],
    ].map(([x, yy]) => new THREE.Vector2(x, yy));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  const lidGeo = useMemo(() => {
    const pts = [
      [0.0, 0.16],
      [0.08, 0.15],
      [0.2, 0.09],
      [0.33, 0.01],
      [0.34, 0.0],
    ].map(([x, yy]) => new THREE.Vector2(x, yy));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={[0, y, 0]} scale={scale}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#c69a45" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      {lid && (
        <group position={[0, 0.6, 0]}>
          <mesh geometry={lidGeo}>
            <meshStandardMaterial color="#b88a3a" metalness={1} roughness={0.32} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <sphereGeometry args={[0.045, 16, 12]} />
            <meshStandardMaterial color="#d6ad5c" metalness={1} roughness={0.25} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Basket({ side, weave, swayRef }: { side: -1 | 1; weave: THREE.Texture; swayRef: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const hang = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const lathe = useMemo(() => {
    const pts = [
      [0.0, -BASKET_DEPTH],
      [0.4, -BASKET_DEPTH],
      [0.52, -BASKET_DEPTH + 0.1],
      [0.6, -BASKET_DEPTH + 0.42],
      [0.64, -0.06],
      [0.66, 0.0],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 56);
  }, []);
  const rims = useMemo(
    () => [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((a) => new THREE.Vector3(Math.cos(a) * 0.62, RIM_Y + 0.12, Math.sin(a) * 0.62)),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const sway = swayRef.current ?? 0;
    g.rotation.z = Math.sin(t * 1.25 + side) * 0.035 + sway * 0.09 * side;
    g.rotation.x = Math.cos(t * 1.05 + side * 2) * 0.025;
  });

  return (
    <group ref={group} position={[side * POLE_HALF, -0.12, 0]}>
      {rims.map((r, i) => (
        <Cord key={i} from={hang} to={r} />
      ))}
      <group position={[0, RIM_Y + 0.12, 0]}>
        <mesh geometry={lathe}>
          <meshStandardMaterial map={weave} color="#ffffff" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.655, 0.03, 10, 64]} />
          <meshStandardMaterial color="#7a5028" roughness={0.8} />
        </mesh>
        {side === -1 ? (
          <BrassPot y={-0.72} scale={1.05} />
        ) : (
          <group>
            <BrassPot y={-0.75} scale={1.1} lid={false} />
            {/* cloth tied over the rice */}
            <mesh position={[0, -0.12, 0]} scale={[1, 0.42, 1]}>
              <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#2f5d45" roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.13, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.39, 0.018, 8, 48]} />
              <meshStandardMaterial color="#d99a1e" roughness={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

function Kandar({ progress }: { progress: RefObject<number> }) {
  const root = useRef<THREE.Group>(null);
  const sway = useRef(0);
  const lastP = useRef(0);
  const { viewport } = useThree();
  const fit = Math.min(1, viewport.width / 6.4);

  const bamboo = useMemo(() => bambooTexture(), []);
  const weave = useMemo(() => {
    const t = weaveTexture();
    t.repeat.set(10, 2.4);
    return t;
  }, []);
  useEffect(() => () => {
    bamboo.dispose();
    weave.dispose();
  }, [bamboo, weave]);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-POLE_HALF - 0.35, -0.2, 0),
        new THREE.Vector3(-1.2, -0.05, 0),
        new THREE.Vector3(0, 0.02, 0),
        new THREE.Vector3(1.2, -0.05, 0),
        new THREE.Vector3(POLE_HALF + 0.35, -0.2, 0),
      ]),
    [],
  );
  const pole = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.068, 18, false), [curve]);
  const nodes = useMemo(
    () =>
      [0.07, 0.2, 0.34, 0.47, 0.6, 0.73, 0.87].map((u) => {
        const p = curve.getPointAt(u);
        const tan = curve.getTangentAt(u);
        return { p, rz: Math.atan2(tan.y, tan.x) };
      }),
    [curve],
  );

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const vel = (p - lastP.current) / Math.max(delta, 1e-3);
    lastP.current = p;
    sway.current = THREE.MathUtils.damp(sway.current, THREE.MathUtils.clamp(vel * 0.6, -1, 1), 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.55 + p * Math.PI * 1.15, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.16 - p * 0.12, 3, delta);
    g.position.y = 1.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });

  return (
    <group scale={fit}>
      <group ref={root}>
        <mesh geometry={pole}>
          <meshStandardMaterial map={bamboo} roughness={0.5} metalness={0.02} />
        </mesh>
        {nodes.map(({ p, rz }, i) => (
          <mesh key={i} position={p} rotation={[0, Math.PI / 2, 0]} rotation-z={rz}>
            <torusGeometry args={[0.07, 0.013, 8, 28]} />
            <meshStandardMaterial color="#8e6a33" roughness={0.6} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} position={curve.getPointAt(s < 0 ? 0 : 1)} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.069, 0.069, 0.02, 18]} />
            <meshStandardMaterial color="#7d5a2b" roughness={0.7} />
          </mesh>
        ))}
        <Basket side={-1} weave={weave} swayRef={sway} />
        <Basket side={1} weave={weave} swayRef={sway} />
      </group>
      <ContactShadows position={[0, -1.32, 0]} opacity={0.42} scale={9} blur={2.6} far={3.5} color="#3a2414" />
    </group>
  );
}

export default function KandarScene({
  active,
  progress,
  reduced = false,
  className,
}: {
  active: boolean;
  progress: RefObject<number>;
  reduced?: boolean;
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={null}
      aria-hidden
    >
      <ambientLight intensity={0.4} color="#fff1dc" />
      <directionalLight position={[3, 6, 5]} intensity={2.4} color="#ffe2b4" />
      <directionalLight position={[-5, 2, -3]} intensity={0.9} color="#d99a1e" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 5, -2]} scale={[10, 5, 1]} color="#ffe6c2" />
        <Lightformer intensity={1.4} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#d99a1e" />
        <Lightformer intensity={0.8} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#f4ecde" />
        <Lightformer intensity={0.5} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[8, 8, 1]} color="#8b4a2b" />
      </Environment>
      <Kandar progress={progress} />
    </Canvas>
  );
}
