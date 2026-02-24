"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./WeddingEnvelopeIntro.module.css";

type Dust = {
  left: string;
  bottom: string;
  size: string;
  opacity: number;
  delay: string;
  duration: string;
};

export default function WeddingEnvelopeIntro() {
  const [gone, setGone] = useState(false);
  const [lift, setLift] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [dust, setDust] = useState<Dust[]>([]);
  const doneRef = useRef(false);

  // Bloquea scroll mientras el overlay está activo
  useEffect(() => {
  const prev = document.body.style.overflow;

  if (!gone) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = prev || "";
  }

  return () => {
    document.body.style.overflow = prev;
  };
}, [gone]);

  // Dust solo en cliente (evita hydration mismatch)
  useEffect(() => {
    const arr: Dust[] = Array.from({ length: 20 }).map(() => {
      const s = 0.5 + Math.random() * 2;
      return {
        left: `${Math.random() * 100}vw`,
        bottom: `${Math.random() * 50}vh`,
        size: `${s}px`,
        opacity: 0.1 + Math.random() * 0.28,
        delay: `${Math.random() * 14}s`,
        duration: `${11 + Math.random() * 13}s`,
      };
    });
    setDust(arr);
  }, []);

  const openEnvelope = () => {
    if (doneRef.current) return;
    doneRef.current = true;

    setPulsing(false);

    // levantar flap (como tu script)
    window.setTimeout(() => setLift(true), 320);

    // desaparecer overlay
    window.setTimeout(() => setGone(true), 1200);
  };

  const onSealAnimEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // tras el pop, empieza el pulse
    if (e.animationName.includes("sealPop")) setPulsing(true);
  };

  return (
    <div className={`${styles.root} ${gone ? styles.gone : ""}`} aria-hidden={gone}>
      <div className={styles.stage}>
        <svg
          className={styles.envSvg}
          viewBox="0 0 625 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyG" x1="0" y1="0" x2=".15" y2="1">
              <stop offset="0%" stopColor="#fdfaf5" />
              <stop offset="50%" stopColor="#faf6ef" />
              <stop offset="100%" stopColor="#f4efe6" />
            </linearGradient>
            <linearGradient id="flapTopG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fefcf8" />
              <stop offset="100%" stopColor="#f7f3eb" />
            </linearGradient>
            <linearGradient id="flapBotG" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ede9e0" />
              <stop offset="100%" stopColor="#f5f1e9" />
            </linearGradient>
            <linearGradient id="sideGl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8e4db" />
              <stop offset="100%" stopColor="#f0ece4" />
            </linearGradient>
            <linearGradient id="sideGr" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#e8e4db" />
              <stop offset="100%" stopColor="#f0ece4" />
            </linearGradient>

            <filter id="paperTexture" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.65 0.55" numOctaves="4" seed="2" stitchTiles="stitch" result="grain"/>
              <feTurbulence type="turbulence" baseFrequency="0.018 0.008" numOctaves="2" seed="8" stitchTiles="stitch" result="fibre"/>
              <feMerge result="noise">
                <feMergeNode in="grain"/>
                <feMergeNode in="fibre"/>
              </feMerge>
              <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise"/>
              <feComponentTransfer in="grayNoise" result="fadedNoise">
                <feFuncA type="linear" slope="0.08"/>
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="fadedNoise" mode="multiply" result="textured"/>
              <feComponentTransfer in="textured">
                <feFuncR type="linear" slope="1.03" intercept="-0.01"/>
                <feFuncG type="linear" slope="1.03" intercept="-0.01"/>
                <feFuncB type="linear" slope="1.03" intercept="-0.01"/>
              </feComponentTransfer>
            </filter>

            <filter id="envShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#000" floodOpacity=".45"/>
            </filter>

            <clipPath id="envClip">
              <rect x="0" y="0" width="625" height="1000"/>
            </clipPath>
          </defs>

          <g clipPath="url(#envClip)" filter="url(#paperTexture)">
            <rect className={styles.fillBody} x="0" y="0" width="625" height="1000" fill="url(#bodyG)"/>

            <polygon className={styles.fillTop} points="0,0 625,0 595,30 312.5,500 30,30" fill="url(#flapTopG)"/>
            <polygon className={styles.fillBot} points="0,1000 625,1000 595,850 312.5,500 30,850" fill="url(#flapBotG)"/>

            <polygon className={styles.fillSide} points="0,0 30,30 312.5,500 30,850 0,1000" fill="url(#sideGl)"/>
            <polygon className={styles.fillSide} points="625,0 595,30 312.5,500 595,850 625,1000" fill="url(#sideGr)"/>
          </g>

          <rect x="0" y="0" width="625" height="1000" fill="none" filter="url(#envShadow)" opacity=".35"/>

          {/* <rect className={`${styles.envLine} ${styles.lBorder}`} x="3" y="3" width="619" height="994" rx="2"/> */}
          {/* <rect className={`${styles.envLine} ${styles.lInner}`} x="16" y="16" width="593" height="968" rx="2"/> */}

          <line className={`${styles.envLine} ${styles.lTl} ${styles.shadowLeft}`} x1="-50" y1="30" x2="312.5" y2="500"/>
          <line className={`${styles.envLine} ${styles.lTr} ${styles.shadowLeft}`} x1="670" y1="30" x2="312.5" y2="500"/>
          <line className={`${styles.envLine} ${styles.lBl} ${styles.shadowLeft}`} x1="0" y1="850" x2="312.5" y2="500"/>
          <line className={`${styles.envLine} ${styles.lBr} ${styles.shadowLeft}`} x1="670" y1="850" x2="312.5" y2="500"/>
        </svg>
      </div>

      {/* FLAP (CSS) */}
      <div className={styles.flapWrap} aria-hidden="true">
        <div className={`${styles.flapDiv} ${lift ? styles.lift : ""}`} />
        <svg
          className={`${styles.flapBorderSvg} ${lift ? styles.flapBorderHide : ""}`}
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline className={styles.flapBorderLine} points="0,0 500,500 1000,0" />
        </svg>
      </div>

      {/* WAX SEAL */}
      <div
        className={`${styles.seal} ${pulsing ? styles.pulse : ""}`}
        onClick={openEnvelope}
        onAnimationEnd={onSealAnimEnd}
        role="button"
        aria-label="Pulsa el sello para abrir"
      >
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="waxBody" cx="42%" cy="35%" r="68%">
              <stop offset="0%" stopColor="#8a9e55"/>
              <stop offset="40%" stopColor="#526634"/>
              <stop offset="100%" stopColor="#2d3d18"/>
            </radialGradient>
            <radialGradient id="waxSheen" cx="30%" cy="25%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </radialGradient>
            <filter id="waxShadow">
              <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity=".55"/>
            </filter>
          </defs>

          <path
            d="M 70,18 C 88,16 106,24 116,38 C 126,50 128,62 124,76 C 122,84 118,90 120,98 C 123,108 118,122 108,128 C 98,134 84,132 74,128 C 66,125 60,118 52,120 C 42,123 30,116 24,106 C 18,96 20,82 18,72 C 16,60 18,48 26,38 C 34,28 48,18 62,17 C 65,16 68,18 70,18 Z"
            fill="url(#waxBody)"
            filter="url(#waxShadow)"
          />
          <path
            d="M 70,18 C 88,16 106,24 116,38 C 126,50 128,62 124,76 C 122,84 118,90 120,98 C 123,108 118,122 108,128 C 98,134 84,132 74,128 C 66,125 60,118 52,120 C 42,123 30,116 24,106 C 18,96 20,82 18,72 C 16,60 18,48 26,38 C 34,28 48,18 62,17 C 65,16 68,18 70,18 Z"
            fill="url(#waxSheen)"
          />
          <path
            d="M 70,18 C 88,16 106,24 116,38 C 126,50 128,62 124,76 C 122,84 118,90 120,98 C 123,108 118,122 108,128 C 98,134 84,132 74,128 C 66,125 60,118 52,120 C 42,123 30,116 24,106 C 18,96 20,82 18,72 C 16,60 18,48 26,38 C 34,28 48,18 62,17 C 65,16 68,18 70,18 Z"
            fill="none"
            stroke="rgba(200,175,85,0.55)"
            strokeWidth="1.5"
          />

          <g fontFamily="'Cormorant SC', serif" style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.55))" }}>
            <text x="38" y="78" textAnchor="middle" fontSize="34" fontWeight="500" fill="rgba(242,228,170,0.97)">M</text>
            <text x="70" y="72" textAnchor="middle" fontSize="18" fontWeight="300" fill="rgba(210,185,100,0.85)">&amp;</text>
            <text x="102" y="78" textAnchor="middle" fontSize="34" fontWeight="500" fill="rgba(242,228,170,0.97)">J</text>
          </g>
        </svg>
      </div>

      <div className={styles.hint}>— Pulsa el sello para abrir —</div>

      {/* Dust */}
      {dust.map((d, i) => (
        <div
          key={i}
          className={styles.dust}
          style={{
            left: d.left,
            bottom: d.bottom,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
