import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rate-limit";

const ALLOWED_STYLES = [
  "grammar",
  "shorter",
  "formal",
  "casual",
  "genz",
] as const;
type RewriteStyle = (typeof ALLOWED_STYLES)[number];

type RewriteRequest = {
  text?: string;
  style?: RewriteStyle;
  genzIntensity?: number;
};

type RewriteResponse = {
  text: string;
};

const MAX_TEXT_LENGTH = 2000;
const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const SYSTEM_INSTRUCTION =
  "Rewrite user messages in better English. Preserve meaning and intent. Return only the rewritten text with no quotes, labels, or commentary.";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }
  return new GoogleGenAI({ apiKey });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildStyleInstruction(
  style: RewriteStyle,
  genzIntensity: number,
): string {
  if (style === "grammar") {
    return "Fix grammar, spelling, and punctuation only. Keep the same tone, length, and wording as much as possible.";
  }

  if (style === "shorter") {
    return "Make the message shorter and more concise while preserving the full meaning and intent.";
  }

  if (style === "formal") {
    return "Use formal, professional wording that is clear and polite.";
  }

  if (style === "casual") {
    return "Use friendly, natural casual wording while staying respectful.";
  }

  const intensity = clamp(genzIntensity, 0, 10);

  if (intensity <= 2) {
    return "Use mostly standard English with only a light modern vibe.";
  }

  if (intensity <= 5) {
    return "Use modern Gen Z-friendly tone with some slang, but keep it broadly understandable.";
  }

  if (intensity <= 8) {
    return "Use clearly Gen Z-style phrasing and slang while preserving clarity.";
  }

  return "Use strong Gen Z slang and internet-style vibe, but keep the sentence understandable.";
}

function buildUserPrompt(input: {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
}): string {
  return `Style: ${input.style}\n${buildStyleInstruction(input.style, input.genzIntensity)}\n\nMessage:\n${input.text}`;
}

function fastGenerationConfig(maxOutputTokens: number) {
  return {
    systemInstruction: SYSTEM_INSTRUCTION,
    thinkingConfig: { thinkingBudget: 0 },
    temperature: 0.2,
    maxOutputTokens,
  };
}

async function generateRewrite(input: {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
}): Promise<RewriteResponse> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildUserPrompt(input),
    config: fastGenerationConfig(Math.min(2048, input.text.length * 2 + 128)),
  });

  const rewritten = response.text?.trim();
  if (!rewritten) {
    throw new Error("Model returned empty rewrite.");
  }

  return { text: rewritten };
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

    const data = await generateRewrite({
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
