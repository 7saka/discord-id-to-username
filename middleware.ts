import { NextRequest, NextResponse } from "next/server";

/**
 * IP-based rate limiting for the Discord lookup API.
 *
 * Uses a module-scoped Map (lives for the lifetime of the Cloudflare Worker
 * isolate). Not perfectly shared across isolates, but provides meaningful
 * protection against abuse from a single origin within an isolate's window.
 *
 * Limits: MAX_REQUESTS per WINDOW_MS per client IP.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // requests per window per IP

interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();
let lastPrune = Date.now();

/** Remove expired entries to prevent unbounded memory growth. */
function maybePrune(now: number): void {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [ip, entry] of store) {
    if (entry.resetAt <= now) store.delete(ip);
  }
}

export function middleware(request: NextRequest) {
  const now = Date.now();
  maybePrune(now);

  // Extract real client IP — Cloudflare sets CF-Connecting-IP
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    // New window
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  const remaining = MAX_REQUESTS - entry.count;
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(entry.resetAt / 1000))
  );
  return response;
}

export const config = {
  // Only apply rate limiting to the API routes
  matcher: ["/api/:path*"],
};
