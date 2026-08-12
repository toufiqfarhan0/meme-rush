'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MemeSound, SoundLoadStatus } from './meme-audio.types';

type AudioCache = Map<string, HTMLAudioElement>;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'This sound could not be loaded.';
}

/** Native-audio player with eager preloading and a single active preview. */
export function useMemeAudio(sounds: readonly MemeSound[], preload = true) {
  const cache = useRef<AudioCache>(new Map());
  const activeId = useRef<string>();
  const [statuses, setStatuses] = useState<Record<string, SoundLoadStatus>>({});
  const [playingId, setPlayingId] = useState<string>();

  const getAudio = useCallback((sound: MemeSound) => {
    const existing = cache.current.get(sound.id);
    if (existing) return existing;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = sound.url;
    audio.addEventListener('canplay', () => {
      setStatuses((current) => ({ ...current, [sound.id]: { state: 'ready' } }));
    }, { once: true });
    audio.addEventListener('error', () => {
      setStatuses((current) => ({
        ...current,
        [sound.id]: { state: 'error', error: 'Audio source is unavailable.' },
      }));
    }, { once: true });
    audio.addEventListener('ended', () => {
      if (activeId.current === sound.id) setPlayingId(undefined);
    });
    cache.current.set(sound.id, audio);
    return audio;
  }, []);

  const preloadSound = useCallback((sound: MemeSound) => {
    // Do not restart every clip when a custom sound is appended to the board.
    if (cache.current.has(sound.id)) return;
    setStatuses((current) => ({ ...current, [sound.id]: { state: 'loading' } }));
    getAudio(sound).load();
  }, [getAudio]);

  useEffect(() => {
    if (preload) sounds.forEach(preloadSound);
  }, [preload, preloadSound, sounds]);

  useEffect(() => () => {
    cache.current.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    cache.current.clear();
  }, []);

  const stop = useCallback(() => {
    if (!activeId.current) return;
    const audio = cache.current.get(activeId.current);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    activeId.current = undefined;
    setPlayingId(undefined);
  }, []);

  const preview = useCallback(async (sound: MemeSound) => {
    const audio = getAudio(sound);
    if (activeId.current === sound.id && !audio.paused) {
      stop();
      return;
    }
    stop();
    activeId.current = sound.id;
    try {
      await audio.play();
      setPlayingId(sound.id);
    } catch (error) {
      activeId.current = undefined;
      setPlayingId(undefined);
      setStatuses((current) => ({ ...current, [sound.id]: { state: 'error', error: errorMessage(error) } }));
    }
  }, [getAudio, stop]);

  return useMemo(() => ({ statuses, playingId, preview, stop, preloadSound }), [playingId, preloadSound, preview, statuses, stop]);
}
