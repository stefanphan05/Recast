import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 5);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS ?? 60_000,
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

let upstashRatelimit: Ratelimit | null | undefined;

function hasUpstashRedis(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit !== undefined) {
    return upstashRatelimit;
  }

  if (!hasUpstashRedis()) {
    upstashRatelimit = null;
    return null;
  }

  upstashRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      RATE_LIMIT_MAX,
      `${RATE_LIMIT_WINDOW_MS} ms`,
    ),
    prefix: "messagerewriter",
  });

  return upstashRatelimit;
}

function checkMemoryLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const reset = now + RATE_LIMIT_WINDOW_MS;

  const entry = memoryStore.get(identifier);
  if (!entry || now >= entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: reset });
    return {
      success: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX - 1,
      reset,
    };
  }

  entry.count += 1;
  const success = entry.count <= RATE_LIMIT_MAX;

  return {
    success,
    limit: RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
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
): Promise<RateLimitResult> {
  const upstash = getUpstashRatelimit();

  if (upstash) {
    const result = await upstash.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  return checkMemoryLimit(identifier);
}

export const RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";
