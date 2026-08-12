export type MemeSound = 'airhorn' | 'bruh' | 'vine' | 'wow';

export interface Pickup {
  id: number;
  sound: MemeSound;
  lane: number;
  progress: number;
}

export const MAX_STRIKES = 3;
export const LANES = [-1, 0, 1] as const;

export const pickupMeta: Record<MemeSound, { icon: string; label: string; frequency: number }> = {
  airhorn: { icon: '📣', label: 'Airhorn', frequency: 185 },
  bruh: { icon: '😑', label: 'Bruh', frequency: 112 },
  vine: { icon: '🥁', label: 'Vine boom', frequency: 72 },
  wow: { icon: '😲', label: 'Wow', frequency: 440 },
};

export function isPickupCollected(pickup: Pickup, bikeLane: number): boolean {
  return pickup.progress >= 76 && pickup.progress <= 91 && pickup.lane === bikeLane;
}

export function isPickupMissed(pickup: Pickup): boolean {
  return pickup.progress > 105;
}
