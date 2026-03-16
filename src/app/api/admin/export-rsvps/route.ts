import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("rsvps")
    .select("name, attendance, allergies, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Error exporting RSVPs", { status: 500 });
  }

  const rows = data ?? [];

  const csv = [
    ["Nombre", "Asistencia", "Alergias / dieta", "Fecha"],
    ...rows.map((r) => [
      r.name ?? "",
      r.attendance === "si" ? "Sí" : "No",
      r.allergies ?? "",
      new Date(r.created_at).toLocaleString("es-ES"),
    ]),
  ]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="invitados-boda.csv"',
    },
  });
}