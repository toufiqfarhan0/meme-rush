'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Hero3DScene from './Hero3DScene';

export default function MemeCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-zinc-900 to-cyan-900/20 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-cyan-300">Initializing 3D Canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-purple-950/40 via-zinc-950 to-cyan-950/40">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-zinc-400 pointer-events-none select-none bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Three.js WebGL Engine
        </span>
        <span className="hidden sm:inline text-zinc-500">Drag to rotate • Click to trigger audio & FX</span>
      </div>
    </div>
  );
}
