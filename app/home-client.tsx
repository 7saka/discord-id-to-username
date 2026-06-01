"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import type { DiscordUserInfo } from "@/lib/discord";

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
      <dd style={{ margin: 0, fontSize: "13px", color: "#94a3b8", wordBreak: "break-all" }}>
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

export default function HomeClient() {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<DiscordUserInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = inputId.trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    setCardVisible(false);
    setInfo(null);

    try {
      const res = await fetch(`/api/discord/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unknown error");
      } else {
        setInfo(data as DiscordUserInfo);
        setTimeout(() => setCardVisible(true), 30);
      }
    } catch {
      setError("Network error - please try again.");
    } finally {
      setLoading(false);
    }
  }

  const createdAt = info
    ? new Date(info.createdAt).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

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
          maxWidth: "580px",
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
            Enter any Discord snowflake ID to fetch full user info.
          </p>
        </header>

        <div style={cardStyle}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="Discord User ID  (e.g. 123456789012345678)"
              pattern="\d{17,19}"
              title="17-19 digit Discord snowflake ID"
              className="discord-input"
              style={{
                flex: 1,
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

        {info && (
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
              transform: cardVisible
                ? "translateY(0) scale(1)"
                : "translateY(16px) scale(0.98)",
              opacity: cardVisible ? 1 : 0,
              transition:
                "transform 420ms cubic-bezier(0.34,1.26,0.64,1), opacity 420ms ease",
            }}
          >
            {info.bannerUrl ? (
              <div style={{ position: "relative", height: "120px", width: "100%" }}>
                <Image
                  src={info.bannerUrl}
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
                  background: info.accentColorHex
                    ? `linear-gradient(135deg, ${info.accentColorHex}, #1e1b4b)`
                    : "linear-gradient(135deg, #312e81, #4c1d95)",
                }}
              />
            )}

            <div style={{ padding: "0 24px 24px" }}>
              <div style={{ marginTop: "-40px", marginBottom: "14px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Image
                    src={info.avatarUrl}
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
                  {info.avatarDecorationUrl && (
                    <Image
                      src={info.avatarDecorationUrl}
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
                    {info.raw.global_name ?? info.raw.username}
                  </h2>
                  {info.isBot && (
                    <StatusTag
                      label="Bot"
                      bg="rgba(99,102,241,0.18)"
                      border="rgba(99,102,241,0.38)"
                      color="#a5b4fc"
                    />
                  )}
                  {info.isSystem && (
                    <StatusTag
                      label="System"
                      bg="rgba(100,116,139,0.18)"
                      border="rgba(100,116,139,0.38)"
                      color="#cbd5e1"
                    />
                  )}
                  {info.isDeletedLikely && (
                    <StatusTag
                      label="Likely Deleted"
                      bg="rgba(239,68,68,0.14)"
                      border="rgba(239,68,68,0.28)"
                      color="#fda4af"
                    />
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                  {info.tag}
                </p>
              </div>

              <dl
                style={{
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                <Field label="User ID" value={info.raw.id} />
                <Field label="Created At" value={createdAt ?? "Unknown"} />
                <Field label="Username" value={info.raw.username} />
                <Field label="Global Name" value={info.raw.global_name ?? "None"} />
                <Field label="Discriminator" value={info.raw.discriminator || "0"} />
                <Field label="Nitro" value={info.nitroType} />
                <Field label="Accent Color" value={info.accentColorHex ?? "None"} />
                <Field
                  label="Profile Effect"
                  value={info.avatarDecorationUrl ? "Has avatar decoration" : "None"}
                />
              </dl>

              <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {info.badges.length > 0 ? (
                  info.badges.map((badge) => <Badge key={badge} label={badge} />)
                ) : (
                  <span style={{ fontSize: "13px", color: "#64748b" }}>No public badges</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}