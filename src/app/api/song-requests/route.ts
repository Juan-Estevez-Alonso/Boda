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
    .from("song_requests")
    .select("id, created_at, name, song, artist, note")
    .order("created_at", { ascending: false })
    .limit(50);

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

  const name = String(body?.name ?? "").trim().slice(0, 60);
  const song = String(body?.song ?? "").trim().slice(0, 120);
  const artist = String(body?.artist ?? "").trim().slice(0, 120);
  const note = String(body?.note ?? "").trim().slice(0, 200);

  if (!song) return badRequest("La canción es obligatoria.");

  const { data, error } = await supabase
    .from("song_requests")
    .insert([{ name: name || null, song, artist: artist || null, note: note || null }])
    .select("id, created_at, name, song, artist, note")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}