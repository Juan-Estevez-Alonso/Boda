import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("id, created_at, name, song, artist, note, likes")
    .order("likes", { ascending: false })
    .order("created_at", { ascending: false });

  const { data: rsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("id, created_at, name, attendance, allergies")
    .order("created_at", { ascending: false });

  const attendingCount = rsvps?.filter((r) => r.attendance === "si").length ?? 0;
  const notAttendingCount = rsvps?.filter((r) => r.attendance === "no").length ?? 0;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Panel de boda</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>RSVP sí</div>
          <div style={valueStyle}>{attendingCount}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>RSVP no</div>
          <div style={valueStyle}>{notAttendingCount}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Canciones propuestas</div>
          <div style={valueStyle}>{songs?.length ?? 0}</div>
        </div>
      </div>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>RSVPs</h2>

        {rsvpsError ? (
          <p style={{ color: "crimson" }}>{rsvpsError.message}</p>
        ) : !rsvps || rsvps.length === 0 ? (
          <p>No hay respuestas todavía.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {rsvps.map((r) => (
              <div key={r.id} style={cardStyle}>
                <div style={{ fontWeight: 700 }}>{r.name}</div>
                <div style={{ marginTop: 6 }}>
                  Asistencia:{" "}
                  <b>{r.attendance === "si" ? "Sí" : "No"}</b>
                </div>
                {r.allergies ? (
                  <div style={{ marginTop: 6, color: "#555" }}>
                    Alergias / dieta: {r.allergies}
                  </div>
                ) : null}
                <div style={{ marginTop: 6, fontSize: 12, color: "#777" }}>
                  {new Date(r.created_at).toLocaleString("es-ES")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Canciones</h2>

        {songsError ? (
          <p style={{ color: "crimson" }}>{songsError.message}</p>
        ) : !songs || songs.length === 0 ? (
          <p>No hay canciones todavía.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {songs.map((s) => (
              <div key={s.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {s.song}
                      {s.artist ? ` — ${s.artist}` : ""}
                    </div>
                    <div style={{ marginTop: 6, color: "#555" }}>
                      Propuesta por: {s.name || "Anónimo"}
                    </div>
                    {s.note ? (
                      <div style={{ marginTop: 6, color: "#555" }}>
                        Nota: {s.note}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 6, fontSize: 12, color: "#777" }}>
                      {new Date(s.created_at).toLocaleString("es-ES")}
                    </div>
                  </div>

                  <div style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                    ❤️ {s.likes ?? 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  boxShadow: "0 4px 18px rgba(0,0,0,.04)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
};

const valueStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  marginTop: 6,
};