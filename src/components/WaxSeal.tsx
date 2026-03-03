"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import styles from "./WaxSeal.module.css";

type ColorVariant = "gold" | "rose" | "sage";

const THEMES: Record<ColorVariant, Record<string, string>> = {
  gold: {
    "--c-base": "#c8960c",
    "--c-mid": "#dba818",
    "--c-light": "#f0cc5a",
    "--c-xlight": "#fae48a",
    "--c-dark": "#7a5500",
    "--c-xdark": "#4a3000",
    "--shadow": "rgba(80,55,0,0.45)",
    "--sheen": "rgba(255,245,160,0.40)",
  },
  rose: {
    "--c-base": "#9b3a5a",
    "--c-mid": "#b8486a",
    "--c-light": "#d96b85",
    "--c-xlight": "#f0a0b0",
    "--c-dark": "#5a1a2e",
    "--c-xdark": "#320d1a",
    "--shadow": "rgba(70,10,30,0.45)",
    "--sheen": "rgba(255,195,210,0.35)",
  },
  sage: {
    "--c-base": "#3d6b52",
    "--c-mid": "#4d8464",
    "--c-light": "#72a888",
    "--c-xlight": "#a8d4b8",
    "--c-dark": "#1e3d2b",
    "--c-xdark": "#0e2018",
    "--shadow": "rgba(15,45,25,0.45)",
    "--sheen": "rgba(175,235,195,0.30)",
  },
};

// RNG determinista (Mulberry32) para repetir el borde si das seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function waxEdgePath(opts: {
  cx: number;
  cy: number;
  r: number;
  points?: number;     // más puntos = borde más suave
  roughness?: number;  // amplitud imperfección
  wobble?: number;     // variación lenta (grandes “bultos”)
  seed?: number;
}) {
  const {
    cx, cy, r,
    points = 64,
    roughness = 4.2,
    wobble = 2.6,
    seed = 12345,
  } = opts;

  const rand = mulberry32(seed);

  // 1) ruido suave por capas (muy “cera”)
  const radii: number[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;

    // ruido rápido (imperfecciones pequeñas)
    const n1 = (rand() - 0.5) * 2;
    // ruido medio (bultos)
    const n2 = (rand() - 0.5) * 2;
    // ruido lento, determinista por seno/coseno
    const slow = Math.sin(a * 2.2) * 0.6 + Math.cos(a * 1.4) * 0.4;

    const rr = r + n1 * roughness + n2 * (roughness * 0.45) + slow * wobble;
    radii.push(rr);
  }

  // 2) construye puntos
  const pts = radii.map((rr, i) => {
    const a = (i / points) * Math.PI * 2;
    return {
      x: cx + Math.cos(a) * rr,
      y: cy + Math.sin(a) * rr,
    };
  });

  // 3) path suavizado con “quadratic through midpoints”
  const mid = (p: any, q: any) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });

  let d = "";
  const p0 = pts[0];
  const p1 = pts[1];
  const m0 = mid(p0, p1);
  d += `M ${m0.x.toFixed(2)} ${m0.y.toFixed(2)} `;

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const m = mid(p, q);
    d += `Q ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${m.x.toFixed(2)} ${m.y.toFixed(2)} `;
  }
  d += "Z";
  return d;
}

export interface WaxSealProps {
  initials?: string;           // "M · J"
  circularText?: string;       // texto en aro
  color?: ColorVariant;
  size?: number;               // px
  seed?: number;               // para repetir misma imperfección
  roughness?: number;          // 0..10 aprox
  onOpen?: () => void;
}

