import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function GET() {
  const { data, error } = await supabase
    .from("rsvps")
    .select("id, created_at, name, attendance, allergies")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido.");
  }

  const name = String(body?.name ?? "").trim().slice(0, 90);
  const attendance = String(body?.attendance ?? "").trim();
  const allergies = String(body?.allergies ?? "").trim().slice(0, 400);

  if (!name) return badRequest("El nombre es obligatorio.");
  if (attendance !== "si" && attendance !== "no") return badRequest("Asistencia inválida.");

  const { data, error } = await supabase
    .from("rsvps")
    .insert([{ name, attendance, allergies: allergies || null }])
    .select("id, created_at, name, attendance, allergies")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}