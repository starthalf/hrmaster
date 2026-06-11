import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, getMockResponse } from "@/lib/claude";

/**
 * Demo chat endpoint for Step 2 (자문 체험).
 *
 * Tries Anthropic API if ANTHROPIC_API_KEY is set; otherwise serves a curated
 * mock response. Keeps the tour functional even before secrets are wired.
 *
 * Expected request:  { messages: [{role, content}, ...] }
 * Response:          { reply: string, routedTo?: string }
 */
const ROUTING_REGEX = /\[ROUTE:\s*(핫라인|방문|템플릿|설계|노무사)\]/;

export async function POST(req: NextRequest) {
  try {
    const { messages = [] } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };
    const last = messages[messages.length - 1]?.content || "";

    // ── Mock fallback when no API key configured (default for Bolt preview) ──
    if (!process.env.ANTHROPIC_API_KEY) {
      const mock = getMockResponse(last);
      return NextResponse.json({ reply: mock.reply, routedTo: mock.routedTo });
    }

    // ── Real Anthropic call ──
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = buildSystemPrompt(
      /* painPoints */ [],
      /* companySize */ "50-150",
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const routeMatch = raw.match(ROUTING_REGEX);
    const reply = raw.replace(ROUTING_REGEX, "").trim();

    return NextResponse.json({
      reply,
      routedTo: routeMatch ? routeMatch[1] : null,
    });
  } catch (e) {
    console.error("[/api/chat] failed, falling back to mock:", e);
    const mock = getMockResponse("");
    return NextResponse.json({ reply: mock.reply, routedTo: mock.routedTo });
  }
}
