'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createMemeSoundBank } from '../../lib/meme-audio-bank';
import type { MemeSound } from '../../lib/meme-audio.types';
import { useMemeAudio } from '../../lib/use-meme-audio';
import styles from './MemeSoundboard.module.css';

export interface MemeSoundboardProps {
  /** Add curated or user-provided sounds; matching ids replace starter sounds. */
  sounds?: readonly MemeSound[];
  selectedSoundId?: string;
  onSelect?: (sound: MemeSound) => void;
  /** Enables the lightweight URL form for a user's own library. */
  allowCustomSounds?: boolean;
}

export function MemeSoundboard({
  sounds = [],
  selectedSoundId,
  onSelect,
  allowCustomSounds = true,
}: MemeSoundboardProps) {
  const [customSounds, setCustomSounds] = useState<MemeSound[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const bank = useMemo(() => createMemeSoundBank([...sounds, ...customSounds]), [sounds, customSounds]);
  const { playingId, preview, statuses } = useMemeAudio(bank);

  function addCustomSound(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;

    try {
      const parsed = new URL(trimmedUrl, window.location.href);
      if (!['https:', 'http:'].includes(parsed.protocol)) return;
      const id = `custom-${crypto.randomUUID()}`;
      setCustomSounds((current) => [...current, {
        id,
        name: trimmedName,
        description: 'Custom sound',
        category: 'reaction',
        source: 'custom',
        url: parsed.href,
      }]);
      setName('');
      setUrl('');
    } catch {
      // Browser native constraint feedback below covers malformed URLs.
    }
  }

  return (
    <section className={styles.soundboard} aria-labelledby="meme-soundboard-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Audio bank</p>
          <h2 id="meme-soundboard-title">Meme sounds</h2>
        </div>
        <span className={styles.preloadStatus} aria-live="polite">
          {Object.values(statuses).filter((status) => status.state === 'ready').length}/{bank.length} ready
        </span>
      </div>

      <div className={styles.grid} role="list">
        {bank.map((sound) => {
          const status = statuses[sound.id]?.state ?? 'idle';
          const isPlaying = playingId === sound.id;
          const isSelected = selectedSoundId === sound.id;
          return (
            <article className={`${styles.card} ${isSelected ? styles.selected : ''}`} key={sound.id} role="listitem">
              <div className={styles.soundInfo}>
                <span className={styles.category}>{sound.category}</span>
                <h3>{sound.name}</h3>
                <p>{sound.description}</p>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.preview}
                  type="button"
                  onClick={() => void preview(sound)}
                  aria-label={`${isPlaying ? 'Stop' : 'Preview'} ${sound.name}`}
                  aria-pressed={isPlaying}
                  disabled={status === 'error'}
                >
                  {isPlaying ? '■ Stop' : status === 'loading' ? '… Loading' : '▶ Preview'}
                </button>
                <button className={styles.use} type="button" onClick={() => onSelect?.(sound)}>
                  {isSelected ? 'Added' : 'Use sound'}
                </button>
              </div>
              {status === 'error' && <p className={styles.error}>Preview unavailable. Try another source.</p>}
            </article>
          );
        })}
      </div>

      {allowCustomSounds && (
        <form className={styles.customForm} onSubmit={addCustomSound}>
          <strong>Add a custom clip</strong>
          <label>
            Sound name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={48} required />
          </label>
          <label>
            MP3 URL
            <input value={url} onChange={(event) => setUrl(event.target.value)} type="url" placeholder="https://cdn.example.com/sound.mp3" required />
          </label>
          <button type="submit">Add to board</button>
        </form>
      )}
    </section>
  );
}
