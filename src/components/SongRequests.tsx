"use client";

import { useEffect, useState } from "react";

type SongRequest = {
  id: string;
  created_at: string;
  name: string | null;
  song: string;
  artist: string | null;
  note: string | null;
};

export default function SongRequests() {
  const [items, setItems] = useState<SongRequest[]>([]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  async function load() {
    const res = await fetch("/api/song-requests", { cache: "no-store" });
    const json = await res.json();
    setItems(json.data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const fd = new FormData(e.currentTarget);

    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      song: String(fd.get("song") ?? "").trim(),
      artist: String(fd.get("artist") ?? "").trim(),
      note: String(fd.get("note") ?? "").trim(),
    };

    
    await fetch("/api/song-requests", {
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
          <label className="help">Tu nombre (opcional)</label>
          <input className="input" name="name" placeholder="Para asignarte el mérito (o la culpa)" />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label className="help">Canción *</label>
          <input className="input" name="song" required placeholder="Ej: Vivir mi vida" />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label className="help">Artista (opcional)</label>
          <input className="input" name="artist" placeholder="Ej: Marc Anthony" />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label className="help">Nota (opcional)</label>
          <input className="input" name="note" placeholder="Momento ideal / dedicatoria / etc." />
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
              <div style={{ fontWeight: 700 }}>
                {s.song}
                {s.artist ? <span className="help"> — {s.artist}</span> : null}
              </div>

              <div className="help">
                — {s.name ? s.name : "Anónimo"}
                {s.note ? <> · “{s.note}”</> : null}
              </div>
            </div>
          ))}

          {items.length > 12 && (
            <div className="help">…y {items.length - 12} más. Esto pinta muy bien.</div>
          )}
        </div>
      </div>
    </div>
  );
}