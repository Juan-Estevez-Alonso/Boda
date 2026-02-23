'use client';

import { useState } from 'react';

interface Song {
  id: string;
  artist: string;
  title: string;
  suggestedBy: string;
  likes: number;
}

export default function MusicSection() {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '1',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      suggestedBy: 'María',
      likes: 5,
    },
    {
      id: '2',
      title: 'All of Me',
      artist: 'John Legend',
      suggestedBy: 'Juan',
      likes: 8,
    },
    {
      id: '3',
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      suggestedBy: 'Sarah',
      likes: 6,
    },
  ]);

  const [newSong, setNewSong] = useState({ title: '', artist: '', name: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSong.title && newSong.artist && newSong.name) {
      const song: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
        suggestedBy: newSong.name,
        likes: 0,
      };
      setSongs([song, ...songs]);
      setNewSong({ title: '', artist: '', name: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleLike = (id: string) => {
    setSongs(
      songs.map((song) =>
        song.id === id ? { ...song, likes: song.likes + 1 } : song
      )
    );
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-olive-800 mb-1">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    value={newSong.name}
                    onChange={(e) =>
                      setNewSong({ ...newSong, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewSong({ ...newSong, title: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewSong({ ...newSong, artist: e.target.value })
                    }
                    placeholder="Nombre del artista"
                    className="w-full px-3 py-2 rounded-lg border border-sand-200 focus:outline-none focus:border-olive-600 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-olive-600 text-white rounded-lg font-medium hover:bg-olive-700 transition-colors text-sm"
                >
                  Añadir Canción
                </button>
              </div>
            </form>
          </div>

          {/* Lista de canciones */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              {songs.length === 0 ? (
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
                        <p className="font-semibold text-olive-800">
                          {song.title}
                        </p>
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
