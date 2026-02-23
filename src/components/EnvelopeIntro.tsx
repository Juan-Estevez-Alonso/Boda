"use client";

import { useEffect, useState } from "react";

export default function EnvelopeIntro() {
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hidden]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    // al terminar la animación, quitamos el overlay por completo
    window.setTimeout(() => setHidden(true), 2350);
  };

  if (hidden) return null;

  return (
    <div className={`envIntro ${opening ? "isOpening" : ""}`} role="dialog" aria-label="Abrir invitación">
      <div className="envPaper" aria-hidden="true">
        <div className="envBack" />
        <div className="envPocket" />
        <div className="envFlap">
            <div className="envFlapShape" aria-hidden="true" />
        </div>
      </div>

      <button className="envSeal" onClick={open} aria-label="Abrir el sobre">
        <span className="envSealText">M<span aria-hidden="true">&</span>J</span>
      </button>
      <div className="waxBurst" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="waxDot" />
        ))}
        </div>

      <div className="envHint">Pulsa el lacre para abrir</div>

      {/* opcional: saltar */}
      <button className="envSkip" onClick={() => setHidden(true)}>Saltar</button>
    </div>
  );
}
