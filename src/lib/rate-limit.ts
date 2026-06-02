import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitTier = "free" | "premium";

const RATE_LIMIT_MAX_FREE = Number(process.env.RATE_LIMIT_MAX ?? 5);
const RATE_LIMIT_WINDOW_MS_FREE = Number(
  process.env.RATE_LIMIT_WINDOW_MS ?? 60_000,
);

const RATE_LIMIT_MAX_PREMIUM = Number(
  process.env.RATE_LIMIT_MAX_PREMIUM ??
    Math.max(1, Math.ceil(RATE_LIMIT_MAX_FREE * 4)),
);
const RATE_LIMIT_WINDOW_MS_PREMIUM = Number(
  process.env.RATE_LIMIT_WINDOW_MS_PREMIUM ?? RATE_LIMIT_WINDOW_MS_FREE,
);

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

let upstashRatelimitFree: Ratelimit | null | undefined;
let upstashRatelimitPremium: Ratelimit | null | undefined;

function hasUpstashRedis(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getUpstashRatelimit(tier: RateLimitTier): Ratelimit | null {
  const cache =
    tier === "premium" ? upstashRatelimitPremium : upstashRatelimitFree;

  if (cache !== undefined) {
    return cache;
  }

  if (!hasUpstashRedis()) {
    if (tier === "premium") {
      upstashRatelimitPremium = null;
    } else {
      upstashRatelimitFree = null;
    }
    return null;
  }

  const max =
    tier === "premium" ? RATE_LIMIT_MAX_PREMIUM : RATE_LIMIT_MAX_FREE;
  const windowMs =
    tier === "premium"
      ? RATE_LIMIT_WINDOW_MS_PREMIUM
      : RATE_LIMIT_WINDOW_MS_FREE;
  const prefix =
    tier === "premium" ? "messagerewriter:premium" : "messagerewriter:free";

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
    prefix,
  });

  if (tier === "premium") {
    upstashRatelimitPremium = ratelimit;
  } else {
    upstashRatelimitFree = ratelimit;
  }

  return ratelimit;
}

function checkMemoryLimit(
  identifier: string,
  tier: RateLimitTier,
): RateLimitResult {
  const max =
    tier === "premium" ? RATE_LIMIT_MAX_PREMIUM : RATE_LIMIT_MAX_FREE;
  const windowMs =
    tier === "premium"
      ? RATE_LIMIT_WINDOW_MS_PREMIUM
      : RATE_LIMIT_WINDOW_MS_FREE;

  const now = Date.now();
  const reset = now + windowMs;

  const key = `${tier}:${identifier}`;

  const entry = memoryStore.get(key);
  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: reset });
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset,
    };
  }

  entry.count += 1;
  const success = entry.count <= max;

  return {
    success,
    limit: max,
    remaining: Math.max(0, max - entry.count),
    reset: entry.resetAt,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "anonymous";
}

export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "free",
): Promise<RateLimitResult> {
  const upstash = getUpstashRatelimit(tier);

  if (upstash) {
    const result = await upstash.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  return checkMemoryLimit(identifier, tier);
}

export const RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";
