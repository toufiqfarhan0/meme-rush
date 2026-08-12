'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, Swords, Sparkles, Trophy, Menu, X } from 'lucide-react';
import { soundManager } from '@/lib/audio';

export default function Navbar() {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const isMutedNow = soundManager.toggleMute();
    setMuted(isMutedNow);
    if (!isMutedNow) {
      soundManager.playSound('click');
    }
  };

  const handleNavClick = () => {
    soundManager.playSound('click');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-transparent">
                MEME<span className="text-purple-400">RUSH</span>
              </span>
              <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-mono font-semibold -mt-1">
                Battles & Generator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <Link
              href="#feed"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Trending Feed
            </Link>
            <Link
              href="#battles"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Swords className="w-4 h-4 text-purple-400" />
              Meme Battles
            </Link>
            <Link
              href="#generator"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Generator
            </Link>
            <Link
              href="#leaderboard"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              Leaderboard
            </Link>
          </nav>

          {/* Controls & Actions */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleSound}
              title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-cyan-400/50 hover:bg-zinc-800 transition-all flex items-center justify-center group"
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Volume2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
              )}
            </button>

            {/* Create CTA Button */}
            <a
              href="#generator"
              onClick={() => soundManager.playSound('hype')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Create Meme
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundManager.playSound('click');
              }}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          <Link
            href="#feed"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavClick();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <Flame className="w-5 h-5 text-amber-400" />
            Trending Feed
          </Link>
          <Link
            href="#battles"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavClick();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <Swords className="w-5 h-5 text-purple-400" />
            Meme Battles
          </Link>
          <Link
            href="#generator"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavClick();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Generator
          </Link>
          <Link
            href="#leaderboard"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavClick();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            Leaderboard
          </Link>
        </div>
      )}
    </header>
  );
}
