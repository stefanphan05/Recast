import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rate-limit";
import {
  ALLOWED_STYLES,
  rewriteWithFallback,
  type RewriteStyle,
} from "@/lib/rewrite";

type RewriteRequest = {
  text?: string;
  style?: RewriteStyle;
  genzIntensity?: number;
};

const MAX_TEXT_LENGTH = 2000;
const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(request));
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: RATE_LIMIT_MESSAGE },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimit),
        },
      );
    }

    const body = (await request.json()) as RewriteRequest;
    const text = String(body.text ?? "").trim();
    const style = body.style;
    const genzIntensity = clamp(Number(body.genzIntensity ?? 5), 0, 10);

    if (text.length === 0) {
      return NextResponse.json(
        { message: "Text is required." },
        { status: 400 },
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { message: `Text must be ${MAX_TEXT_LENGTH} characters or less.` },
        { status: 400 },
      );
    }

    if (!style || !ALLOWED_STYLES.includes(style)) {
      return NextResponse.json(
        {
          message:
            "Style must be one of: grammar, shorter, formal, casual, genz.",
        },
        { status: 400 },
      );
    }

    const data = await rewriteWithFallback({
      text,
      style,
      genzIntensity,
    });

    return NextResponse.json(data, {
      status: 200,
      headers: rateLimitHeaders(rateLimit),
    });
  } catch (error) {
    console.error("Rewrite API error:", error);
    return NextResponse.json(
      { message: SERVER_ERROR_MESSAGE },
      { status: 500 },
    );
  }
}
