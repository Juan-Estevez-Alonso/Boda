import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido.");
  }

  const id = String(body?.id ?? "").trim();
  if (!id) return badRequest("Falta id.");

  // 1) Leer likes actuales
  const { data: row, error: e1 } = await supabase
    .from("song_requests")
    .select("id, likes")
    .eq("id", id)
    .single();

  if (e1) return NextResponse.json({ ok: false, message: e1.message }, { status: 500 });

  const nextLikes = (row?.likes ?? 0) + 1;

  // 2) Actualizar likes
  const { data, error: e2 } = await supabase
    .from("song_requests")
    .update({ likes: nextLikes })
    .eq("id", id)
    .select("id, likes")
    .single();

  if (e2) return NextResponse.json({ ok: false, message: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true, data });
}