import { getSupabaseServer, apiError } from "../../../../lib/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("rsvps")
      .select("name, attendance, allergies, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

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
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    return new Response("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="invitados-boda.csv"',
      },
    });
  } catch (error) {
    return apiError(error, "Error exportando RSVPs");
  }
}