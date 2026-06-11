import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Tracks when a user clicks the Turnkey (통합 컨설팅) card on Welcome.
 * Useful for measuring how many tour-eligible visitors actually want full
 * consulting instead of Master retainer.
 *
 * Insert-only, never returns an error to the client.
 *
 * Optional table:
 *   create table if not exists turnkey_clicks (
 *     id         uuid primary key default gen_random_uuid(),
 *     source     text,
 *     created_at timestamptz default now()
 *   );
 */
export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ ok: true, mocked: true });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const supabase = createServerClient();
    await supabase.from("turnkey_clicks").insert({ source: body?.source ?? null });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn("[/api/turnkey-click] insert failed (non-blocking):", e);
    return NextResponse.json({ ok: false });
  }
}
