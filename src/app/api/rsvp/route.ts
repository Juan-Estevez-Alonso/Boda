import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutos
const RATE_LIMIT_MAX = 5;

const ipStore = new Map<string, { count: number; ts: number }>();

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, ts: now });
    return true;
  }

  if (now - record.ts > RATE_LIMIT_WINDOW) {
    ipStore.set(ip, { count: 1, ts: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return badRequest("Demasiadas solicitudes. Inténtalo más tarde.");
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido.");
  }

  // 🛡️ Honeypot anti-bot
  if (body.website) {
    return badRequest("Spam detectado.");
  }

  // 🛡️ Tiempo mínimo de envío (2 segundos)
  const elapsed = Date.now() - Number(body.ts ?? 0);
  if (elapsed < 2000) {
    return badRequest("Formulario enviado demasiado rápido.");
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