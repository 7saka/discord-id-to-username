export const DISCORD_API_BASE = "https://discord.com/api/v10";
export const CDN_BASE = "https://cdn.discordapp.com";

// Discord epoch (Jan 1, 2015)
const DISCORD_EPOCH = 1420070400000n;

export function snowflakeToTimestamp(id: string): Date {
  const ms = (BigInt(id) >> 22n) + DISCORD_EPOCH;
  return new Date(Number(ms));
}

export function getAvatarUrl(
  userId: string,
  avatarHash: string | null,
  size = 512
): string {
  if (!avatarHash) {
    const defaultIndex = Number(BigInt(userId) >> 22n) % 6;
    return `${CDN_BASE}/embed/avatars/${defaultIndex}.png`;
  }
  const ext = avatarHash.startsWith("a_") ? "gif" : "png";
  return `${CDN_BASE}/avatars/${userId}/${avatarHash}.${ext}?size=${size}`;
}

export function getBannerUrl(
  userId: string,
  bannerHash: string | null,
  size = 1024
): string | null {
  if (!bannerHash) return null;
  const ext = bannerHash.startsWith("a_") ? "gif" : "png";
  return `${CDN_BASE}/banners/${userId}/${bannerHash}.${ext}?size=${size}`;
}

export function getAvatarDecorationUrl(
  assetHash: string | null
): string | null {
  if (!assetHash) return null;
  return `${CDN_BASE}/avatar-decoration-presets/${assetHash}.png?size=256`;
}

// Public flags bit positions
export const PUBLIC_FLAGS: Record<string, number> = {
  STAFF: 1 << 0,
  PARTNER: 1 << 1,
  HYPESQUAD: 1 << 2,
  BUG_HUNTER_LEVEL_1: 1 << 3,
  HYPESQUAD_BRAVERY: 1 << 6,
  HYPESQUAD_BRILLIANCE: 1 << 7,
  HYPESQUAD_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  BUG_HUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
  DISCORD_CERTIFIED_MODERATOR: 1 << 18,
  BOT_HTTP_INTERACTIONS: 1 << 19,
  ACTIVE_DEVELOPER: 1 << 22,
};

export const FLAG_LABELS: Record<string, string> = {
  STAFF: "Discord Staff",
  PARTNER: "Partnered Server Owner",
  HYPESQUAD: "HypeSquad Events",
  BUG_HUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  HYPESQUAD_BRAVERY: "HypeSquad Bravery",
  HYPESQUAD_BRILLIANCE: "HypeSquad Brilliance",
  HYPESQUAD_BALANCE: "HypeSquad Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  BUG_HUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  VERIFIED_BOT: "Verified Bot",
  EARLY_VERIFIED_BOT_DEVELOPER: "Early Verified Bot Developer",
  DISCORD_CERTIFIED_MODERATOR: "Discord Certified Moderator",
  BOT_HTTP_INTERACTIONS: "HTTP Interactions Bot",
  ACTIVE_DEVELOPER: "Active Developer",
};

export const PREMIUM_TYPES: Record<number, string> = {
  0: "None",
  1: "Nitro Classic",
  2: "Nitro",
  3: "Nitro Basic",
};

export function parseFlags(flags: number | null | undefined): string[] {
  if (!flags) return [];
  return Object.entries(PUBLIC_FLAGS)
    .filter(([, bit]) => (flags & bit) !== 0)
    .map(([key]) => FLAG_LABELS[key] ?? key);
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  bot?: boolean;
  system?: boolean;
  public_flags: number | null;
  flags: number | null;
  premium_type: number | null;
  avatar_decoration_data: { asset: string; sku_id: string } | null;
}

export interface DiscordUserInfo {
  raw: DiscordUser;
  avatarUrl: string;
  bannerUrl: string | null;
  avatarDecorationUrl: string | null;
  createdAt: Date;
  badges: string[];
  nitroType: string;
  tag: string;
  isBot: boolean;
  isSystem: boolean;
  isDeletedLikely: boolean;
  accentColorHex: string | null;
}

export function enrichUser(user: DiscordUser): DiscordUserInfo {
  const createdAt = snowflakeToTimestamp(user.id);
  const avatarUrl = getAvatarUrl(user.id, user.avatar);
  const bannerUrl = getBannerUrl(user.id, user.banner);
  const avatarDecorationUrl = getAvatarDecorationUrl(
    user.avatar_decoration_data?.asset ?? null
  );
  const badges = parseFlags(user.public_flags ?? user.flags);
  const nitroType = PREMIUM_TYPES[user.premium_type ?? 0] ?? "Unknown";
  const tag =
    user.discriminator && user.discriminator !== "0"
      ? `${user.username}#${user.discriminator}`
      : user.username;

  // Heuristic: deleted accounts typically have "Deleted User" prefix with numeric suffix
  const isDeletedLikely = /^deleted[_\s]?user/i.test(
    user.global_name ?? user.username
  );

  const accentColorHex = user.accent_color
    ? `#${user.accent_color.toString(16).padStart(6, "0")}`
    : null;

  return {
    raw: user,
    avatarUrl,
    bannerUrl,
    avatarDecorationUrl,
    createdAt,
    badges,
    nitroType,
    tag,
    isBot: user.bot ?? false,
    isSystem: user.system ?? false,
    isDeletedLikely,
    accentColorHex,
  };
}

export async function fetchDiscordUser(
  id: string,
  botToken: string
): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API_BASE}/users/${id}`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<DiscordUser>;
}
