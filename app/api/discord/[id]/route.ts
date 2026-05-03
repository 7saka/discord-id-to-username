import { NextRequest, NextResponse } from "next/server";
import { fetchDiscordUser, enrichUser } from "@/lib/discord";

export const runtime = "edge";

// Basic snowflake validation: 17–19 digit numeric string
const SNOWFLAKE_RE = /^\d{17,19}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!SNOWFLAKE_RE.test(id)) {
    return NextResponse.json(
      { error: "Invalid Discord ID. Must be a 17–19 digit snowflake." },
      { status: 400 }
    );
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing bot token." },
      { status: 500 }
    );
  }

  try {
    const user = await fetchDiscordUser(id, botToken);
    const info = enrichUser(user);
    return NextResponse.json(info);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.toLowerCase().includes("unknown user") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
