export type MemeAudioSource = 'myinstants' | 'custom';

export interface MemeSound {
  /** Stable id used when saving a sound selection with a meme. */
  id: string;
  name: string;
  description: string;
  category: 'reaction' | 'impact' | 'music' | 'voice';
  source: MemeAudioSource;
  /** Public MP3 URL. Custom entries may point to a CDN or local /public asset. */
  url: string;
  duration?: number;
}

export type SoundLoadState = 'idle' | 'loading' | 'ready' | 'error';

export interface SoundLoadStatus {
  state: SoundLoadState;
  error?: string;
}
