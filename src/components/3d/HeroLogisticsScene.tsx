"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

type HeroSceneState = {
  progress: number;
};

const GLOBE_RADIUS = 1.8;
const HERO_PARTICLE_COUNT = 1400;

const logisticsNodes = [
  [-1.12, 0.92, 1.08],
  [1.24, 0.54, 1.16],
  [-1.42, -0.48, 0.94],
  [1.36, -0.72, 0.88],
  [-0.38, 1.58, -0.72],
  [0.62, -1.48, -0.92],
] as const;

const routePairs = [
  [0, 1, 0.88],
  [2, 3, 1.02],
  [4, 5, 0.94],
] as const;

const heroParticlePositions = (() => {
  const positions = new Float32Array(HERO_PARTICLE_COUNT * 3);
  let seed = 2468;

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 2.4 + random() * 2.6;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return positions;
})();

function createRouteArc(
  start: readonly number[],
  end: readonly number[],
  lift: number,
) {
  const startVector = new THREE.Vector3(...start)
    .normalize()
    .multiplyScalar(GLOBE_RADIUS * 0.98);
  const endVector = new THREE.Vector3(...end)
    .normalize()
    .multiplyScalar(GLOBE_RADIUS * 0.98);
  const controlPoint = startVector
    .clone()
    .add(endVector)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(GLOBE_RADIUS + lift);

  return new THREE.QuadraticBezierCurve3(
    startVector,
    controlPoint,
    endVector,
  ).getPoints(48);
}

function HeroScene({
  sceneStateRef,
}: {
  sceneStateRef: React.RefObject<HeroSceneState>;
}) {
  const globeRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const routeGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  const routeBuffers = useMemo(
    () =>
      routePairs.map(([startIndex, endIndex, lift]) => {
        const points = createRouteArc(
          logisticsNodes[startIndex],
          logisticsNodes[endIndex],
          lift,
        );

        return Float32Array.from(points.flatMap((point) => point.toArray()));
      }),
    [],
  );

  const elapsedTimeRef = useRef(0);

  useFrame((state, delta) => {
    elapsedTimeRef.current += delta;
    const time = elapsedTimeRef.current;
    const progress = THREE.MathUtils.clamp(sceneStateRef.current.progress, 0, 1);

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
      globeRef.current.rotation.x = Math.sin(time * 0.2) * 0.08;

      const globeMaterial = globeRef.current.material as THREE.MeshStandardMaterial;
      globeMaterial.opacity = THREE.MathUtils.lerp(
        globeMaterial.opacity,
        0.2 - progress * 0.08,
        0.08,
      );
      globeMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        globeMaterial.emissiveIntensity,
        0.24 + progress * 0.18,
        0.08,
      );
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.06;
      pointsRef.current.rotation.x += delta * 0.012;
    }

    if (haloRef.current) {
      haloRef.current.rotation.y -= delta * 0.07;

      const haloMaterial = haloRef.current.material as THREE.MeshBasicMaterial;
      haloMaterial.opacity = THREE.MathUtils.lerp(
        haloMaterial.opacity,
        0.07 + progress * 0.04,
        0.08,
      );
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.14;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.18;
    }

    if (routeGroupRef.current) {
      routeGroupRef.current.rotation.y -= delta * 0.04;
      routeGroupRef.current.rotation.z = Math.sin(time * 0.22) * 0.06;
    }

    const targetZ = THREE.MathUtils.lerp(6.1, 1.55, progress);
    const targetX = THREE.MathUtils.lerp(0, 0.52, progress);
    const targetY = THREE.MathUtils.lerp(0, 0.42, progress);

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.08,
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.08,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.08,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.58} />
      <directionalLight position={[4, 5, 3]} intensity={1.05} color="#b9ffe0" />
      <pointLight position={[-4, -2, 4]} intensity={1.6} color="#10b981" />

      <group ref={routeGroupRef}>
        <Sphere ref={haloRef} args={[2.46, 36, 36]}>
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.07}
            side={THREE.BackSide}
          />
        </Sphere>

        <Sphere ref={globeRef} args={[GLOBE_RADIUS, 48, 48]}>
          <meshStandardMaterial
            color="#6ffbbe"
            emissive="#0d8f63"
            emissiveIntensity={0.24}
            wireframe
            transparent
            opacity={0.2}
          />
        </Sphere>

        <Torus ref={outerRingRef} args={[2.46, 0.016, 16, 140]} rotation={[1.12, 0.2, 0.52]}>
          <meshBasicMaterial color="#87f7cb" transparent opacity={0.34} />
        </Torus>

        <Torus ref={innerRingRef} args={[2.18, 0.012, 16, 120]} rotation={[2.1, 0.1, 0.82]}>
          <meshBasicMaterial color="#e5fff3" transparent opacity={0.22} />
        </Torus>

        {routeBuffers.map((routeBuffer, index) => (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[routeBuffer, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={index === 1 ? "#eafff4" : "#71f1ba"}
              transparent
              opacity={0.55}
            />
          </line>
        ))}

        {logisticsNodes.map((node, index) => (
          <mesh
            key={index}
            position={[node[0], node[1], node[2]]}
          >
            <sphereGeometry args={[index % 2 === 0 ? 0.055 : 0.07, 18, 18]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#eafff4" : "#6ffbbe"}
            />
          </mesh>
        ))}

        <Points ref={pointsRef} positions={heroParticlePositions} stride={3}>
          <PointMaterial
            transparent
            color="#b0f0d6"
            size={0.028}
            sizeAttenuation
            depthWrite={false}
          />
        </Points>
      </group>
    </>
  );
}

export default function HeroLogisticsScene({
  sceneStateRef,
}: {
  sceneStateRef: React.RefObject<HeroSceneState>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.1], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <HeroScene sceneStateRef={sceneStateRef} />
    </Canvas>
  );
}
