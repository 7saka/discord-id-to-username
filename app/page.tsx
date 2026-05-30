"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { DiscordRoleInfo, DiscordUserInfo } from "@/lib/discord";

type LookupMode = "user" | "role";

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: "6px",
        background: "rgba(124,58,237,0.16)",
        border: "1px solid rgba(124,58,237,0.32)",
        color: "#c4b5fd",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <dt
        style={{
          margin: 0,
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#475569",
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#94a3b8",
          wordBreak: "break-all",
        }}
      >
        {value}
      </dd>
    </div>
  );
}

function StatusTag({
  label,
  bg,
  border,
  color,
}: {
  label: string;
  bg: string;
  border: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: "6px",
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function ColorValue({ value }: { value: string | null }) {
  if (!value) return <>None</>;

  return (
    <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <span
        style={{
          display: "inline-block",
          width: "13px",
          height: "13px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          background: value,
          flexShrink: 0,
        }}
      />
      {value}
    </span>
  );
}

function formatDate(input: string | Date) {
  return new Date(input).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function Home() {
  const [lookupMode, setLookupMode] = useState<LookupMode>("user");
  const [inputId, setInputId] = useState("");
  const [guildId, setGuildId] = useState("");
  const [roleId, setRoleId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<DiscordUserInfo | null>(null);
  const [roleInfo, setRoleInfo] = useState<DiscordRoleInfo | null>(null);

  const [mounted, setMounted] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const roleGradient = useMemo(() => {
    if (!roleInfo) {
      return "linear-gradient(135deg, #312e81, #4c1d95)";
    }

    const colors = [
      roleInfo.primaryColorHex,
      roleInfo.secondaryColorHex,
      roleInfo.tertiaryColorHex,
      roleInfo.colorHex,
    ].filter(Boolean) as string[];

    if (colors.length === 0) {
      return "linear-gradient(135deg, #312e81, #4c1d95)";
    }

    if (colors.length === 1) {
      return `linear-gradient(135deg, ${colors[0]}, #0f172a)`;
    }

    return `linear-gradient(135deg, ${colors.slice(0, 3).join(", ")})`;
  }, [roleInfo]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const userId = inputId.trim();
    const normalizedGuildId = guildId.trim();
    const normalizedRoleId = roleId.trim();

    if (lookupMode === "user" && !userId) return;
    if (lookupMode === "role" && (!normalizedGuildId || !normalizedRoleId)) return;

    setLoading(true);
    setError(null);
    setCardVisible(false);
    setUserInfo(null);
    setRoleInfo(null);

    try {
      const endpoint =
        lookupMode === "user"
          ? `/api/discord/${encodeURIComponent(userId)}`
          : `/api/discord/role/${encodeURIComponent(normalizedGuildId)}/${encodeURIComponent(
              normalizedRoleId
            )}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Unknown error");
        return;
      }

      if (lookupMode === "user") {
        setUserInfo(data as DiscordUserInfo);
      } else {
        setRoleInfo(data as DiscordRoleInfo);
      }

      setTimeout(() => setCardVisible(true), 30);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    width: "100%",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(124,58,237,0.22)",
    background: "rgba(15,23,42,0.70)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 0 48px rgba(124,58,237,0.13)",
  };

  return (
    <div
      style={{
        background: "#030712",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 20% 20%, #111827 0, transparent 32%)," +
            "radial-gradient(circle at 80% 10%, #0b1120 0, transparent 38%)," +
            "radial-gradient(circle at 50% 80%, #0b1727 0, transparent 34%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(34,211,238,0.05))",
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "680px",
          margin: "0 auto",
          minHeight: "100vh",
          padding: "72px 20px 96px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          opacity: mounted ? 1 : 0,
          transition: "transform 600ms ease, opacity 600ms ease",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "4px" }}>
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.15,
            }}
          >
            Discord ID Lookup
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
            Switch modes and fetch either user or role data without leaving the page.
          </p>
        </header>

        <div style={cardStyle}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                htmlFor="lookupMode"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#94a3b8",
                }}
              >
                Lookup Mode
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="lookupMode"
                  value={lookupMode}
                  onChange={(e) => {
                    const nextMode = e.target.value as LookupMode;
                    setLookupMode(nextMode);
                    setError(null);
                    setCardVisible(false);
                    setUserInfo(null);
                    setRoleInfo(null);
                  }}
                  style={{
                    width: "100%",
                    minHeight: "46px",
                    borderRadius: "12px",
                    border: "1px solid rgba(124,58,237,0.30)",
                    background: "rgba(2,6,23,0.82)",
                    color: "#e2e8f0",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "0 40px 0 14px",
                    appearance: "none",
                  }}
                >
                  <option value="user">User Lookup (by User ID)</option>
                  <option value="role">Role Lookup (by Guild ID + Role ID)</option>
                </select>
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "12px",
                    pointerEvents: "none",
                  }}
                >
                  ▼
                </span>
              </div>
            </div>

            <div
              key={lookupMode}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                animation: "card-appear 220ms ease",
              }}
            >
              {lookupMode === "user" ? (
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Discord User ID (e.g. 123456789012345678)"
                  pattern="\d{17,19}"
                  title="17-19 digit Discord snowflake ID"
                  className="discord-input"
                  style={{
                    flex: 1,
                    minWidth: "240px",
                    minHeight: "46px",
                    padding: "0 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(2,6,23,0.66)",
                    color: "#f8fafc",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                />
              ) : (
                <>
                  <input
                    type="text"
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                    placeholder="Guild ID"
                    pattern="\d{17,19}"
                    title="17-19 digit Discord snowflake ID"
                    className="discord-input"
                    style={{
                      flex: 1,
                      minWidth: "170px",
                      minHeight: "46px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(2,6,23,0.66)",
                      color: "#f8fafc",
                      fontFamily: "inherit",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    placeholder="Role ID"
                    pattern="\d{17,19}"
                    title="17-19 digit Discord snowflake ID"
                    className="discord-input"
                    style={{
                      flex: 1,
                      minWidth: "170px",
                      minHeight: "46px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(2,6,23,0.66)",
                      color: "#f8fafc",
                      fontFamily: "inherit",
                      fontSize: "14px",
                    }}
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="discord-btn"
                style={{
                  padding: "0 22px",
                  minHeight: "46px",
                  borderRadius: "12px",
                  border: "1px solid rgba(124,58,237,0.40)",
                  background: "rgba(124,58,237,0.18)",
                  color: "#c4b5fd",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.65 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Looking up..." : "Lookup"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.28)",
              color: "#fda4af",
              fontSize: "13px",
              fontWeight: 500,
              animation: "card-appear 300ms ease",
            }}
          >
            {error}
          </div>
        )}

        {userInfo && (
          <div
            style={{
              width: "100%",
              borderRadius: "20px",
              border: "1px solid rgba(124,58,237,0.22)",
              background: "rgba(15,23,42,0.70)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              overflow: "hidden",
              boxShadow: "0 0 56px rgba(124,58,237,0.16)",
              transform: cardVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
              opacity: cardVisible ? 1 : 0,
              transition: "transform 420ms cubic-bezier(0.34,1.26,0.64,1), opacity 420ms ease",
            }}
          >
            {userInfo.bannerUrl ? (
              <div style={{ position: "relative", height: "120px", width: "100%" }}>
                <Image
                  src={userInfo.bannerUrl}
                  alt="Profile banner"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            ) : (
              <div
                style={{
                  height: "80px",
                  width: "100%",
                  background: userInfo.accentColorHex
                    ? `linear-gradient(135deg, ${userInfo.accentColorHex}, #1e1b4b)`
                    : "linear-gradient(135deg, #312e81, #4c1d95)",
                }}
              />
            )}

            <div style={{ padding: "0 24px 24px" }}>
              <div style={{ marginTop: "-40px", marginBottom: "14px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Image
                    src={userInfo.avatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "50%",
                      border: "4px solid #0a0f1e",
                      background: "#1e293b",
                      display: "block",
                    }}
                    unoptimized
                  />
                  {userInfo.avatarDecorationUrl && (
                    <Image
                      src={userInfo.avatarDecorationUrl}
                      alt="Avatar decoration"
                      width={96}
                      height={96}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        left: "-8px",
                        pointerEvents: "none",
                      }}
                      unoptimized
                    />
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "5px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#f8fafc",
                      lineHeight: 1.2,
                    }}
                  >
                    {userInfo.raw.global_name ?? userInfo.raw.username}
                  </h2>
                  {userInfo.isBot && (
                    <StatusTag
                      label="Bot"
                      bg="rgba(99,102,241,0.18)"
                      border="rgba(99,102,241,0.38)"
                      color="#a5b4fc"
                    />
                  )}
                  {userInfo.isSystem && (
                    <StatusTag
                      label="System"
                      bg="rgba(100,116,139,0.18)"
                      border="rgba(100,116,139,0.38)"
                      color="#cbd5e1"
                    />
                  )}
                  {userInfo.isDeletedLikely && (
                    <StatusTag
                      label="Likely Deleted"
                      bg="rgba(239,68,68,0.14)"
                      border="rgba(239,68,68,0.28)"
                      color="#fda4af"
                    />
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                  {userInfo.tag}
                </p>
              </div>

              {userInfo.badges.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
                  {userInfo.badges.map((badge) => (
                    <Badge key={badge} label={badge} />
                  ))}
                </div>
              )}

              <dl
                style={{
                  margin: "0 0 18px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
                  gap: "14px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Field label="User ID" value={userInfo.raw.id} />
                <Field label="Username" value={userInfo.raw.global_name ?? userInfo.raw.username} />
                <Field
                  label="Legacy Tag"
                  value={userInfo.raw.discriminator !== "0" ? userInfo.tag : "None (new system)"}
                />
                <Field label="Account Created" value={formatDate(userInfo.createdAt)} />
                <Field label="Is Bot" value={userInfo.isBot ? "Yes" : "No"} />
                <Field label="Is System" value={userInfo.isSystem ? "Yes" : "No"} />
                <Field label="Nitro Type" value={userInfo.nitroType} />
                <Field label="Accent Color" value={<ColorValue value={userInfo.accentColorHex} />} />
                <Field label="Public Flags" value={userInfo.raw.public_flags ?? 0} />
              </dl>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <a
                  href={userInfo.avatarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discord-link"
                >
                  View Avatar ↗
                </a>
                {userInfo.bannerUrl && (
                  <a
                    href={userInfo.bannerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="discord-link"
                  >
                    View Banner ↗
                  </a>
                )}
                <a
                  href={`https://discord.com/users/${userInfo.raw.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discord-link"
                >
                  Open Discord Profile ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {roleInfo && (
          <div
            style={{
              width: "100%",
              borderRadius: "20px",
              border: "1px solid rgba(124,58,237,0.22)",
              background: "rgba(15,23,42,0.70)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              overflow: "hidden",
              boxShadow: "0 0 56px rgba(124,58,237,0.16)",
              transform: cardVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
              opacity: cardVisible ? 1 : 0,
              transition: "transform 420ms cubic-bezier(0.34,1.26,0.64,1), opacity 420ms ease",
            }}
          >
            <div style={{ height: "88px", width: "100%", background: roleGradient }} />

            <div style={{ padding: "18px 24px 24px" }}>
              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "5px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#f8fafc",
                      lineHeight: 1.2,
                    }}
                  >
                    @{roleInfo.raw.name}
                  </h2>
                  {roleInfo.raw.managed && (
                    <StatusTag
                      label="Managed"
                      bg="rgba(56,189,248,0.16)"
                      border="rgba(56,189,248,0.30)"
                      color="#7dd3fc"
                    />
                  )}
                  {roleInfo.raw.mentionable && (
                    <StatusTag
                      label="Mentionable"
                      bg="rgba(52,211,153,0.16)"
                      border="rgba(52,211,153,0.30)"
                      color="#6ee7b7"
                    />
                  )}
                  {roleInfo.raw.hoist && (
                    <StatusTag
                      label="Hoisted"
                      bg="rgba(250,204,21,0.14)"
                      border="rgba(250,204,21,0.28)"
                      color="#fde68a"
                    />
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                  Role metadata and effective permission bits.
                </p>
              </div>

              <dl
                style={{
                  margin: "0 0 18px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
                  gap: "14px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Field label="Role ID" value={roleInfo.raw.id} />
                <Field label="Role Name" value={roleInfo.raw.name} />
                <Field label="Role Created" value={formatDate(roleInfo.createdAt)} />
                <Field label="Position" value={roleInfo.raw.position} />
                <Field label="Legacy Color" value={<ColorValue value={roleInfo.colorHex} />} />
                <Field label="Primary Color" value={<ColorValue value={roleInfo.primaryColorHex} />} />
                <Field
                  label="Secondary Color"
                  value={<ColorValue value={roleInfo.secondaryColorHex} />}
                />
                <Field label="Tertiary Color" value={<ColorValue value={roleInfo.tertiaryColorHex} />} />
                <Field label="Permissions" value={roleInfo.permissions.length} />
                <Field label="Raw Permissions" value={roleInfo.permissionsRaw} />
              </dl>

              <section
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Permission Set
                </h3>
                {roleInfo.permissions.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {roleInfo.permissions.map((permission) => (
                      <Badge key={permission} label={permission} />
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>No permissions.</p>
                )}
              </section>
            </div>
          </div>
        )}

        <footer
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            color: "#334155",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          Powered by Discord API v10 · Hosted on Cloudflare Workers
        </footer>
      </main>
    </div>
  );
}
