export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  captionTop?: string;
  captionBottom?: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  votes: number;
  views: number;
  createdAt: string;
  tags: string[];
  isTrending?: boolean;
}

export interface MemeBattle {
  id: string;
  title: string;
  category: string;
  memeA: Meme;
  memeB: Meme;
  votesA: number;
  votesB: number;
  endsAt: string;
  status: 'active' | 'completed';
}

export type SoundEffect = 'click' | 'vote' | 'victory' | 'pop' | 'woosh' | 'hype';

export interface AppAudioState {
  muted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  playSound: (effect: SoundEffect) => void;
}