export default function WaxSeal({
  initials = "M · J",
  circularText = "MARIANA  ·  JUAN",
  color = "gold",
  size = 180,
  seed = 4242,
  roughness = 4.2,
  onOpen,
}: WaxSealProps) {
  const [state, setState] = useState<"entering" | "idle" | "clicking" | "gone">("entering");

  useEffect(() => {
    const t = setTimeout(() => setState("idle"), 60);
    return () => clearTimeout(t);
  }, []);

  const handleActivate = useCallback(() => {
    if (state !== "idle") return;
    setState("clicking");
    setTimeout(() => {
      setState("gone");
      onOpen?.();
    }, 480);
  }, [state, onOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  }, [handleActivate]);

  if (state === "gone") return null;

  const theme = THEMES[color];
  const vp = 260;
  const cx = 130, cy = 130;

  const edgeD = useMemo(() => {
    return waxEdgePath({
      cx, cy,
      r: 122,
      points: 72,
      roughness,
      wobble: 2.6,
      seed,
    });
  }, [roughness, seed]);

  return (
    <div
      className={`${styles.seal} ${styles[state]}`}
      style={{ ...(theme as React.CSSProperties), ["--sz" as any]: `${size}px` } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label="Abrir invitación"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <svg viewBox={`0 0 ${vp} ${vp}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="discGrad" cx="40%" cy="36%" r="66%">
            <stop offset="0%"   stopColor="var(--c-xlight)"/>
            <stop offset="24%"  stopColor="var(--c-light)"/>
            <stop offset="56%"  stopColor="var(--c-mid)"/>
            <stop offset="84%"  stopColor="var(--c-base)"/>
            <stop offset="100%" stopColor="var(--c-xdark)"/>
          </radialGradient>

          <radialGradient id="sheenGrad" cx="34%" cy="28%" r="55%">
            <stop offset="0%"   stopColor="var(--sheen)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>

          {/* Grano suave */}
          <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="7" result="n"/>
            <feColorMatrix in="n" type="saturate" values="0" result="g"/>
            <feComponentTransfer in="g">
              <feFuncA type="linear" slope="0.08"/>
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
          </filter>

          <clipPath id="sealClip">
            <path d={edgeD}/>
          </clipPath>

          <path id="textCircle" d={`M ${cx},${cy} m -88,0 a 88,88 0 1,1 176,0 a 88,88 0 1,1 -176,0`} />
        </defs>

        {/* Disco imperfecto (clip) */}
        <g clipPath="url(#sealClip)">
          <rect width={vp} height={vp} fill="url(#discGrad)"/>
          <rect width={vp} height={vp} fill="url(#discGrad)" filter="url(#grain)" opacity="0.22"/>
          <ellipse
            cx="104" cy="88" rx="84" ry="58"
            fill="url(#sheenGrad)"
            transform="rotate(-18 104 88)"
            opacity="0.95"
          />
        </g>

        {/* Borde irregular (relieve) */}
        <path d={edgeD} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" opacity="0.75"/>
        <path d={edgeD} fill="none" stroke="var(--c-xdark)" strokeWidth="5.5" opacity="0.25"/>

        {/* Doble aro interior */}
        <circle cx={cx} cy={cy} r="106" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" opacity="0.7"/>
        <circle cx={cx} cy={cy} r="104" fill="none" stroke="var(--c-xdark)" strokeWidth="0.8" opacity="0.35"/>
        <circle cx={cx} cy={cy} r="96"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" opacity="0.55"/>

        {/* Texto circular */}
        <text
          fontFamily="Cinzel, 'Cormorant Garamond', Georgia, serif"
          fontSize="8.6"
          fontWeight="500"
          letterSpacing="3.1"
          clipPath="url(#sealClip)"
        >
          <textPath href="#textCircle" startOffset="7%">
            <tspan fill="var(--c-xdark)" opacity="0.55" dy="1.6">{circularText}</tspan>
          </textPath>
        </text>
        <text
          fontFamily="Cinzel, 'Cormorant Garamond', Georgia, serif"
          fontSize="8.6"
          fontWeight="500"
          letterSpacing="3.1"
          clipPath="url(#sealClip)"
        >
          <textPath href="#textCircle" startOffset="7%">
            <tspan fill="rgba(255,255,255,0.25)" opacity="0.9" dy="0">{circularText}</tspan>
          </textPath>
        </text>

        {/* Monograma fino */}
        <text
          x={cx} y="150"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Didot', 'Bodoni MT', Georgia, serif"
          fontSize="44"
          fontStyle="italic"
          fontWeight="300"
          letterSpacing="0.12em"
          fill="rgba(45,30,10,0.82)"
        >
          {initials}
        </text>
        <text
          x={cx} y="150"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Didot', 'Bodoni MT', Georgia, serif"
          fontSize="44"
          fontStyle="italic"
          fontWeight="300"
          letterSpacing="0.12em"
          fill="rgba(255,255,255,0.12)"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}