"use client";

import { useEffect, useState } from "react";

type SongRequestRow = {
  id: string;
  created_at: string;
  name: string | null;
  song: string;
  artist: string | null;
  note: string | null;
  likes: number;
};

interface SongUI {
  id: string;
  artist: string;
  title: string;
  suggestedBy: string;
  likes: number; // (solo UI por ahora)
}

function splitSongTitleArtist(song: string): { title: string; artist: string } {
  // soporta "Canción — Artista" o "Canción - Artista"
  const parts = song.split("—").map((s) => s.trim());
  if (parts.length >= 2) return { title: parts[0], artist: parts.slice(1).join(" — ") };

  const parts2 = song.split(" - ").map((s) => s.trim());
  if (parts2.length >= 2) return { title: parts2[0], artist: parts2.slice(1).join(" - ") };

  return { title: song.trim(), artist: "" };
}

function mapRowToUI(r: SongRequestRow): SongUI {
  const fromSong = splitSongTitleArtist(r.song);
  return {
    id: r.id,
    title: fromSong.title || r.song,
    artist: (r.artist ?? "").trim() || fromSong.artist || "—",
    suggestedBy: (r.name ?? "").trim() || "Anónimo",
    likes: r.likes ?? 0,
  };
}

export default function MusicSection() {
  const [songs, setSongs] = useState<SongUI[]>([]);
  const [newSong, setNewSong] = useState({ title: "", artist: "", name: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSongs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/song-requests", { cache: "no-store" });
      const json = await res.json();

      if (!json.ok) throw new Error(json.message || "No se pudieron cargar las canciones.");

      const rows: SongRequestRow[] = json.data ?? [];
      setSongs(rows.map(mapRowToUI));
    } catch (e: any) {
      setError(e?.message ?? "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSongs();
  }, []);

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = newSong.name.trim();
    const title = newSong.title.trim();
    const artist = newSong.artist.trim();

    if (!title || !artist || !name) {
      setError("Completa nombre, canción y artista.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/song-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // guardamos título en song + artista separado (tu API ya lo soporta)
        body: JSON.stringify({ name, song: title, artist }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.message || "No se pudo guardar la canción.");

      // Optimistic: mete arriba sin recargar
      const created: SongRequestRow = json.data;
      setSongs((prev) => [mapRowToUI(created), ...prev]);

      setNewSong({ title: "", artist: "", name: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Error inesperado");
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (id: string) => {
  // Optimista (sube al instante)
  setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s)));

  try {
    const res = await fetch("/api/song-requests/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const json = await res.json();
    if (!json.ok) throw new Error(json.message || "No se pudo dar like.");

    const { likes } = json.data; // {id, likes}

    // Sincroniza con la verdad del server
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, likes } : s)));
  } catch {
    // si falla, revertimos el optimista
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, likes: Math.max(0, s.likes - 1) } : s)));
  }
};

  return (
    <section id="musica" className="section-container bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-center">Playlist de la Boda</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          ¿Hay una canción especial que no puede faltar en nuestra celebración?
          ¡Cuéntanosla! Aquí puedes sugerir las canciones que harán de este día
          algo aún más especial.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div>
            <form
              onSubmit={handleAddSong}
              className="bg-sand-50 rounded-2xl p-6 border border-sand-200 sticky top-8"
            >
              <h3 className="text-xl font-semibold text-olive-800 mb-4">
                Sugiere una Canción
              </h3>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 text-sm">
                  ✅ ¡Canción añadida!
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-olive-800 mb-1">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    value={newSong.name}
                    onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 rounded-lg border border-sand-200 focus:outline-none focus:border-olive-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-800 mb-1">
                    Canción *
                  </label>
                  <input
                    type="text"
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    placeholder="Nombre de la canción"
                    className="w-full px-3 py-2 rounded-lg border border-sand-200 focus:outline-none focus:border-olive-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-800 mb-1">
                    Artista *
                  </label>
                  <input
                    type="text"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    placeholder="Nombre del artista"
                    className="w-full px-3 py-2 rounded-lg border border-sand-200 focus:outline-none focus:border-olive-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-4 py-2 bg-olive-600 text-white rounded-lg font-medium hover:bg-olive-700 transition-colors text-sm disabled:opacity-60"
                >
                  {sending ? "Guardando..." : "Añadir Canción"}
                </button>

                {loading && (
                  <p className="text-xs text-gray-500 text-center">
                    Cargando lista…
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Lista de canciones */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              {!loading && songs.length === 0 ? (
                <div className="bg-sand-50 rounded-2xl p-8 text-center">
                  <p className="text-gray-600">
                    Aún no hay canciones sugeridas. ¡Sé el primero en sugerir una!
                  </p>
                </div>
              ) : (
                songs.map((song) => (
                  <div
                    key={song.id}
                    className="bg-sand-50 rounded-xl p-4 border border-sand-200 hover:border-olive-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-olive-800">{song.title}</p>
                        <p className="text-sm text-gray-600">{song.artist}</p>
                      </div>

                      <button
                        onClick={() => handleLike(song.id)}
                        className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors"
                      >
                        ❤️ {song.likes}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      Sugerida por {song.suggestedBy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}