"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import FlipCountdown from "@/components/FlipCountdown";

export default function AfterHeroBlock() {
  const countdownRef = useRef<HTMLDivElement>(null);
  const [artIn, setArtIn] = useState(false);

  useEffect(() => {
    const el = countdownRef.current;
    if (!el) return;

    // “Banda” alrededor del centro del viewport (aprox 12% de altura)
    const io = new IntersectionObserver(
      ([entry]) => setArtIn(entry.isIntersecting),
      {
        root: null,
        threshold: 0.01,
        rootMargin: "-44% 0px -44% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ScrollReveal
      as="section"
      className={`afterHero afterHeroWithArt ${artIn ? "artIn" : ""}`}
      start={0.90}
      end={0.35}
    >
      {/* Imagen que entra por la derecha cuando el countdown está en el centro */}
      <div className="afterHeroArt" aria-hidden="true">
        <Image
          src="/fondo_verde.png"
          alt=""
          fill
          sizes="100vw"
          className="afterHeroArtImg"
          priority={false}
        />
      </div>

      <div className="container">
        <h2 className="afterHeroNames" style={{ fontFamily: "var(--font-lux)" }}>
          Mariana <span style={{ color: "var(--accent)" }}>&</span> Juan
        </h2>

        <div ref={countdownRef} className="afterHeroCountdown">
          <FlipCountdown isoTarget="2026-10-03T12:00:00+02:00" />
        </div>

        <div className="afterHeroActions">
          <a className="btn btnPrimary" href="#rsvp">Confirmar asistencia</a>
          <a className="btn btnPrimary" href="#mapa">Ver mapa</a>
        </div>
      </div>
    </ScrollReveal>
  );
}
