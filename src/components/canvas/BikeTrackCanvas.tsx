'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, ArrowRight, Zap, Shield, Gauge, Sparkles } from 'lucide-react';
import BikeTrackScene from './BikeTrackScene';
import { soundManager } from '@/lib/audio';

export default function BikeTrackCanvas() {
  const [mounted, setMounted] = useState(false);
  const [lane, setLane] = useState(1); // 0: Left, 1: Center, 2: Right
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [speed, setSpeed] = useState(25);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard controls handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      setLane((prev) => {
        const next = Math.max(0, prev - 1);
        if (next !== prev) soundManager.playSound('woosh');
        return next;
      });
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      setLane((prev) => {
        const next = Math.min(2, prev + 1);
        if (next !== prev) soundManager.playSound('woosh');
        return next;
      });
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      setIsAccelerating(true);
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      setIsBraking(true);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      setIsAccelerating(false);
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      setIsBraking(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Steering action helpers for touch/buttons
  const steerLeft = () => {
    setLane((prev) => {
      const next = Math.max(0, prev - 1);
      if (next !== prev) soundManager.playSound('woosh');
      return next;
    });
  };

  const steerRight = () => {
    setLane((prev) => {
      const next = Math.min(2, prev + 1);
      if (next !== prev) soundManager.playSound('woosh');
      return next;
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-gradient-to-br from-purple-950/40 via-zinc-950 to-cyan-950/40 rounded-2xl border border-white/10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-cyan-300 font-mono">Initializing 3D Bike Track Engine...</span>
        </div>
      </div>
    );
  }

  const laneLabels = ['LEFT LANE', 'CENTER LANE', 'RIGHT LANE'];
  const laneAccents = ['text-purple-400', 'text-cyan-400', 'text-pink-400'];

  return (
    <div className="w-full h-[480px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 group">
      {/* 3D WebGL Canvas */}
      <Canvas className="w-full h-full">
        <Suspense fallback={null}>
          <BikeTrackScene
            lane={lane}
            isAccelerating={isAccelerating}
            isBraking={isBraking}
            onSpeedChange={setSpeed}
          />
        </Suspense>
      </Canvas>

      {/* Cyber Arcade Top HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none select-none">
        {/* Speedometer Gauge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
          <Gauge className={`w-5 h-5 ${isAccelerating ? 'text-cyan-400 animate-pulse' : 'text-purple-400'}`} />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Speedometer</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white leading-none">{speed}</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">KM/H</span>
            </div>
          </div>
        </div>

        {/* Current Lane & Drive Mode Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono font-bold">
            <span className="text-zinc-500 mr-1.5">POS:</span>
            <span className={laneAccents[lane]}>{laneLabels[lane]}</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border backdrop-blur-md text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all ${
              isAccelerating
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : isBraking
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-black/60 border-white/10 text-purple-300'
            }`}
          >
            {isAccelerating ? (
              <>
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" /> HYPER BOOST
              </>
            ) : isBraking ? (
              <>
                <Shield className="w-3.5 h-3.5 text-red-400" /> BRAKING
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> CRUISING
              </>
            )}
          </div>
        </div>
      </div>

      {/* On-Screen Touch / Mouse Interactive Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-4 select-none">
        {/* Steering Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={steerLeft}
            disabled={lane === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border backdrop-blur-md transition-all active:scale-95 ${
              lane === 0
                ? 'bg-zinc-900/50 border-white/5 text-zinc-600 cursor-not-allowed'
                : 'bg-black/70 border-white/10 hover:border-purple-400/50 text-white hover:bg-purple-950/40 shadow-lg'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" /> STEER LEFT
          </button>
          <button
            onClick={steerRight}
            disabled={lane === 2}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border backdrop-blur-md transition-all active:scale-95 ${
              lane === 2
                ? 'bg-zinc-900/50 border-white/5 text-zinc-600 cursor-not-allowed'
                : 'bg-black/70 border-white/10 hover:border-cyan-400/50 text-white hover:bg-cyan-950/40 shadow-lg'
            }`}
          >
            STEER RIGHT <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Keyboard Hint Info */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-400 font-mono">
          <span>Keys:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-white/10">A / ←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-white/10">D / →</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-cyan-500/30">W / ↑ Boost</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-red-300 border border-red-500/30">S / ↓ Brake</kbd>
        </div>

        {/* Throttle & Brake Touch Controls */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => setIsBraking(true)}
            onMouseUp={() => setIsBraking(false)}
            onTouchStart={() => setIsBraking(true)}
            onTouchEnd={() => setIsBraking(false)}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold border backdrop-blur-md transition-all active:scale-95 ${
              isBraking
                ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/30'
                : 'bg-black/70 border-white/10 hover:border-red-400/50 text-zinc-300'
            }`}
          >
            BRAKE
          </button>
          <button
            onMouseDown={() => setIsAccelerating(true)}
            onMouseUp={() => setIsAccelerating(false)}
            onTouchStart={() => setIsAccelerating(true)}
            onTouchEnd={() => setIsAccelerating(false)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-black border backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 ${
              isAccelerating
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 text-white shadow-xl shadow-cyan-500/30'
                : 'bg-black/70 border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> BOOST
          </button>
        </div>
      </div>
    </div>
  );
}
