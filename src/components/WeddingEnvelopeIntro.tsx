"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WeddingEnvelopeIntro.module.css";
import WaxSeal from "@/components/WaxSeal";
import SealLogoButton from "@/components/SealLogoButton";

type Particle = {
    id: number;
    left: number;       // vw 0–100
    bottom: number;     // vh
    size: number;       // px
    delay: number;      // s
    duration: number;   // s
    type: "dust" | "petal";
    rotate: number;     // deg
    drift: number;      // px lateral drift
};

/*
  CÓMO FUNCIONA EL CÁLCULO RESPONSIVE:
  ─────────────────────────────────────
  El SVG tiene viewBox="0 0 625 1000" con preserveAspectRatio="none",
  lo que significa que se estira para cubrir exactamente 100vw × 100vh.

  Para que las líneas tengan el mismo ángulo visual en cualquier pantalla,
  calculamos los orígenes en coordenadas del viewBox a partir de
  cuántos píxeles reales queremos que salgan fuera de la pantalla.

  Fórmula:
    origen_x_svg = (px_fuera_pantalla / window.innerWidth)  * 625
    origen_y_svg = (py_fuera_pantalla / window.innerHeight) * 1000

  🔧 AJUSTA ESTOS DOS VALORES para cambiar el ángulo del sobre:
    OFFSET_X_PX: cuántos px reales salen las líneas por los lados
    OFFSET_Y_PX: cuántos px reales salen por arriba/abajo

  Al ser píxeles físicos, el ángulo visual es IDÉNTICO en móvil y escritorio.
*/
const OFFSET_X_PX = 220; // 🔧 px que salen por los lados
const OFFSET_Y_PX = 90; // 🔧 px que salen por arriba/abajo

type LineOrigins = {
    tlx: number; tly: number;
    trx: number; try_: number;
    blx: number; bly: number;
    brx: number; bry: number;
};

