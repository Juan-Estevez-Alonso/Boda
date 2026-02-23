"use client";

import { useEffect, useState } from "react";

type Mode = "off" | "play" | "open";

export default function HeroPaint() {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "off";
    // ✅ Persistente incluso si React remonta en dev
    return sessionStorage.getItem("heroPaintPlayed") === "1" ? "open" : "off";
  });

  useEffect(() => {
    // Si ya se ejecutó esta sesión, no animamos
    if (sessionStorage.getItem("heroPaintPlayed") === "1") {
      setMode("open");
      return;
    }

    // ✅ Marcamos ANTES de animar (clave para StrictMode)
    sessionStorage.setItem("heroPaintPlayed", "1");

    // Arranca animación en el siguiente frame (evita “flash”)
    requestAnimationFrame(() => setMode("play"));

    // Al terminar, lo dejamos “abierto” (con salpicado alrededor)
    const t = setTimeout(() => setMode("open"), 1300);
    return () => clearTimeout(t);
  }, []);

  return <div className="heroPaint" data-mode={mode} aria-hidden="true" />;
}
