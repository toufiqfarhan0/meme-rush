'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Flame, Swords, Sparkles, Trophy, Play, ThumbsUp, Share2, Volume2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { formatNumber } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Dynamically import Three.js Canvas to ensure client-only rendering
const MemeCanvas = dynamic(() => import('@/components/canvas/MemeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-zinc-900/60 rounded-2xl border border-white/10">
      <span className="text-sm text-cyan-400 font-mono animate-pulse">Loading 3D Canvas...</span>
    </div>
  ),
});

export default function Home() {
  const [battleVotes, setBattleVotes] = useState({ left: 1420, right: 980 });
  const [votedSide, setVotedSide] = useState<'left' | 'right' | null>(null);

  const handleVote = (side: 'left' | 'right') => {
    if (votedSide === side) return;
    
    setVotedSide(side);
    setBattleVotes((prev) => ({
      ...prev,
      [side]: prev[side] + 1,
    }));

    soundManager.playSound('victory');

    // Trigger victory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#facc15'],
    });
  };

  const totalVotes = battleVotes.left + battleVotes.right;
  const leftPct = Math.round((battleVotes.left / totalVotes) * 100);
  const rightPct = 100 - leftPct;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Hero Left Content */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            Next-Gen 3D Meme Engine Active
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Create, Battle & Go <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Viral in 3D
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Meme Rush brings memes into full 3D interactive battles with real-time audio, community voting, and instant high-res generation.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#battles"
              onClick={() => soundManager.playSound('hype')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Swords className="w-5 h-5" />
              Enter Battle Arena
            </a>

            <a
              href="#generator"
              onClick={() => soundManager.playSound('click')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400/50 text-zinc-200 hover:text-white font-semibold text-sm transition-all hover:bg-zinc-800"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Launch Generator
            </a>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center sm:text-left">
            <div>
              <div className="text-2xl font-black text-white">125K+</div>
              <div className="text-xs text-zinc-400 font-medium">Memes Created</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">1.8M</div>
              <div className="text-xs text-zinc-400 font-medium">Battle Votes</div>
            </div>
            <div>
              <div className="text-2xl font-black text-pink-400">60 FPS</div>
              <div className="text-xs text-zinc-400 font-medium">3D WebGL Engine</div>
            </div>
          </div>
        </div>

        {/* Hero Right 3D Canvas Showcase */}
        <div className="lg:col-span-6 h-[420px] w-full">
          <MemeCanvas />
        </div>
      </section>

      {/* FEATURED BATTLE ARENA SCAFFOLD */}
      <section id="battles" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
              <Swords className="w-4 h-4" /> Live Battle Arena
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Meme Clash</h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            VOTING ENDS IN 04h 12m
          </div>
        </div>

        {/* Battle Card Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Fighter A */}
            <div
              onClick={() => handleVote('left')}
              className={`p-6 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 ${
                votedSide === 'left'
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-zinc-950/60 border-white/10 hover:border-purple-500/50 hover:bg-zinc-950/80'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold font-mono">
                  #1 CONTENDER
                </span>
                <span className="text-xl font-extrabold text-purple-400">{leftPct}%</span>
              </div>

              <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-cyan-900/30" />
                <div className="text-center space-y-1 relative z-10">
                  <p className="text-lg font-black text-white uppercase tracking-wide">"WHEN THE CODE COMPILES ON FIRST TRY"</p>
                  <p className="text-xs text-cyan-400 font-mono">Template: Satisfied Cat</p>
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  votedSide === 'left'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-zinc-900 text-zinc-300 group-hover:bg-purple-600 group-hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Vote Left ({formatNumber(battleVotes.left)})
              </button>
            </div>

            {/* VS Badge */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 items-center justify-center text-white font-black text-xs shadow-xl border-4 border-zinc-900 z-20">
              VS
            </div>

            {/* Fighter B */}
            <div
              onClick={() => handleVote('right')}
              className={`p-6 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 ${
                votedSide === 'right'
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-zinc-950/60 border-white/10 hover:border-cyan-500/50 hover:bg-zinc-950/80'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
                  CHALLENGER
                </span>
                <span className="text-xl font-extrabold text-cyan-400">{rightPct}%</span>
              </div>

              <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 via-transparent to-purple-900/30" />
                <div className="text-center space-y-1 relative z-10">
                  <p className="text-lg font-black text-white uppercase tracking-wide">"EXPLAINING THE BUG TO RUBBER DUCK"</p>
                  <p className="text-xs text-purple-400 font-mono">Template: Distracted Dev</p>
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  votedSide === 'right'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-zinc-900 text-zinc-300 group-hover:bg-cyan-600 group-hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Vote Right ({formatNumber(battleVotes.right)})
              </button>
            </div>
          </div>

          {/* Voting Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden flex p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-l-full transition-all duration-500"
                style={{ width: `${leftPct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-r-full transition-all duration-500"
                style={{ width: `${rightPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>{leftPct}% Left Vote</span>
              <span>{totalVotes.toLocaleString()} Total Votes</span>
              <span>{rightPct}% Right Vote</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING FEED SHOWCASE */}
      <section id="feed" className="space-y-6 pt-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" /> Viral Heat Index
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Trending Meme Stream</h2>
          </div>
          <button
            onClick={() => soundManager.playSound('woosh')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:border-cyan-400/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Meme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Deploying to production on Friday",
              author: "@dev_legend",
              votes: 4820,
              views: "34.2K",
              tag: "Tech",
              accent: "from-amber-500/20 to-purple-500/20",
            },
            {
              title: "3D WebGL vs Flat 2D Memes",
              author: "@three_wizard",
              votes: 3910,
              views: "28.9K",
              tag: "3D Art",
              accent: "from-cyan-500/20 to-pink-500/20",
            },
            {
              title: "CSS layout works fine until resize",
              author: "@frontend_ninja",
              votes: 5210,
              views: "45.1K",
              tag: "Funny",
              accent: "from-purple-500/20 to-blue-500/20",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-4 hover:border-cyan-400/40 hover:bg-zinc-900/90 transition-all group"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-zinc-300">
                  {item.tag}
                </span>
                <span className="text-zinc-500 font-mono">{item.author}</span>
              </div>

              <div className={`aspect-square w-full rounded-xl bg-gradient-to-br ${item.accent} border border-white/5 p-4 flex flex-col justify-between items-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">MEME #{idx + 101}</span>
                <p className="text-lg font-black text-white drop-shadow-md">"{item.title}"</p>
                <span className="text-xs text-zinc-400 font-mono">View 3D Interactive Model</span>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => soundManager.playSound('vote')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-white font-medium hover:bg-purple-600 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                    {formatNumber(item.votes)}
                  </button>
                  <span className="font-mono">{item.views} views</span>
                </div>
                <button
                  onClick={() => soundManager.playSound('pop')}
                  className="p-2 rounded-lg bg-zinc-800 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GENERATOR LAUNCHPAD SCAFFOLD */}
      <section id="generator" className="p-8 rounded-2xl bg-gradient-to-r from-purple-950/50 via-zinc-900 to-cyan-950/50 border border-white/10 space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5" /> Instant Meme Creator
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Your Meme in Seconds</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Customize captions, select 3D frame effects, trigger custom audio sounds, and publish directly to the Meme Rush Arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Top Caption</label>
              <input
                type="text"
                placeholder="WHEN YOU WRITE CLEAN TS CODE..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Bottom Caption</label>
              <input
                type="text"
                placeholder="AND EVERYTHING PASSES LINTING!"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm font-semibold"
              />
            </div>
            <button
              onClick={() => {
                soundManager.playSound('victory');
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate & Export Meme
            </button>
          </div>

          <div className="p-6 rounded-xl bg-zinc-950 border border-white/10 text-center space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase">Live Canvas Preview</span>
            <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-dashed border-white/20 flex flex-col justify-center items-center p-4">
              <p className="font-extrabold text-white text-base">WHEN YOU WRITE CLEAN TS CODE...</p>
              <div className="my-2 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="font-extrabold text-white text-base">AND EVERYTHING PASSES LINTING!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
