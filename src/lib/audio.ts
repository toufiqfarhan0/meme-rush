import { Howl } from 'howler';
import { SoundEffect } from '@/types/meme';

class SoundManager {
  private static instance: SoundManager;
  private muted: boolean = false;
  private volume: number = 0.5;
  private sounds: Map<SoundEffect, Howl> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('meme_rush_muted');
      if (savedMuted !== null) {
        this.muted = savedMuted === 'true';
      }
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('meme_rush_muted', String(this.muted));
    }
    return this.muted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play sound using Web Audio API synthesis as reliable fallback + Howler support
  public playSound(effect: SoundEffect): void {
    if (this.muted || typeof window === 'undefined') return;

    try {
      // Synthesize quick interactive UI sounds via Web Audio API for zero latency & no asset dependency
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(this.volume * 0.3, now);

      switch (effect) {
        case 'click':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        case 'vote':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        case 'victory':
          osc.type = 'square';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'pop':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        case 'woosh':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        case 'hype':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(900, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
      }
    } catch {
      // AudioContext fallback ignored if blocked by user autoplay policy
    }
  }
}

export const soundManager = SoundManager.getInstance();
