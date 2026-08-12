'use client';

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import {
  isPickupCollected,
  isPickupMissed,
  LANES,
  MAX_STRIKES,
  MemeSound,
  Pickup,
  pickupMeta,
} from './gameLogic';
import styles from './MemeRushGame.module.css';

const SPAWN_DELAY_MS = 1250;
const TRACK_SPEED_PER_SECOND = 24;
const SOUND_ORDER: MemeSound[] = ['airhorn', 'bruh', 'vine', 'wow'];

/** A keyboard- and touch-friendly endless pickup mini-game. */
export default function MemeRushGame() {
  const [bikeLane, setBikeLane] = useState(0);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [running, setRunning] = useState(false);
  const [lastPickup, setLastPickup] = useState<string | null>(null);

  const bikeLaneRef = useRef(bikeLane);
  const runningRef = useRef(running);
  const strikesRef = useRef(strikes);
  const nextId = useRef(1);
  const lastFrame = useRef<number | null>(null);
  const lastSpawn = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => { bikeLaneRef.current = bikeLane; }, [bikeLane]);
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { strikesRef.current = strikes; }, [strikes]);

  const playPickupFeedback = useCallback((sound: MemeSound) => {
    if (typeof window === 'undefined') return;
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;
    void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = sound === 'vine' ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(pickupMeta[sound].frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(55, pickupMeta[sound].frequency / 2),
      context.currentTime + 0.18,
    );
    gain.gain.setValueAtTime(0.16, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  }, []);

  const moveBike = useCallback((direction: -1 | 1) => {
    if (!runningRef.current) return;
    setBikeLane((lane) => Math.max(-1, Math.min(1, lane + direction)));
  }, []);

  const restart = useCallback(() => {
    nextId.current = 1;
    lastFrame.current = null;
    lastSpawn.current = performance.now();
    setBikeLane(0);
    setPickups([]);
    setScore(0);
    setStrikes(0);
    setLastPickup(null);
    setRunning(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        event.preventDefault();
        moveBike(-1);
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        event.preventDefault();
        moveBike(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [moveBike]);

  useEffect(() => {
    let frameId = 0;
    const animate = (now: number) => {
      if (runningRef.current) {
        const previous = lastFrame.current ?? now;
        const deltaSeconds = Math.min((now - previous) / 1000, 0.1);
        lastFrame.current = now;

        if (now - lastSpawn.current >= SPAWN_DELAY_MS) {
          lastSpawn.current = now;
          const sound = SOUND_ORDER[Math.floor(Math.random() * SOUND_ORDER.length)];
          const lane = LANES[Math.floor(Math.random() * LANES.length)];
          setPickups((current) => [...current, { id: nextId.current++, sound, lane, progress: -8 }]);
        }

        setPickups((current) => {
          let collected: MemeSound | undefined;
          let misses = 0;
          const remaining = current.flatMap((pickup) => {
            const moved = { ...pickup, progress: pickup.progress + TRACK_SPEED_PER_SECOND * deltaSeconds };
            if (isPickupCollected(moved, bikeLaneRef.current)) {
              collected = moved.sound;
              return [];
            }
            if (isPickupMissed(moved)) {
              misses += 1;
              return [];
            }
            return [moved];
          });

          if (collected) {
            const item = collected;
            setScore((value) => value + 100);
            setLastPickup(`${pickupMeta[item].icon} ${pickupMeta[item].label} collected!`);
            playPickupFeedback(item);
          }
          if (misses) {
            setStrikes((value) => {
              const next = Math.min(MAX_STRIKES, value + misses);
              if (next >= MAX_STRIKES) setRunning(false);
              return next;
            });
          }
          return remaining;
        });
      } else {
        lastFrame.current = now;
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [playPickupFeedback]);

  const gameOver = strikes >= MAX_STRIKES;
  const bikePosition = `${50 + bikeLane * 25}%`;

  return (
    <section className={styles.game} aria-label="Meme Rush pickup game">
      <header className={styles.hud}>
        <div><span>Score</span><strong>{score}</strong></div>
        <div className={styles.strikes} aria-label={`${strikes} of ${MAX_STRIKES} strikes`}>
          <span>Misses</span>
          <strong>{Array.from({ length: MAX_STRIKES }, (_, index) => <i key={index} className={index < strikes ? styles.activeStrike : ''}>✕</i>)}</strong>
        </div>
      </header>

      <div className={styles.track}>
        <div className={styles.roadLines} />
        {pickups.map((pickup) => {
          const meta = pickupMeta[pickup.sound];
          const style = { '--pickup-x': `${50 + pickup.lane * 25}%`, '--pickup-y': `${pickup.progress}%` } as CSSProperties;
          return <div key={pickup.id} className={styles.pickup} style={style} aria-label={`${meta.label} pickup`}><span>{meta.icon}</span></div>;
        })}
        <div className={styles.bike} style={{ left: bikePosition }} aria-label="Your bike">🚲</div>

        {!running && !gameOver && <button className={styles.startButton} onClick={restart}>Start ride</button>}
        {gameOver && <div className={styles.gameOver}><p>GAME OVER</p><span>Three sounds escaped the feed.</span><button onClick={restart}>Ride again</button></div>}
      </div>

      <div className={styles.controls}>
        <button onClick={() => moveBike(-1)} disabled={!running} aria-label="Move bike left">←</button>
        <p>{lastPickup ?? (running ? 'Catch sound icons before they pass you!' : 'Start the ride to collect meme sounds.')}</p>
        <button onClick={() => moveBike(1)} disabled={!running} aria-label="Move bike right">→</button>
      </div>
    </section>
  );
}
