import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
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
    .from("songs")
    .select("id, created_at, name, song, artist, note, likes")
    .order("likes", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return badRequest("Demasiadas solicitudes. Inténtalo más tarde.");
  }

  let body: any;

  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido.");
  }

  // 🛡️ Honeypot
  if (body.website) {
    return badRequest("Spam detectado.");
  }

  // 🛡️ Tiempo mínimo
  const elapsed = Date.now() - Number(body.ts ?? 0);
  if (elapsed < 2000) {
    return badRequest("Formulario enviado demasiado rápido.");
  }

  const name = String(body?.name ?? "").trim().slice(0, 60);
  const song = String(body?.song ?? "").trim().slice(0, 120);
  const artist = String(body?.artist ?? "").trim().slice(0, 120);
  const note = String(body?.note ?? "").trim().slice(0, 200);

  if (!song) return badRequest("La canción es obligatoria.");

  const { data, error } = await supabase
    .from("songs")
    .insert([
      {
        name: name || null,
        song,
        artist: artist || null,
        note: note || null
      }
    ])
    .select("id, created_at, name, song, artist, note, likes")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}