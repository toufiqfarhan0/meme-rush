import type { MemeSound } from './meme-audio.types';

/**
 * A small, replaceable starter catalogue. URLs are intentionally kept as data,
 * allowing a product build to substitute licensed CDN/local assets without
 * changing the player or soundboard.
 */
export const DEFAULT_MEME_SOUNDS: readonly MemeSound[] = [
  {
    id: 'vine-boom',
    name: 'Vine Boom',
    description: 'The dramatic bass hit.',
    category: 'impact',
    source: 'myinstants',
    url: 'https://www.myinstants.com/media/sounds/vine-boom.mp3',
  },
  {
    id: 'bruh',
    name: 'Bruh',
    description: 'For the most questionable takes.',
    category: 'reaction',
    source: 'myinstants',
    url: 'https://www.myinstants.com/media/sounds/bruh.mp3',
  },
  {
    id: 'emotional-damage',
    name: 'Emotional Damage',
    description: 'A perfectly timed roast.',
    category: 'voice',
    source: 'myinstants',
    url: 'https://www.myinstants.com/media/sounds/emotional-damage.mp3',
  },
  {
    id: 'coffin-dance',
    name: 'Coffin Dance',
    description: 'Astronomia energy.',
    category: 'music',
    source: 'myinstants',
    url: 'https://www.myinstants.com/media/sounds/coffin-dance.mp3',
  },
  {
    id: 'windows-xp-error',
    name: 'Windows Error',
    description: 'When the plan crashes.',
    category: 'reaction',
    source: 'myinstants',
    url: 'https://www.myinstants.com/media/sounds/windows-xp-error.mp3',
  },
] as const;

/** Merge a remote/custom catalogue over the starter bank by stable sound id. */
export function createMemeSoundBank(customSounds: readonly MemeSound[] = []): MemeSound[] {
  const bank = new Map(DEFAULT_MEME_SOUNDS.map((sound) => [sound.id, sound]));
  customSounds.forEach((sound) => bank.set(sound.id, sound));
  return [...bank.values()];
}
