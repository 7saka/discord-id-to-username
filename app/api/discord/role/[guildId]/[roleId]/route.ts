import { NextRequest, NextResponse } from "next/server";
import { enrichRole, fetchDiscordRole } from "@/lib/discord";

// Basic snowflake validation: 17-19 digit numeric string
const SNOWFLAKE_RE = /^\d{17,19}$/;

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ guildId: string; roleId: string }>;
  }
) {
  const { guildId, roleId } = await params;

  if (!SNOWFLAKE_RE.test(guildId) || !SNOWFLAKE_RE.test(roleId)) {
    return NextResponse.json(
      { error: "Invalid guild or role ID. Must be a 17-19 digit snowflake." },
      { status: 400 }
    );
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    console.error("[discord-role-lookup] DISCORD_BOT_TOKEN is not set");
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }

  try {
    const role = await fetchDiscordRole(guildId, roleId, botToken);
    const info = enrichRole(role);
    return NextResponse.json(info);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(
      `[discord-role-lookup] guildId=${guildId} roleId=${roleId} error=${message}`
    );

    const normalized = message.toLowerCase();
    if (
      normalized.includes("unknown role") ||
      normalized.includes("unknown guild")
    ) {
      return NextResponse.json(
        { error: "Role or guild not found." },
        { status: 404 }
      );
    }

    if (normalized.includes("missing permissions")) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch role from Discord." },
      { status: 502 }
    );
  }
}
