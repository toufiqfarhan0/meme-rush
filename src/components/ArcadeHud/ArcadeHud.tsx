"use client";

import { useEffect, useState } from "react";
import styles from "./ArcadeHud.module.css";

const HIGH_SCORE_KEY = "meme-rush:high-score";
const MAX_LIVES = 3;

export type ArcadeHudProps = {
  /** Current run score. */
  score: number;
  /** Remaining lives, from 0 through 3. */
  lives: number;
  /** Current game speed. Values are displayed as MPH. */
  speed: number;
  /** Consecutive meme sounds collected in this run. */
  combo?: number;
  /** Override the saved high score when the game has one from another store. */
  highScore?: number;
  /** Called when the player chooses to start another run. */
  onRestart: () => void;
  className?: string;
};

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`${styles.heart} ${filled ? styles.heartFilled : styles.heartEmpty}`}
      viewBox="0 0 24 24"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

/**
 * Persistent high score and the in-game HUD are deliberately packaged together so
 * a game loop only needs to supply its current run state.
 */
export function ArcadeHud({
  score,
  lives,
  speed,
  combo = 0,
  highScore,
  onRestart,
  className = "",
}: ArcadeHudProps) {
  const [storedHighScore, setStoredHighScore] = useState(0);
  const [runWasNewHighScore, setRunWasNewHighScore] = useState(false);
  const [highScoreReady, setHighScoreReady] = useState(false);
  const safeLives = Math.max(0, Math.min(MAX_LIVES, lives));
  const isGameOver = safeLives === 0;
  const bestScore = Math.max(score, highScore ?? 0, storedHighScore);
  const isNewRecord = isGameOver && runWasNewHighScore;

  useEffect(() => {
    const saved = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = saved ? Number.parseInt(saved, 10) : 0;
    if (Number.isFinite(parsed) && parsed > 0) setStoredHighScore(parsed);
    setHighScoreReady(true);
  }, []);

  useEffect(() => {
    if (!highScoreReady) return;
    if (!isGameOver) {
      setRunWasNewHighScore(false);
      return;
    }
    if (score <= Math.max(highScore ?? 0, storedHighScore)) return;
    window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
    setRunWasNewHighScore(true);
    setStoredHighScore(score);
  }, [highScore, highScoreReady, isGameOver, score, storedHighScore]);

  return (
    <section className={`${styles.hud} ${className}`} aria-label="Game status">
      <div className={styles.topRail}>
        <div className={`${styles.panel} ${styles.livesPanel}`}>
          <span className={styles.panelLabel}>LIVES</span>
          <div aria-label={`${safeLives} lives remaining`} className={styles.hearts}>
            {Array.from({ length: MAX_LIVES }, (_, index) => (
              <Heart key={index} filled={index < safeLives} />
            ))}
          </div>
          <span className={styles.missCounter}>MISSES: {MAX_LIVES - safeLives}/3</span>
        </div>

        <div className={`${styles.panel} ${styles.scorePanel}`}>
          <span className={styles.panelLabel}>SCORE</span>
          <output className={styles.score} aria-label={`Score ${score}`}>{score.toLocaleString().padStart(6, "0")}</output>
          <span className={styles.best}>BEST {bestScore.toLocaleString().padStart(6, "0")}</span>
        </div>

        <div className={`${styles.panel} ${styles.speedPanel}`}>
          <span className={styles.panelLabel}>RUSH SPEED</span>
          <div className={styles.speedReadout}>
            <output aria-label={`Speed ${Math.round(speed)} miles per hour`}>{Math.round(speed)}</output>
            <span>MPH</span>
          </div>
          <div className={styles.speedBars} aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <i key={index} className={index < Math.min(6, Math.ceil(speed / 20)) ? styles.barActive : ""} />)}
          </div>
        </div>
      </div>

      {combo >= 2 && (
        <div className={styles.combo} aria-live="polite">
          <span>MEME SOUND</span>
          <strong>{combo}X COMBO!</strong>
        </div>
      )}

      {isGameOver && (
        <div className={styles.gameOverBackdrop} role="presentation">
          <div className={styles.gameOver} role="dialog" aria-modal="true" aria-labelledby="game-over-title">
            <p className={styles.crash}>/// RUN TERMINATED ///</p>
            <h1 id="game-over-title">GAME OVER</h1>
            {isNewRecord && <p className={styles.newRecord}>★ NEW HIGH SCORE ★</p>}
            <div className={styles.finalScore}>
              <span>FINAL SCORE</span>
              <strong>{score.toLocaleString()}</strong>
              <small>HIGH SCORE {bestScore.toLocaleString()}</small>
            </div>
            <button type="button" className={styles.restartButton} onClick={onRestart} autoFocus>
              <span aria-hidden="true">↻</span> RESTART RUSH
            </button>
            <p className={styles.hint}>LOCK IN &amp; RIDE AGAIN</p>
          </div>
        </div>
      )}
    </section>
  );
}

export { HIGH_SCORE_KEY };
