"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import type { DiscordUserInfo } from "@/lib/discord";

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium">
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm text-zinc-100 break-all">{value}</dd>
    </div>
  );
}

export default function Home() {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<DiscordUserInfo | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = inputId.trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(`/api/discord/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unknown error");
      } else {
        setInfo(data as DiscordUserInfo);
      }
    } catch {
      setError("Network error — please try again.");
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

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Discord ID Lookup
        </h1>
        <p className="mt-2 text-zinc-400 text-sm">
          Enter any Discord snowflake ID to fetch full user info via the Discord
          API.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex gap-2 mb-10"
      >
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Discord User ID (e.g. 123456789012345678)"
          className="flex-1 rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-600"
          pattern="\d{17,19}"
          title="17–19 digit Discord snowflake ID"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          {loading ? "Looking up…" : "Lookup"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="w-full max-w-lg rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Result card */}
      {info && (
        <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Banner */}
          {info.bannerUrl ? (
            <div className="relative h-32 w-full">
              <Image
                src={info.bannerUrl}
                alt="Profile banner"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : info.accentColorHex ? (
            <div
              className="h-20 w-full"
              style={{ backgroundColor: info.accentColorHex }}
            />
          ) : (
            <div className="h-20 w-full bg-gradient-to-r from-indigo-900 to-purple-900" />
          )}

          {/* Avatar + name */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="relative">
                <Image
                  src={info.avatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-zinc-900 bg-zinc-800"
                  unoptimized
                />
                {info.avatarDecorationUrl && (
                  <Image
                    src={info.avatarDecorationUrl}
                    alt="Avatar decoration"
                    width={96}
                    height={96}
                    className="absolute -inset-2 pointer-events-none"
                    unoptimized
                  />
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold leading-none">
                    {info.raw.global_name ?? info.raw.username}
                  </h2>
                  {info.isBot && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-xs font-bold uppercase tracking-wide">
                      Bot
                    </span>
                  )}
                  {info.isSystem && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-600 text-white text-xs font-bold uppercase tracking-wide">
                      System
                    </span>
                  )}
                  {info.isDeletedLikely && (
                    <span className="px-1.5 py-0.5 rounded bg-red-800 text-red-200 text-xs font-bold uppercase tracking-wide">
                      Likely Deleted
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-0.5">{info.tag}</p>
              </div>
            </div>

            {/* Badges */}
            {info.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {info.badges.map((b) => (
                  <Badge key={b} label={b} />
                ))}
              </div>
            )}

            {/* Fields */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="User ID (Snowflake)" value={info.raw.id} />
              <Field
                label="Username"
                value={info.raw.global_name ?? info.raw.username}
              />
              <Field
                label="Legacy Tag"
                value={
                  info.raw.discriminator !== "0"
                    ? info.tag
                    : "None (new system)"
                }
              />
              <Field label="Account Created" value={createdAt} />
              <Field label="Is Bot" value={info.isBot ? "Yes" : "No"} />
              <Field label="Is System" value={info.isSystem ? "Yes" : "No"} />
              <Field label="Nitro Type" value={info.nitroType} />
              <Field
                label="Accent Color"
                value={
                  info.accentColorHex ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-zinc-700"
                        style={{ backgroundColor: info.accentColorHex }}
                      />
                      {info.accentColorHex}
                    </span>
                  ) : (
                    "None"
                  )
                }
              />
              <Field label="Avatar Hash" value={info.raw.avatar ?? "Default"} />
              <Field label="Banner Hash" value={info.raw.banner ?? "None"} />
              <Field label="Public Flags" value={info.raw.public_flags ?? 0} />
            </dl>

            {/* Direct links */}
            <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap gap-3 text-xs">
              <a
                href={info.avatarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                View Avatar ↗
              </a>
              {info.bannerUrl && (
                <a
                  href={info.bannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  View Banner ↗
                </a>
              )}
              <a
                href={`https://discord.com/users/${info.raw.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Open Discord Profile ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-zinc-600 text-xs text-center">
        Powered by Discord API v10 · Hosted on Cloudflare Workers
      </footer>
    </main>
  );
}

