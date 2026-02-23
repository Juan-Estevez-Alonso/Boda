function MapCard({ title, address }: { title: string; address: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="" style={{ padding: 12 }}>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap: 12, flexWrap:"wrap" }}>
        <div>
          <div className="kicker">{title}</div>
          <div style={{ fontFamily:"var(--font-lux)", fontSize: 22 }}>{address}</div>
        </div>
        <a className="btn btnPrimary" href={link} target="_blank" rel="noreferrer">Cómo llegar</a>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ overflow:"hidden", borderRadius: 14, border:"1px solid var(--line)" }}>
        <iframe
          title={title}
          src={src}
          width="100%"
          height="320"
          loading="lazy"
          style={{ border: 0, display:"block" }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function Maps() {
  return (
    <div style={{ display:"grid", gap: 14 }}>
      <MapCard
        title="Ceremonia"
        address="Parroquia Nuestra Señora del Mar, Isla Cristina, Huelva"
      />
      <MapCard
        title="Celebración"
        address="Espacio Capitana, Isla Cristina, Huelva"
      />
    </div>
  );
}
