"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ClayMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    meshRef.current.rotation.x = Math.cos(t * 0.15) * 0.03;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={[12, 8, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshStandardMaterial
        color="#0A0A0A"
        roughness={0.85}
        metalness={0.15}
        wireframe={false}
      />
    </mesh>
  );
}

function ParticleRiver() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= delta * 0.6;
      if (arr[i * 3 + 1] < -4) arr[i * 3 + 1] = 4;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FFFFFF"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export default function ClayBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, #121212 0%, #000000 70%)",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={0.8} color="#FFFFFF" />
        <pointLight position={[-3, -2, 1]} intensity={0.5} color="#E5E5E5" />
        <ParticleRiver />
      </Canvas>
    </div>
  );
}