export default function WeddingEnvelopeIntro() {
    const [gone, setGone] = useState(false);
    const [lift, setLift] = useState(false);
    const [pulsing, setPulsing] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [origins, setOrigins] = useState<LineOrigins>({
        tlx: 0, tly: 500,
        trx: 625, try_: 0,
        blx: 0, bly: 1000,
        brx: 625, bry: 1000,
    });
    const doneRef = useRef(false);

    // Calcula orígenes al montar y al cambiar tamaño de pantalla
    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const ox = (OFFSET_X_PX / w) * 1200;
            const oy = (OFFSET_Y_PX / h) * 1000;
            setOrigins({
                tlx: -ox, tly: -oy,
                trx: 625 + ox, try_: -oy,
                blx: -ox, bly: 1000 + oy,
                brx: 625 + ox, bry: 1000 + oy,
            });
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    // Bloquea scroll mientras overlay está activo
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = gone ? prev || "" : "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [gone]);

    // Genera partículas solo en cliente
    useEffect(() => {
        const arr: Particle[] = Array.from({ length: 35 }).map((_, i) => {
            const isPetal = i % 4 === 0;
            return {
                id: i,
                left: Math.random() * 100,
                bottom: -5 + Math.random() * 50,
                size: isPetal ? 5 + Math.random() * 6 : 1.5 + Math.random() * 3,
                delay: Math.random() * 16,
                duration: 10 + Math.random() * 14,
                type: isPetal ? "petal" : "dust",
                rotate: Math.random() * 360,
                drift: (Math.random() - 0.5) * 60,
            };
        });
        setParticles(arr);
    }, []);

    const openEnvelope = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        setPulsing(false);
        setTimeout(() => setLift(true), 320);
        setTimeout(() => setGone(true), 1200);
    };

    const onSealAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if ((e.animationName || "").includes("sealPop")) setPulsing(true);
    };

    return (
        <>
            <div className={`${styles.overlay} ${gone ? styles.gone : ""}`}>
                <div className={styles.stage}>

                    {/* ── Partículas flotantes ── */}
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className={`${styles.particle} ${p.type === "petal" ? styles.petal : styles.dust}`}
                            style={{
                                left: `${p.left}vw`,
                                bottom: `${p.bottom}vh`,
                                width: `${p.size}px`,
                                height: p.type === "petal" ? `${p.size * 1.8}px` : `${p.size}px`,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                                "--rotate": `${p.rotate}deg`,
                                "--drift": `${p.drift}px`,
                            } as React.CSSProperties}
                            aria-hidden="true"
                        />
                    ))}

                    {/* ── SVG Envelope ── */}
                    <svg
                        className={styles.envSvg}
                        viewBox="0 0 625 1000"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/*
                ZOOM EFFECT: En la foto el sobre ocupa toda la pantalla
                y la solapa se ve muy pequeña (vértice muy alto ~25% del alto).
                Conseguimos esto:
                  - Solapa superior: vértice en y=280 (28% de 1000)
                  - Triángulo inferior: vértice en y=720
                  - Laterales: cuadriláteros entre esos puntos
                El SVG ya cubre 100vw×100vh con preserveAspectRatio="none",
                así que simplemente subimos/bajamos los vértices.
              */}

                            {/* Paleta crema #faf7f0 */}
                            {/* ── COLORES: Verde oliva clarito ── */}
                            <linearGradient id="flapTopG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#eef2e6" />
                                <stop offset="100%" stopColor="#dde6d0" />
                            </linearGradient>
                            <linearGradient id="flapBotG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#b8c4a8" />
                                <stop offset="55%" stopColor="#c8d4b8" />
                                <stop offset="100%" stopColor="#d4dfc6" />
                            </linearGradient>
                            <linearGradient id="sideGl" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ccd8bc" />
                                <stop offset="100%" stopColor="#bccaac" />
                            </linearGradient>
                            <linearGradient id="sideGr" x1="1" y1="0" x2="0" y2="0">
                                <stop offset="0%" stopColor="#ccd8bc" />
                                <stop offset="100%" stopColor="#bccaac" />
                            </linearGradient>

                            {/* Textura rugosa de papel */}
                            <filter id="paperTexture" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.95"
                                    numOctaves="3"
                                    seed="8"
                                    stitchTiles="stitch"
                                    result="n"
                                />
                                <feColorMatrix in="n" type="saturate" values="0" result="g" />
                                <feComponentTransfer in="g" result="a">
                                    <feFuncA type="linear" slope="0.18" />
                                </feComponentTransfer>

                                <feBlend in="SourceGraphic" in2="a" mode="multiply" />
                            </filter>

                            {/* Gradientes de pliegue */}
                            <linearGradient id="creaseL" x1="0" y1="0" x2="1" y2="0.5">
                                <stop offset="0%" stopColor="#f0f5e8" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#6a7a5a" stopOpacity="0.5" />
                            </linearGradient>
                            <linearGradient id="creaseR" x1="1" y1="0" x2="0" y2="0.5">
                                <stop offset="0%" stopColor="#f0f5e8" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#6a7a5a" stopOpacity="0.5" />
                            </linearGradient>
                            <linearGradient id="creaseBL" x1="0" y1="1" x2="0.5" y2="0">
                                <stop offset="0%" stopColor="#6a7a5a" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#eaf7d5" stopOpacity="0.5" />
                            </linearGradient>
                            <linearGradient id="creaseBR" x1="1" y1="1" x2="0.5" y2="0">
                                <stop offset="0%" stopColor="#6a7a4a" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#eaf7d5" stopOpacity="0.5" />
                            </linearGradient>

                            <filter id="envShadow" x="-5%" y="-5%" width="110%" height="110%">
                                <feDropShadow dx="0" dy="18" stdDeviation="26"
                                    floodColor="#2a2010" floodOpacity="0.38" />
                            </filter>
                            <clipPath id="envClip">
                                <rect x="0" y="0" width="625" height="1000" />
                            </clipPath>
                        </defs>

                        {/*
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              GEOMETRÍA DEL SOBRE — viewBox 625 × 1000
              Todo converge al punto central: (312.5, 500)

              Para cambiar el "zoom" (cuánto se ven las esquinas
              de la solapa), ajusta SOLO estos dos valores:
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            */}

                        {/* ── FILLS ── */}
                        <g clipPath="url(#envClip)" filter="url(#paperTexture)">

                            {/* LATERALES */}
                            <polygon className={styles.fillSide}
                                points={`${origins.tlx},${origins.tly} 312.5,500 ${origins.blx},${origins.bly}`}
                                fill="url(#sideGl)" />
                            <polygon className={styles.fillSide}
                                points={`${origins.trx},${origins.try_} 312.5,500 ${origins.brx},${origins.bry}`}
                                fill="url(#sideGr)" />

                            {/*
                SOLAPA INFERIOR
                🔧 El "480" es el apex vertical — más bajo = solapa más grande
              */}
                            <polygon className={styles.fillBot}
                                points={`${origins.blx},${origins.bly} ${origins.brx},${origins.bry} 312.5,480`}
                                fill="url(#flapBotG)" />

                            {/*
                SOLAPA SUPERIOR (la que se abre al hacer click)
              */}
                            <polygon className={styles.fillTop}
                                points={`${origins.tlx},${origins.tly} ${origins.trx},${origins.try_} 312.5,500`}
                                fill="url(#flapTopG)" />

                        </g>

                        <rect x="0" y="0" width="625" height="1000"
                            fill="none" filter="url(#envShadow)" opacity="0.28" />

                        {/*
              LÍNEAS DE PLIEGUE — usan los mismos orígenes calculados.
              El ángulo visual es idéntico en móvil y escritorio.
            */}
                        <line className={styles.lTl}
                            x1={origins.tlx} y1={origins.tly} x2="312.5" y2="500"
                            stroke="url(#creaseL)" />
                        <line className={styles.lTr}
                            x1={origins.trx} y1={origins.try_} x2="312.5" y2="500"
                            stroke="url(#creaseR)" />
                        <line className={styles.lBl}
                            x1={origins.blx} y1={origins.bly} x2="312.5" y2="500"
                            stroke="url(#creaseBL)" />
                        <line className={styles.lBr}
                            x1={origins.brx} y1={origins.bry} x2="312.5" y2="500"
                            stroke="url(#creaseBR)" />

                        {/* <rect className={styles.border} x="3" y="3" width="619" height="994" rx="2"/> */}
                    </svg>

                    {/* ── Flap CSS ── */}
                    <div className={styles.flapWrap}>
                        <div className={`${styles.flapDiv} ${lift ? styles.lift : ""}`} >
                            <div className={styles.flapText}>
                                ¡Tenemos algo que contaros!
                            </div>
                        </div>
                        {/* Sombra interior — aparece cuando la solapa sube, simula el interior del sobre */}
                        <div className={`${styles.innerShadow} ${lift ? styles.innerShadowShow : ""}`} />
                        <svg
                            className={styles.flapBorderSvg}
                            viewBox="0 0 1000 500"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ opacity: lift ? 0 : undefined, transition: "opacity 0.4s ease" }}
                        >
                            <defs>
                                <linearGradient id="flapLineL" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#f0f5e8" stopOpacity="0.95" />
                                    <stop offset="100%" stopColor="#6a7a5a" stopOpacity="0.45" />
                                </linearGradient>
                                <linearGradient id="flapLineR" x1="1" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f0f5e8" stopOpacity="0.95" />
                                    <stop offset="100%" stopColor="#6a7a5a" stopOpacity="0.45" />
                                </linearGradient>
                            </defs>
                            {/*
                Líneas del borde de la solapa — usan los mismos orígenes
                calculados que las líneas del SVG principal.
                El viewBox del flap es 1000×500, así que escalamos:
                  x: origins / 625 * 1000
                  y: origins_y / 1000 * 500  (solo la parte superior)
              */}
                            <line
                                x1={origins.tlx / 625 * 1000} y1={origins.tly / 1000 * 500}
                                x2="500" y2="500"
                                stroke="url(#flapLineL)" strokeWidth="2" />
                            <line
                                x1={origins.trx / 625 * 1000} y1={origins.try_ / 1000 * 500}
                                x2="500" y2="500"
                                stroke="url(#flapLineR)" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </div>

            <SealLogoButton onOpen={openEnvelope} size={120} src="/Logo.svg" />
            {!gone && (
            <div className={`${styles.pressHint} ${doneRef.current ? styles.hintOut : ""}`}>
                Pulsa el sello para abrir tu invitación
            </div>
            )}
        </>
    );
}