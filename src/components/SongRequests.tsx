"use client";
import { useEffect, useState } from "react";

type Song = { id: string; name: string; song: string; createdAt: string };

export default function SongRequests() {
  const [items, setItems] = useState<Song[]>([]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  async function load() {
    const res = await fetch("/api/songs");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    e.currentTarget.reset();
    setStatus("idle");
    load();
  }

  return (
    <div className="grid2">
      <form onSubmit={onSubmit} className="" style={{ padding: 16 }}>
        <div className="field">
          <label className="help">Tu nombre</label>
          <input className="input" name="name" required placeholder="Para asignarte el mérito (o la culpa)" />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label className="help">Canción + artista</label>
          <input className="input" name="song" required placeholder="Ej: ‘Vivir mi vida’ — Marc Anthony" />
        </div>

        <div style={{ height: 14 }} />
        <button className="btn btnPrimary" disabled={status === "sending"}>
          {status === "sending" ? "Guardando..." : "Proponer temazo"}
        </button>

        <div className="help" style={{ marginTop: 10 }}>
          Regla de oro: si hace cantar a gritos a medio salón, entra fijo.
        </div>
      </form>

      <div className="card" style={{ padding: 16 }}>
        <div className="kicker">Lista de temazos</div>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {items.length === 0 && (
            <div className="help">Aún no hay propuestas… alguien tiene que romper el hielo 👀</div>
          )}
          {items.slice(0, 12).map((s) => (
            <div key={s.id} className="card" style={{ padding: 12, boxShadow: "none" }}>
              <div style={{ fontWeight: 700 }}>{s.song}</div>
              <div className="help">— {s.name}</div>
            </div>
          ))}
          {items.length > 12 && <div className="help">…y {items.length - 12} más. Esto pinta muy bien.</div>}
        </div>
      </div>
    </div>
  );
}
