import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no configurada");
  }

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada");
  }

  return createClient(url, key);
}

export function apiError(error: unknown, fallback = "Error interno") {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : fallback;

  return Response.json(
    {
      ok: false,
      message,
    },
    {
      status: 500,
    }
  );
}