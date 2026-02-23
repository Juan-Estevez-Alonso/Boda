"use client";
import { useEffect, useMemo, useState } from "react";

function getDiff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(ms / 1000);
  return {
    total: ms,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

export default function Countdown({ isoTarget }: { isoTarget: string }) {
  const target = useMemo(() => new Date(isoTarget), [isoTarget]);
  const [t, setT] = useState(() => getDiff(target));

  useEffect(() => {
    const id = setInterval(() => setT(getDiff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const ended = t.total === 0;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="kicker">{ended ? "ES HOY. NO TE RAJES." : "Cuenta atrás"}</div>
      <div className="grid3" style={{ marginTop: 12 }}>
        <Stat label="Días" value={t.days} />
        <Stat label="Horas" value={t.hours} />
        <Stat label="Min" value={t.mins} />
      </div>
      <div className="help" style={{ marginTop: 10 }}>
        {ended ? "Si estás leyendo esto… ya deberías estar arreglándote 😄" : `Y segundos: ${t.secs}`}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: 12, boxShadow: "none" }}>
      <div style={{ fontFamily: "var(--font-lux)", fontSize: 30 }}>{value}</div>
      <div className="help">{label}</div>
    </div>
  );
}
