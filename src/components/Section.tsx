export default function Section({
  id, kicker, title, children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="kicker">{kicker}</div>
        <h2 className="h2" style={{ fontFamily: "var(--font-lux)" }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}