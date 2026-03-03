"use client";

import { useEffect, useRef, useState } from "react";

type SongRequest = {
  id: string;
  created_at: string;
  name: string | null;
  song: string;
  artist: string | null;
  note: string | null;
  likes?: number | null;
};

export default function SongRequests() {
  const [items, setItems] = useState<SongRequest[]>([]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const inflightRef = useRef(false);
  const likingRef = useRef<Record<string, boolean>>({}); // evita spam por item

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function load() {
    if (!mountedRef.current) return;
    setError(null);

    try {
      const res = await fetch("/api/song-requests", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json.message || `Error ${res.status}`);
      }

      if (!mountedRef.current) return;
      setItems(json.data ?? []);
    } catch (e: any) {
      if (!mountedRef.current) return;
      setError(e?.message ?? "Error cargando canciones");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inflightRef.current) return;
    inflightRef.current = true;

    setStatus("sending");
    setError(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      song: String(fd.get("song") ?? "").trim(),
      artist: String(fd.get("artist") ?? "").trim(),
      note: String(fd.get("note") ?? "").trim(),
    };

    if (!payload.song) {
      setError("La canción es obligatoria.");
      setStatus("idle");
      inflightRef.current = false;
      return;
    }

    try {
      const res = await fetch("/api/song-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.message || `Error ${res.status}`);
      }

      if (mountedRef.current) formEl.reset();
      await load();
    } catch (e: any) {
      if (mountedRef.current) setError(e?.message ?? "No se pudo guardar la canción.");
    } finally {
      inflightRef.current = false;
      if (mountedRef.current) setStatus("idle");
    }
  }

  async function handleLike(id: string) {
    if (likingRef.current[id]) return;
    likingRef.current[id] = true;

    // optimistic
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, likes: (it.likes ?? 0) + 1 } : it
      )
    );

    try {
      const res = await fetch("/api/song-requests/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || `Error ${res.status}`);

      const likes = Number(json.data?.likes ?? 0);

      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, likes } : it))
      );
    } catch {
      // revert
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, likes: Math.max(0, (it.likes ?? 1) - 1) } : it
        )
      );
    } finally {
      likingRef.current[id] = false;
    }
  }

  return (
    <div className="grid2">
      <form onSubmit={onSubmit} className="" style={{ padding: 16 }}>
        {error && (
          <div className="card" style={{ padding: 12, boxShadow: "none", borderColor: "rgba(220,38,38,.25)" }}>
            <div className="help" style={{ color: "rgba(220,38,38,.9)" }}>
              ❌ {error}
            </div>
          </div>
        )}

        <div className="field" style={{ marginTop: error ? 10 : 0 }}>
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
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  {s.song}
                  {s.artist ? <span className="help"> — {s.artist}</span> : null}
                </div>

                <button
                  type="button"
                  onClick={() => handleLike(s.id)}
                  className="btn"
                  style={{
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,.75)",
                    boxShadow: "none",
                  }}
                  aria-label="Dar like"
                  title="Dar like"
                >
                  ❤️ {s.likes ?? 0}
                </button>
              </div>

              <div className="help">
                — {s.name ? s.name : "Anónimo"}
                {s.note ? <> · “{s.note}”</> : null}
              </div>
            </div>
          ))}

          {items.length > 12 && <div className="help">…y {items.length - 12} más. Esto pinta muy bien.</div>}
        </div>
      </div>
    </div>
  );
}