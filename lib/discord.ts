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

// Guild role permissions bit positions
export const ROLE_PERMISSIONS: Record<string, bigint> = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n,
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
  USE_SOUNDBOARD: 1n << 42n,
  CREATE_GUILD_EXPRESSIONS: 1n << 43n,
  CREATE_EVENTS: 1n << 44n,
  USE_EXTERNAL_SOUNDS: 1n << 45n,
  SEND_VOICE_MESSAGES: 1n << 46n,
  SEND_POLLS: 1n << 49n,
  USE_EXTERNAL_APPS: 1n << 50n,
};

export const ROLE_PERMISSION_LABELS: Record<string, string> = {
  CREATE_INSTANT_INVITE: "Create Invite",
  KICK_MEMBERS: "Kick Members",
  BAN_MEMBERS: "Ban Members",
  ADMINISTRATOR: "Administrator",
  MANAGE_CHANNELS: "Manage Channels",
  MANAGE_GUILD: "Manage Server",
  ADD_REACTIONS: "Add Reactions",
  VIEW_AUDIT_LOG: "View Audit Log",
  PRIORITY_SPEAKER: "Priority Speaker",
  STREAM: "Video",
  VIEW_CHANNEL: "View Channels",
  SEND_MESSAGES: "Send Messages",
  SEND_TTS_MESSAGES: "Send TTS Messages",
  MANAGE_MESSAGES: "Manage Messages",
  EMBED_LINKS: "Embed Links",
  ATTACH_FILES: "Attach Files",
  READ_MESSAGE_HISTORY: "Read Message History",
  MENTION_EVERYONE: "Mention Everyone",
  USE_EXTERNAL_EMOJIS: "Use External Emojis",
  VIEW_GUILD_INSIGHTS: "View Server Insights",
  CONNECT: "Connect",
  SPEAK: "Speak",
  MUTE_MEMBERS: "Mute Members",
  DEAFEN_MEMBERS: "Deafen Members",
  MOVE_MEMBERS: "Move Members",
  USE_VAD: "Use Voice Activity",
  CHANGE_NICKNAME: "Change Nickname",
  MANAGE_NICKNAMES: "Manage Nicknames",
  MANAGE_ROLES: "Manage Roles",
  MANAGE_WEBHOOKS: "Manage Webhooks",
  MANAGE_GUILD_EXPRESSIONS: "Manage Expressions",
  USE_APPLICATION_COMMANDS: "Use Application Commands",
  REQUEST_TO_SPEAK: "Request to Speak",
  MANAGE_EVENTS: "Manage Events",
  MANAGE_THREADS: "Manage Threads",
  CREATE_PUBLIC_THREADS: "Create Public Threads",
  CREATE_PRIVATE_THREADS: "Create Private Threads",
  USE_EXTERNAL_STICKERS: "Use External Stickers",
  SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
  USE_EMBEDDED_ACTIVITIES: "Use Activities",
  MODERATE_MEMBERS: "Moderate Members",
  VIEW_CREATOR_MONETIZATION_ANALYTICS:
    "View Creator Monetization Analytics",
  USE_SOUNDBOARD: "Use Soundboard",
  CREATE_GUILD_EXPRESSIONS: "Create Expressions",
  CREATE_EVENTS: "Create Events",
  USE_EXTERNAL_SOUNDS: "Use External Sounds",
  SEND_VOICE_MESSAGES: "Send Voice Messages",
  SEND_POLLS: "Send Polls",
  USE_EXTERNAL_APPS: "Use External Apps",
};

export function parseFlags(flags: number | null | undefined): string[] {
  if (!flags) return [];
  return Object.entries(PUBLIC_FLAGS)
    .filter(([, bit]) => (flags & bit) !== 0)
    .map(([key]) => FLAG_LABELS[key] ?? key);
}

function toHexColor(value: number | null | undefined): string | null {
  if (typeof value !== "number" || value <= 0) return null;
  return `#${value.toString(16).padStart(6, "0")}`;
}

export function parseRolePermissions(
  permissions: string | null | undefined
): string[] {
  if (!permissions) return [];

  const parsed = BigInt(permissions);
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([, bit]) => (parsed & bit) === bit)
    .map(([key]) => ROLE_PERMISSION_LABELS[key] ?? key);
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

export interface DiscordRoleColors {
  primary_color?: number | null;
  secondary_color?: number | null;
  tertiary_color?: number | null;
  primaryColor?: number | null;
  secondaryColor?: number | null;
  tertiaryColor?: number | null;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon: string | null;
  unicode_emoji: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: Record<string, string | null>;
  colors?: DiscordRoleColors | null;
}

export interface DiscordRoleInfo {
  raw: DiscordRole;
  createdAt: Date;
  permissions: string[];
  permissionsRaw: string;
  colorHex: string | null;
  primaryColorHex: string | null;
  secondaryColorHex: string | null;
  tertiaryColorHex: string | null;
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

function extractEnhancedRoleColors(role: DiscordRole): {
  primaryColorHex: string | null;
  secondaryColorHex: string | null;
  tertiaryColorHex: string | null;
} {
  const colors = role.colors;
  const primary = colors?.primary_color ?? colors?.primaryColor ?? null;
  const secondary = colors?.secondary_color ?? colors?.secondaryColor ?? null;
  const tertiary = colors?.tertiary_color ?? colors?.tertiaryColor ?? null;

  return {
    primaryColorHex: toHexColor(primary),
    secondaryColorHex: toHexColor(secondary),
    tertiaryColorHex: toHexColor(tertiary),
  };
}

export function enrichRole(role: DiscordRole): DiscordRoleInfo {
  const enhancedColors = extractEnhancedRoleColors(role);

  return {
    raw: role,
    createdAt: snowflakeToTimestamp(role.id),
    permissions: parseRolePermissions(role.permissions),
    permissionsRaw: role.permissions,
    colorHex: toHexColor(role.color),
    ...enhancedColors,
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

export async function fetchDiscordRole(
  guildId: string,
  roleId: string,
  botToken: string
): Promise<DiscordRole> {
  const res = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/roles/${roleId}`, {
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

  return res.json() as Promise<DiscordRole>;
}
