import * as THREE from "three";

/**
 * Procedural geometry for the five ingredients the family names in their masala:
 * fennel, cumin, white pepper, almond and cashew. No external model files.
 */

export type SpiceKind = "fennel" | "cumin" | "white-pepper" | "almond" | "cashew";

// Small deterministic noise so shapes are identical between renders
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Ridged, slightly curved seed  the shape of fennel and cumin. */
function seed({ length, radius, ridges, curve, depth }: { length: number; radius: number; ridges: number; curve: number; depth: number }) {
  const g = new THREE.SphereGeometry(1, 28, 20);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = v.y; // -1..1 along the length
    const ang = Math.atan2(v.z, v.x);
    const taper = Math.pow(1 - Math.min(1, Math.abs(t)), 0.55);
    const ridge = 1 + depth * Math.cos(ang * ridges);
    const r = radius * ridge * (0.25 + 0.75 * taper);
    const nx = (v.x / Math.max(1e-4, Math.hypot(v.x, v.z))) * r * Math.hypot(v.x, v.z);
    const nz = (v.z / Math.max(1e-4, Math.hypot(v.x, v.z))) * r * Math.hypot(v.x, v.z);
    p.setXYZ(i, nx + curve * (1 - t * t), t * length * 0.5, nz);
  }
  g.computeVertexNormals();
  return g;
}

function peppercorn() {
  const g = new THREE.SphereGeometry(0.2, 36, 28);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = hash(Math.round(v.x * 40), Math.round(v.y * 40), Math.round(v.z * 40));
    const wrinkle = 1 + (n - 0.5) * 0.07 + Math.sin(v.x * 38) * Math.sin(v.y * 31) * 0.02;
    v.multiplyScalar(wrinkle);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function almond() {
  const g = new THREE.SphereGeometry(1, 40, 28);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = (v.y + 1) / 2; // 0 at base, 1 at tip
    const taper = 1 - 0.55 * Math.pow(t, 1.6);
    const grain = 1 + Math.sin(v.y * 22 + Math.atan2(v.z, v.x) * 3) * 0.012;
    p.setXYZ(i, v.x * 0.36 * taper * grain, v.y * 0.52, v.z * 0.17 * taper * grain);
  }
  g.computeVertexNormals();
  return g;
}

function cashew() {
  // A thick partial torus with tapering ends
  const arc = Math.PI * 1.12;
  const g = new THREE.TorusGeometry(0.3, 0.15, 24, 48, arc);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const a = Math.atan2(v.y, v.x); // 0..arc
    const u = Math.min(1, Math.max(0, a / arc));
    const end = Math.sin(Math.PI * u);
    const thickness = 0.62 + 0.38 * Math.pow(end, 0.45) + (u < 0.5 ? 0.08 : 0);
    const cx = Math.cos(a) * 0.3;
    const cy = Math.sin(a) * 0.3;
    p.setXYZ(i, cx + (v.x - cx) * thickness, cy + (v.y - cy) * thickness, v.z * thickness * 0.9);
  }
  g.center();
  g.computeVertexNormals();
  return g;
}

export function createSpiceGeometry(kind: SpiceKind) {
  switch (kind) {
    case "fennel":
      return seed({ length: 0.62, radius: 0.1, ridges: 10, curve: 0.03, depth: 0.12 });
    case "cumin":
      return seed({ length: 0.58, radius: 0.065, ridges: 9, curve: 0.06, depth: 0.16 });
    case "white-pepper":
      return peppercorn();
    case "almond":
      return almond();
    case "cashew":
      return cashew();
  }
}

export const spicePalette: Record<SpiceKind, { color: string; roughness: number; sheen?: number }> = {
  fennel: { color: "#8f8a4a", roughness: 0.72 },
  cumin: { color: "#7a5733", roughness: 0.8 },
  "white-pepper": { color: "#d9c79f", roughness: 0.62 },
  almond: { color: "#94552f", roughness: 0.68 },
  cashew: { color: "#e6cf9f", roughness: 0.5 },
};

/** Scale multiplier so every spice reads at a similar visual size in a scene. */
export const spiceScale: Record<SpiceKind, number> = {
  fennel: 1.25,
  cumin: 1.3,
  "white-pepper": 1,
  almond: 1,
  cashew: 1,
};
