"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 320;

export default function ParticleBackground() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();
  const clock = useRef(0);

  /* ── Generate initial positions + drift velocities ── */
  const { geometry, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;

      vel[i * 3]     = (Math.random() - 0.5) * 0.0012;
      vel[i * 3 + 1] = -(Math.random() * 0.0018 + 0.0004);
      vel[i * 3 + 2] = 0;

      sizes[i] = Math.random() * 0.028 + 0.008;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));
    return { geometry: g, velocities: vel };
  }, []);

  /* ── Animate ── */
  useFrame((_, delta) => {
    clock.current += delta;
    const pos = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += velocities[i * 3]     + Math.sin(clock.current * 0.4 + i) * 0.0004;
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap
      if (pos[i * 3 + 1] < -7)  pos[i * 3 + 1] = 7;
      if (pos[i * 3]     < -11) pos[i * 3]     = 11;
      if (pos[i * 3]     >  11) pos[i * 3]     = -11;
    }

    geometry.attributes.position.needsUpdate = true;

    // Mouse-driven subtle rotation of entire field
    if (ref.current) {
      ref.current.rotation.y += (mouse.x * 0.04 - ref.current.rotation.y) * 0.02;
      ref.current.rotation.x += (-mouse.y * 0.025 - ref.current.rotation.x) * 0.02;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color="#8b0038"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
