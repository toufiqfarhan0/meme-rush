'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export const LANE_WIDTH = 3.0;

export interface BikeTrackSceneProps {
  lane: number; // 0: Left, 1: Center, 2: Right
  isAccelerating: boolean;
  isBraking: boolean;
  onSpeedChange?: (speed: number) => void;
}

/**
 * 3D Cyberpunk Bike Model with detailed geometry, rotating wheels, headlight,
 * lean physics, pitch tilt, and rear exhaust boost particles.
 */
function CyberBikeModel({
  lane,
  isAccelerating,
  isBraking,
  onSpeedChange,
}: BikeTrackSceneProps) {
  const bikeRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const handlebarsRef = useRef<THREE.Group>(null);

  const currentSpeed = useRef(25);
  const targetX = (lane - 1) * LANE_WIDTH;

  useFrame((_, delta) => {
    if (!bikeRef.current) return;

    // Calculate dynamic speed based on controls
    let targetSpeed = 25;
    if (isAccelerating) targetSpeed = 55;
    else if (isBraking) targetSpeed = 10;

    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 4);
    if (onSpeedChange) {
      onSpeedChange(Math.round(currentSpeed.current));
    }

    // 1. Smooth Lane Position Interpolation (X)
    const prevX = bikeRef.current.position.x;
    bikeRef.current.position.x = THREE.MathUtils.lerp(prevX, targetX, delta * 12);
    const xVelocity = bikeRef.current.position.x - prevX;

    // 2. Steering Tilt / Roll Angle (Z-axis rotation)
    const tiltAngle = -xVelocity * 1.8;
    bikeRef.current.rotation.z = THREE.MathUtils.lerp(bikeRef.current.rotation.z, tiltAngle, delta * 10);

    // 3. Steering Yaw Angle (Y-axis rotation into turn)
    const yawAngle = -xVelocity * 0.8;
    bikeRef.current.rotation.y = THREE.MathUtils.lerp(bikeRef.current.rotation.y, yawAngle, delta * 10);

    // 4. Acceleration / Braking Pitch Angle (X-axis rotation)
    let pitchAngle = 0;
    if (isAccelerating) pitchAngle = -0.1;
    else if (isBraking) pitchAngle = 0.08;
    bikeRef.current.rotation.x = THREE.MathUtils.lerp(bikeRef.current.rotation.x, pitchAngle, delta * 8);

    // 5. Wheel Spin Animation based on speed
    const wheelRotationSpeed = delta * (currentSpeed.current * 0.4);
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += wheelRotationSpeed;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x += wheelRotationSpeed;

    // 6. Handlebars turning angle
    if (handlebarsRef.current) {
      handlebarsRef.current.rotation.y = THREE.MathUtils.lerp(handlebarsRef.current.rotation.y, yawAngle * 1.5, delta * 12);
    }
  });

  return (
    <group ref={bikeRef} position={[0, 0.45, 0]}>
      {/* Central Cyber Chassis */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.55, 0.45, 1.7]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Aerodynamic Body Fairing Cover */}
      <mesh position={[0, 0.52, 0.25]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.62, 0.25, 0.9]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Glowing Neon Side Accent Stripes */}
      <mesh position={[0.31, 0.38, 0]}>
        <boxGeometry args={[0.04, 0.12, 1.4]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={isAccelerating ? 2.5 : 1.2}
        />
      </mesh>
      <mesh position={[-0.31, 0.38, 0]}>
        <boxGeometry args={[0.04, 0.12, 1.4]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={isAccelerating ? 2.5 : 1.2}
        />
      </mesh>

      {/* Futuristic Glass Windshield */}
      <mesh position={[0, 0.72, 0.35]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[0.48, 0.35, 0.05]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.9}
          roughness={0.05}
          ior={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Steering Handlebars */}
      <group ref={handlebarsRef} position={[0, 0.65, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Handlebar Grips */}
        <mesh position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Front Wheel Assembly */}
      <group position={[0, 0, 0.75]}>
        <group ref={frontWheelRef}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.22, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          {/* Glowing Rim Cap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.24, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} />
          </mesh>
        </group>
      </group>

      {/* Rear Wheel Assembly */}
      <group position={[0, 0, -0.75]}>
        <group ref={rearWheelRef}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.25, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          {/* Glowing Rim Cap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.27, 16]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.0} />
          </mesh>
        </group>
      </group>

      {/* Headlight Cone & SpotLight */}
      <spotLight
        position={[0, 0.55, 0.9]}
        target-position={[0, -0.2, 12]}
        angle={0.6}
        penumbra={0.4}
        intensity={isAccelerating ? 6 : 4}
        color="#38bdf8"
        distance={25}
      />
      <mesh position={[0, 0.55, 0.88]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Rear Brake Light & Exhaust Thrusters */}
      <mesh position={[0, 0.45, -0.86]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial
          color={isBraking ? '#ef4444' : '#991b1b'}
          emissive="#ef4444"
          emissiveIntensity={isBraking ? 3.0 : 0.8}
        />
      </mesh>

      {/* Boost Exhaust Trail Particles */}
      {isAccelerating && (
        <group position={[0, 0.3, -1.2]}>
          <Sparkles count={30} scale={[0.8, 0.5, 2]} size={4} speed={2} color="#06b6d4" />
        </group>
      )}
    </group>
  );
}

/**
 * Procedural Endless Track Environment with dynamic road segments,
 * scrolling dashed lane dividers, neon rails, overhead arches, and horizon backdrop.
 */
function EndlessTrack({ isAccelerating, isBraking }: { isAccelerating: boolean; isBraking: boolean }) {
  const roadBedRef = useRef<THREE.Mesh>(null);
  const laneLinesGroupRef = useRef<THREE.Group>(null);
  const archesGroupRef = useRef<THREE.Group>(null);

  const scrollOffset = useRef(0);

  useFrame((_, delta) => {
    let speed = 25;
    if (isAccelerating) speed = 55;
    else if (isBraking) speed = 10;

    const moveAmount = delta * speed;
    scrollOffset.current += moveAmount;

    // Scroll Lane Marking dashes along Z axis infinitely
    if (laneLinesGroupRef.current) {
      laneLinesGroupRef.current.children.forEach((child) => {
        child.position.z -= moveAmount;
        if (child.position.z < -10) {
          child.position.z += 60;
        }
      });
    }

    // Scroll Overhead Neon Arches along Z axis infinitely
    if (archesGroupRef.current) {
      archesGroupRef.current.children.forEach((child) => {
        child.position.z -= moveAmount;
        if (child.position.z < -10) {
          child.position.z += 80;
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Asphalt Road Bed */}
      <mesh ref={roadBedRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 30]}>
        <planeGeometry args={[10, 80]} />
        <meshStandardMaterial color="#090d16" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Cyber Grid Lines Overlay on Road Bed */}
      <gridHelper
        args={[80, 80, '#8b5cf6', '#1e1b4b']}
        position={[0, 0.01, 30]}
        rotation={[0, 0, 0]}
      />

      {/* Scrolling Dashed Lane Lines (between lanes: X = -1.5 and X = 1.5) */}
      <group ref={laneLinesGroupRef}>
        {Array.from({ length: 15 }).flatMap((_, i) => [
          <mesh key={`l-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-LANE_WIDTH / 2, 0.02, i * 4 - 5]}>
            <planeGeometry args={[0.12, 2.0]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>,
          <mesh key={`r-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[LANE_WIDTH / 2, 0.02, i * 4 - 5]}>
            <planeGeometry args={[0.12, 2.0]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>,
        ])}
      </group>

      {/* Glowing Neon Side Rails */}
      <group>
        <mesh position={[-5.1, 0.25, 30]}>
          <boxGeometry args={[0.25, 0.5, 80]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[5.1, 0.25, 30]}>
          <boxGeometry args={[0.25, 0.5, 80]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Procedural Overhead Cyber Arches */}
      <group ref={archesGroupRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={i} position={[0, 0, i * 20 + 10]}>
            {/* Left Arch Pillar */}
            <mesh position={[-5.3, 3, 0]}>
              <boxGeometry args={[0.3, 6, 0.3]} />
              <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} />
            </mesh>
            {/* Right Arch Pillar */}
            <mesh position={[5.3, 3, 0]}>
              <boxGeometry args={[0.3, 6, 0.3]} />
              <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} />
            </mesh>
            {/* Top Arch Beam */}
            <mesh position={[0, 5.8, 0]}>
              <boxGeometry args={[10.9, 0.4, 0.4]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.0} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * Dynamic Camera Follow behavior tracking bike position smoothly with lerp,
 * FOV expansion on boost acceleration, and dynamic tilt.
 */
function CameraFollow({ lane, isAccelerating, isBraking }: { lane: number; isAccelerating: boolean; isBraking: boolean }) {
  const targetX = (lane - 1) * LANE_WIDTH;

  useFrame(({ camera }, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Dynamic FOV expansion when boosting
      const targetFOV = isAccelerating ? 68 : isBraking ? 54 : 60;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, delta * 6);
      camera.updateProjectionMatrix();

      // Smooth camera position tracking bike X with lag
      const targetCamX = targetX * 0.45;
      const targetCamY = isAccelerating ? 3.0 : 3.4;
      const targetCamZ = isAccelerating ? -5.2 : -4.5;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, delta * 7);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, delta * 5);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, delta * 5);

      // Camera lookAt point looking ahead on track
      const lookTargetX = targetX * 0.7;
      camera.lookAt(lookTargetX, 1.0, 15);
    }
  });

  return <PerspectiveCamera makeDefault position={[0, 3.4, -4.5]} fov={60} />;
}

export default function BikeTrackScene({
  lane = 1,
  isAccelerating = false,
  isBraking = false,
  onSpeedChange,
}: BikeTrackSceneProps) {
  return (
    <>
      <CameraFollow lane={lane} isAccelerating={isAccelerating} isBraking={isBraking} />

      {/* Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 15, -10]} intensity={1.4} color="#ffffff" />
      <pointLight position={[0, 5, 5]} intensity={2.0} color="#ec4899" />
      <pointLight position={[-4, 3, 10]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[4, 3, 10]} intensity={1.5} color="#8b5cf6" />

      {/* 3D Cyber Bike Model */}
      <CyberBikeModel
        lane={lane}
        isAccelerating={isAccelerating}
        isBraking={isBraking}
        onSpeedChange={onSpeedChange}
      />

      {/* Procedural Endless Road Track */}
      <EndlessTrack isAccelerating={isAccelerating} isBraking={isBraking} />

      {/* Starfield & Ambient Speed Particles */}
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={1.5} />
      <Sparkles count={60} scale={[12, 8, 40]} size={3} speed={1.2} color="#38bdf8" />
    </>
  );
}

