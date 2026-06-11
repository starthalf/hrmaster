import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Captures lead-related events into a single `leads` table.
 *
 * Two kinds of POST bodies are accepted:
 *
 * 1. `kind: "diagnose_partial"` — sent at the end of Step 1.
 *    Stores companySize / hrCapacity / pains under `metadata`,
 *    creates a row with `status = "diagnosing"`.
 *
 * 2. `kind: "tour_completed"` — sent on Step 6 submit.
 *    Updates (or creates) the row with full contact info and
 *    `status = "contact_requested"`.
 *
 * Schema expectation (run this SQL in Supabase if missing):
 *
 *   create table if not exists leads (
 *     id           uuid primary key default gen_random_uuid(),
 *     name         text,
 *     email        text,
 *     phone        text,
 *     company      text,
 *     tier         text,
 *     status       text not null default 'diagnosing',
 *     metadata     jsonb default '{}'::jsonb,
 *     created_at   timestamptz default now(),
 *     updated_at   timestamptz default now()
 *   );
 *
 * Designed to NEVER fail loudly — analytics must not block UX,
 * so any error becomes a 200 with `{ok:false}` and a logged warning.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" });
  }

  // If Supabase env isn't configured (e.g. local dev), just echo back.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("[/api/lead] Supabase env missing — echoing only", body);
    return NextResponse.json({ ok: true, mocked: true });
  }

  try {
    const supabase = createServerClient();
    const kind = body.kind as string | undefined;

    if (kind === "diagnose_partial") {
      const { error } = await supabase.from("leads").insert({
        status: "diagnosing",
        metadata: {
          companySize: body.companySize ?? null,
          hrCapacity:  body.hrCapacity  ?? null,
          pains:       body.pains       ?? [],
        },
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (kind === "tour_completed") {
      const { error } = await supabase.from("leads").insert({
        name:    body.name    ?? null,
        email:   body.email   ?? null,
        phone:   body.phone   ?? null,
        company: body.company ?? null,
        tier:    body.tier    ?? null,
        status:  "contact_requested",
        metadata: { diagnose: body.diagnose ?? null },
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    // Unknown kind — still 200 to avoid breaking the tour
    return NextResponse.json({ ok: false, error: "unknown_kind" });
  } catch (e) {
    console.error("[/api/lead] insert failed:", e);
    // Still 200 so the UI continues — failure logged server-side.
    return NextResponse.json({ ok: false, error: "insert_failed" });
  }
}
