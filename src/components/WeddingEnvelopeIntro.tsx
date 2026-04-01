"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import styles from "./WeddingEnvelopeIntro.module.css";
import WaxSeal from "@/components/WaxSeal";
import SealLogoButton from "@/components/SealLogoButton";

type Particle = {
    id: number;
    left: number;
    bottom: number;
    size: number;
    delay: number;
    duration: number;
    type: "dust" | "petal";
    rotate: number;
    drift: number;
};

const OFFSET_X_PX = 220;
const OFFSET_Y_PX = 90;

type LineOrigins = {
    tlx: number; tly: number;
    trx: number; try_: number;
    blx: number; bly: number;
    brx: number; bry: number;
};

const calcOrigins = (): LineOrigins => {
    const ox = (OFFSET_X_PX / window.innerWidth) * 1200;
    const oy = (OFFSET_Y_PX / window.innerHeight) * 1000;
    return {
        tlx: -ox,      tly: -oy,
        trx: 625 + ox, try_: -oy,
        blx: -ox,      bly: 1000 + oy,
        brx: 625 + ox, bry: 1000 + oy,
    };
};

export default function WeddingEnvelopeIntro() {
    const [gone, setGone] = useState(false);
    const [lift, setLift] = useState(false);
    const [pulsing, setPulsing] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [origins, setOrigins] = useState<LineOrigins | null>(null);
    const doneRef = useRef(false);

    // Calcula orígenes antes del primer frame visible
    useLayoutEffect(() => {
        setOrigins(calcOrigins());
        const handleResize = () => setOrigins(calcOrigins());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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

    const openEnvelope = useCallback(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        setPulsing(false);
        setTimeout(() => setLift(true), 320);
        setTimeout(() => setGone(true), 1200);
    }, []);
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

                    {/* ── SVG Envelope — solo se renderiza cuando origins está listo ── */}
                    {origins && (
                        <svg
                            className={styles.envSvg}
                            viewBox="0 0 625 1000"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
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

                            <g clipPath="url(#envClip)" filter="url(#paperTexture)">
                                <polygon className={styles.fillSide}
                                    points={`${origins.tlx},${origins.tly} 312.5,500 ${origins.blx},${origins.bly}`}
                                    fill="url(#sideGl)" />
                                <polygon className={styles.fillSide}
                                    points={`${origins.trx},${origins.try_} 312.5,500 ${origins.brx},${origins.bry}`}
                                    fill="url(#sideGr)" />
                                <polygon className={styles.fillBot}
                                    points={`${origins.blx},${origins.bly} ${origins.brx},${origins.bry} 312.5,480`}
                                    fill="url(#flapBotG)" />
                                <polygon className={styles.fillTop}
                                    points={`${origins.tlx},${origins.tly} ${origins.trx},${origins.try_} 312.5,500`}
                                    fill="url(#flapTopG)" />
                            </g>

                            <rect x="0" y="0" width="625" height="1000"
                                fill="none" filter="url(#envShadow)" opacity="0.28" />

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
                        </svg>
                    )}

                    {/* ── Flap CSS ── */}
                    {origins && (
                        <div className={styles.flapWrap}>
                            <div className={`${styles.flapDiv} ${lift ? styles.lift : ""}`}>
                                <div className={styles.flapText}>
                                    ¡Tenemos algo que contaros!
                                </div>
                            </div>
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
                    )}
                </div>
            </div>

            {origins && (
            <>
                <SealLogoButton onOpen={openEnvelope} size={120} src="/Logo.svg" />
                {!gone && (
                    <div className={`${styles.pressHint} ${doneRef.current ? styles.hintOut : ""}`}>
                        Pulsa el sello para abrir tu invitación
                    </div>
                )}
            </>
            )}
        </>
    );
}