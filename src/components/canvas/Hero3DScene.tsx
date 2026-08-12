'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, RoundedBox, Text, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { soundManager } from '@/lib/audio';

function FloatingMemeCube() {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    soundManager.playSound('pop');
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handleClick = () => {
    setClicked((prev) => !prev);
    soundManager.playSound('vote');
  };

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <group
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        scale={hovered ? 1.15 : 1}
      >
        {/* Main Glass Card Frame */}
        <RoundedBox args={[3.2, 3.2, 0.4]} radius={0.2} smoothness={8}>
          <meshPhysicalMaterial
            color={hovered ? '#ec4899' : '#8b5cf6'}
            roughness={0.1}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.6}
            thickness={0.8}
            ior={1.5}
          />
        </RoundedBox>

        {/* Inner Glowing Core */}
        <RoundedBox args={[2.9, 2.9, 0.3]} radius={0.15}>
          <meshStandardMaterial
            color={clicked ? '#f59e0b' : '#06b6d4'}
            emissive={clicked ? '#f59e0b' : '#06b6d4'}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Floating 3D Text */}
        <Text
          position={[0, 0.4, 0.25]}
          fontSize={0.55}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          MEME
        </Text>

        <Text
          position={[0, -0.4, 0.25]}
          fontSize={0.65}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
          fontWeight="black"
        >
          RUSH 🚀
        </Text>

        {/* Orbiting Ring Accent */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.5, 0.04, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
      </group>
    </Float>
  );
}

function AnimatedParticles() {
  return (
    <>
      <Sparkles count={80} scale={12} size={3} speed={0.6} color="#8b5cf6" />
      <Sparkles count={50} scale={10} size={4} speed={0.4} color="#38bdf8" />
      <Sparkles count={40} scale={8} size={5} speed={0.8} color="#facc15" />
    </>
  );
}

function DistortedBlob() {
  const blobRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (blobRef.current) {
      blobRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      blobRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={blobRef} position={[0, 0, -3]} scale={2.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

export default function Hero3DScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#ec4899" />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#06b6d4" />

      <FloatingMemeCube />
      <DistortedBlob />
      <AnimatedParticles />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.5}
      />
    </>
  );
}
