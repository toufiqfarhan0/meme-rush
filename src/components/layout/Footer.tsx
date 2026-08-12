'use client';

import { Sparkles, Globe, Share2, Heart, ShieldCheck, Zap } from 'lucide-react';
import { soundManager } from '@/lib/audio';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              MEME<span className="text-purple-400">RUSH</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The next-generation interactive 3D meme battle arena and lightning-fast generator built for viral internet culture.
          </p>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Zap className="w-3.5 h-3.5" />
            Next.js App Router + Three.js Engine
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#feed" onClick={() => soundManager.playSound('click')} className="hover:text-cyan-400 transition-colors">
                Trending Memes
              </a>
            </li>
            <li>
              <a href="#battles" onClick={() => soundManager.playSound('click')} className="hover:text-cyan-400 transition-colors">
                Active Battles
              </a>
            </li>
            <li>
              <a href="#generator" onClick={() => soundManager.playSound('click')} className="hover:text-cyan-400 transition-colors">
                3D Generator Tool
              </a>
            </li>
            <li>
              <a href="#leaderboard" onClick={() => soundManager.playSound('click')} className="hover:text-cyan-400 transition-colors">
                Hall of Fame
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Tech Stack */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Tech Stack</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              React 19 & Next.js
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Three.js / React Three Fiber
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              Howler.js Audio Engine
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Tailwind CSS v4 & TypeScript
            </li>
          </ul>
        </div>

        {/* Column 4: Community & Social */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Community</h4>
          <div className="flex gap-3 mb-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playSound('click')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400/50 hover:text-white transition-all flex items-center gap-2 text-xs"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Community</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playSound('click')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400/50 hover:text-white transition-all flex items-center gap-2 text-xs"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Share App</span>
            </a>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            All Systems Operational
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} Meme Rush. Built with precision and visual excellence.</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          <span>for meme creators worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
