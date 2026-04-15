"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SustainabilitySceneState = {
  val: number;
  carbonLevel: number;
};

const PARTICLE_COUNT = 4200;
const GREY = new THREE.Color("#75807a");
const GREEN = new THREE.Color("#6ffbbe");

const particleField = (() => {
  const basePositions = new Float32Array(PARTICLE_COUNT * 3);
  const baseColors = new Float32Array(PARTICLE_COUNT * 3);
  const randomOffsets = new Float32Array(PARTICLE_COUNT);

  let seed = 12345;

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = Math.cbrt(random()) * 2.55;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);

    basePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    basePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    basePositions[i * 3 + 2] = radius * Math.cos(phi);

    randomOffsets[i] = random();

    baseColors[i * 3] = GREY.r;
    baseColors[i * 3 + 1] = GREY.g;
    baseColors[i * 3 + 2] = GREY.b;
  }

  return { basePositions, baseColors, randomOffsets };
})();

function CarbonParticles({
  sceneStateRef,
}: {
  sceneStateRef: React.RefObject<SustainabilitySceneState>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const initialPositions = useMemo(
    () => new Float32Array(particleField.basePositions),
    [],
  );
  const initialColors = useMemo(
    () => new Float32Array(particleField.baseColors),
    [],
  );

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    const level = THREE.MathUtils.clamp(
      sceneStateRef.current.carbonLevel,
      0,
      1,
    );
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color
      .array as Float32Array;
    const targetR = THREE.MathUtils.lerp(GREY.r, GREEN.r, level);
    const targetG = THREE.MathUtils.lerp(GREY.g, GREEN.g, level);
    const targetB = THREE.MathUtils.lerp(GREY.b, GREEN.b, level);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = particleField.basePositions[i * 3];
      const oy = particleField.basePositions[i * 3 + 1];
      const oz = particleField.basePositions[i * 3 + 2];
      const randomOffset = particleField.randomOffsets[i];
      const expansion = 1 + level * 0.38;
      const drift = 0.18 + level * 0.72;
      const plume =
        level > 0.42 && randomOffset > 0.72
          ? (level - 0.42) * (randomOffset - 0.72) * 10
          : 0;
      const lateralEscape = plume * 0.28;

      const targetX =
        ox * expansion +
        Math.sin(time * 0.52 + randomOffset * 12) * drift +
        Math.cos(time * 0.86 + randomOffset * 18) * lateralEscape;
      const targetY =
        oy * expansion +
        Math.cos(time * 0.36 + randomOffset * 8) * drift +
        level * (1.3 + randomOffset * 2.7) +
        plume * 1.9;
      const targetZ =
        oz * expansion +
        Math.sin(time * 0.44 + randomOffset * 10) * drift +
        Math.sin(time * 0.74 + randomOffset * 15) * lateralEscape;
      const easing = 0.045 + level * 0.02;

      positions[i * 3] += (targetX - positions[i * 3]) * easing;
      positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * easing;
      positions[i * 3 + 2] += (targetZ - positions[i * 3 + 2]) * easing;

      colors[i * 3] = targetR;
      colors[i * 3 + 1] = targetG;
      colors[i * 3 + 2] = targetB;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    pointsRef.current.rotation.y += delta * (0.08 + level * 0.14);
    pointsRef.current.rotation.x = Math.sin(time * 0.16) * 0.08;

    const particleMaterial = pointsRef.current.material as THREE.PointsMaterial;
    particleMaterial.size = 0.042 + level * 0.018;
    particleMaterial.opacity = 0.72 + level * 0.22;

    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + level * 0.16);

      const haloMaterial = haloRef.current.material as THREE.MeshBasicMaterial;
      haloMaterial.opacity = 0.08 + level * 0.12;
    }
  });

  return (
    <>
      <mesh ref={haloRef} scale={1.02}>
        <sphereGeometry args={[3.15, 28, 28]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={0.82}>
        <sphereGeometry args={[2.9, 24, 24]} />
        <meshBasicMaterial color="#dffff0" transparent opacity={0.03} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[initialColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          vertexColors
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function SustainabilityParticleScene({
  sceneStateRef,
}: {
  sceneStateRef: React.RefObject<SustainabilitySceneState>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.44} />
      <pointLight position={[3.2, 2.4, 4]} intensity={1.2} color="#6ffbbe" />
      <pointLight position={[-4.2, -2.4, 5]} intensity={1.4} color="#10b981" />
      <CarbonParticles sceneStateRef={sceneStateRef} />
    </Canvas>
  );
}
