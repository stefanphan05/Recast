import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rate-limit";
import {
  ALLOWED_STYLES,
  isCrossLanguageRewrite,
  isValidRewriteTarget,
  isValidSourceLanguage,
  rewriteWithFallback,
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  type LanguageCode,
  type RewriteInput,
  type RewriteStyle,
} from "@/lib/rewrite";

type RewriteRequest = {
  text?: string;
  style?: RewriteStyle;
  genzIntensity?: number;
  flirtIntensity?: number;
  sourceLanguage?: string;
  targetLanguage?: string;
  instructions?: string;
};

const MAX_TEXT_LENGTH = 2000;
const MAX_INSTRUCTIONS_LENGTH = 500;
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
    const flirtIntensity = clamp(Number(body.flirtIntensity ?? 5), 0, 10);
    const sourceLanguage = String(
      body.sourceLanguage ?? SOURCE_LANGUAGE_AUTO,
    ).trim();
    const targetLanguage = String(
      body.targetLanguage ?? TARGET_LANGUAGE_SAME,
    ).trim();
    const instructions = String(body.instructions ?? "").trim();

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

    if (instructions.length > MAX_INSTRUCTIONS_LENGTH) {
      return NextResponse.json(
        {
          message: `Instructions must be ${MAX_INSTRUCTIONS_LENGTH} characters or less.`,
        },
        { status: 400 },
      );
    }

    if (!style || !ALLOWED_STYLES.includes(style)) {
      return NextResponse.json(
        {
          message: `Style must be one of: ${ALLOWED_STYLES.join(", ")}.`,
        },
        { status: 400 },
      );
    }

    if (!isValidRewriteTarget(targetLanguage)) {
      return NextResponse.json(
        { message: "Invalid rewrite language." },
        { status: 400 },
      );
    }

    if (isCrossLanguageRewrite(targetLanguage)) {
      if (!isValidSourceLanguage(sourceLanguage)) {
        return NextResponse.json(
          { message: "Invalid input language." },
          { status: 400 },
        );
      }

      if (
        sourceLanguage !== SOURCE_LANGUAGE_AUTO &&
        sourceLanguage === targetLanguage
      ) {
        return NextResponse.json(
          { message: "Input and rewrite languages must differ." },
          { status: 400 },
        );
      }
    }

    const input: RewriteInput = {
      text,
      style,
      genzIntensity,
      flirtIntensity,
      ...(instructions ? { instructions } : {}),
      ...(isCrossLanguageRewrite(targetLanguage)
        ? {
            sourceLanguage: sourceLanguage as
              | typeof SOURCE_LANGUAGE_AUTO
              | LanguageCode,
            targetLanguage: targetLanguage as LanguageCode,
          }
        : {}),
    };

    const data = await rewriteWithFallback(input);

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
