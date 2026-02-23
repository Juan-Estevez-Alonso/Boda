"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./FlipCountdown.module.css";

type Parts = { days: number; hours: number; mins: number; secs: number; done: boolean };

function getPartsFromMs(targetMs: number): Parts {
  const now = Date.now();
  const ms = targetMs - now;

  if (ms <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return { days, hours, mins, secs, done: false };
}

function pad(n: number, min = 2) {
  const s = String(n);
  return s.length >= min ? s : s.padStart(min, "0");
}

function FlipUnit({
  value,
  label,
  minDigits = 2,
}: {
  value: string;
  label: string;
  minDigits?: number;
}) {
  const [prev, setPrev] = useState(value);
  const [curr, setCurr] = useState(value);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (value === curr) return;
    setPrev(curr);
    setCurr(value);
    setPlay(true);
    const t = setTimeout(() => setPlay(false), 720);
    return () => clearTimeout(t);
  }, [value, curr]);

  const widthCh = Math.max(minDigits, curr.length);

  return (
    <div className={styles.unit} style={{ ["--w" as any]: `${widthCh}ch` }}>
      <div className={`${styles.card} ${play ? styles.play : ""}`}>
        <div className={`${styles.half} ${styles.top}`}>
          <span className={`${styles.num} ${styles.numTop}`}>{curr}</span>
        </div>
        <div className={`${styles.half} ${styles.bottom}`}>
          <span className={`${styles.num} ${styles.numBottom}`}>{curr}</span>
        </div>

        <div className={`${styles.flap} ${styles.topFlap}`}>
          <span className={`${styles.num} ${styles.numTop}`}>{prev}</span>
        </div>
        <div className={`${styles.flap} ${styles.bottomFlap}`}>
          <span className={`${styles.num} ${styles.numBottom}`}>{curr}</span>
        </div>
      </div>

      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function FlipCountdown({ isoTarget }: { isoTarget: string }) {
  const targetMs = useMemo(() => new Date(isoTarget).getTime(), [isoTarget]);

  // ✅ SSR + primer render cliente: valores estables
  const [mounted, setMounted] = useState(false);
  const [p, setP] = useState<Parts>({ days: 0, hours: 0, mins: 0, secs: 0, done: false });

  useEffect(() => {
    setMounted(true);

    // primer cálculo ya en cliente
    setP(getPartsFromMs(targetMs));

    const id = setInterval(() => {
      setP(getPartsFromMs(targetMs));
    }, 1000);

    return () => clearInterval(id);
  }, [targetMs]);

  // ✅ Mientras no ha montado: pinta placeholder fijo (evita mismatch)
  const show = mounted ? p : { days: 0, hours: 0, mins: 0, secs: 0, done: false };

  return (
    <div className={styles.wrap} suppressHydrationWarning>
      <div className={styles.header}>
        <div className={styles.kicker}>{show.done ? "ES HOY 👀" : "Cuenta atrás"}</div>
        <div className={styles.sub}>{show.done ? "Ponte guapo/a que esto empieza." : "03 · 10 · 2026"}</div>
      </div>

      <div className={styles.grid}>
        <FlipUnit value={pad(show.days, 2)} label="DÍAS" minDigits={2} />
        <FlipUnit value={pad(show.hours, 2)} label="HORAS" minDigits={2} />
        <FlipUnit value={pad(show.mins, 2)} label="MIN" minDigits={2} />
        <FlipUnit value={pad(show.secs, 2)} label="SEG" minDigits={2} />
      </div>
    </div>
  );
}
