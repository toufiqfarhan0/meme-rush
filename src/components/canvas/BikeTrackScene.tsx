'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;

function BikeModel({ lane, isAccelerating }: { lane: number; isAccelerating: boolean }) {
  const bikeRef = useRef<THREE.Group>(null);
  const targetX = (lane - 1) * LANE_WIDTH;

  useFrame((_, delta) => {
    if (bikeRef.current) {
      // Smooth lane transition
      bikeRef.current.position.x = THREE.MathUtils.lerp(bikeRef.current.position.x, targetX, delta * 12);
      
      // Steering tilt effect
      const tiltAngle = (bikeRef.current.position.x - targetX) * 0.25;
      bikeRef.current.rotation.z = THREE.MathUtils.lerp(bikeRef.current.rotation.z, tiltAngle, delta * 10);
      
      // Acceleration pitch
      const pitchAngle = isAccelerating ? -0.08 : 0;
      bikeRef.current.rotation.x = THREE.MathUtils.lerp(bikeRef.current.rotation.x, pitchAngle, delta * 8);
    }
  });

  return (
    <group ref={bikeRef} position={[0, 0.4, 0]}>
      {/* Main Bike Chassis */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.4, 1.6]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Cyber Neon Accents */}
      <mesh position={[0, 0.4, 0.2]}>
        <boxGeometry args={[0.65, 0.15, 0.8]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.65, 0.3]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={1} transparent roughness={0} />
      </mesh>

      {/* Front Wheel */}
      <mesh position={[0, 0, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Rear Wheel */}
      <mesh position={[0, 0, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Headlight Beam */}
      <spotLight
        position={[0, 0.5, 0.9]}
        target-position={[0, 0, 10]}
        angle={0.5}
        penumbra={0.5}
        intensity={3}
        color="#38bdf8"
      />
    </group>
  );
}

function EndlessRoad() {
  const roadRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (roadRef.current) {
      const mat = roadRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map) {
        mat.map.offset.y -= delta * 1.5;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Endless Asphalt Road Bed */}
      <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 15]}>
        <planeGeometry args={[8.5, 60]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Lane Dividers */}
      {[-LANE_WIDTH / 2, LANE_WIDTH / 2].map((x, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 15]}>
          <planeGeometry args={[0.1, 60]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}

      {/* Glowing Neon Side Rails */}
      {[-4.3, 4.3].map((x, idx) => (
        <mesh key={idx} position={[x, 0.2, 15]}>
          <boxGeometry args={[0.2, 0.4, 60]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function BikeTrackScene() {
  const [lane, setLane] = useState(1); // 0: Left, 1: Center, 2: Right
  const [isAccelerating, setIsAccelerating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setLane((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane((prev) => Math.min(2, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsAccelerating(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsAccelerating(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.5, -4]} rotation={[-0.35, Math.PI, 0]} fov={60} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, -5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 4, 2]} intensity={1.5} color="#ec4899" />

      <BikeModel lane={lane} isAccelerating={isAccelerating} />
      <EndlessRoad />
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
    </>
  );
}
