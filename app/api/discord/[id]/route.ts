import { NextRequest, NextResponse } from "next/server";
import { fetchDiscordUser, enrichUser } from "@/lib/discord";

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
    // Don't reveal the reason — log internally only
    console.error("[discord-lookup] DISCORD_BOT_TOKEN is not set");
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }

  try {
    const user = await fetchDiscordUser(id, botToken);
    const info = enrichUser(user);
    return NextResponse.json(info);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    // Log full error server-side, return safe message to client
    console.error(`[discord-lookup] id=${id} error=${message}`);
    if (message.toLowerCase().includes("unknown user")) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch user from Discord." },
      { status: 502 }
    );
  }
}
