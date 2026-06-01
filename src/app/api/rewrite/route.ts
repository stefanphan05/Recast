import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

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
  variantCount?: number;
};

type RewriteVariant = {
  text: string;
};

type RewriteResponse = {
  variants: RewriteVariant[];
};

const MAX_TEXT_LENGTH = 2000;
const MAX_VARIANTS = 5;
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

function parseJsonResponse(rawText: string): RewriteResponse {
  const parsed = JSON.parse(rawText.trim()) as RewriteResponse;

  if (!parsed || !Array.isArray(parsed.variants)) {
    throw new Error("Missing variants array in model response.");
  }

  const cleanedVariants = parsed.variants
    .map((variant) => ({
      text: String(variant?.text ?? "").trim(),
    }))
    .filter((variant) => variant.text.length > 0);

  if (cleanedVariants.length === 0) {
    throw new Error("Model returned empty variants.");
  }

  return { variants: cleanedVariants };
}

async function generateSingleVariant(input: {
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

  return { variants: [{ text: rewritten }] };
}

async function generateMultipleVariants(input: {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
  variantCount: number;
}): Promise<RewriteResponse> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${buildUserPrompt(input)}\n\nReturn exactly ${input.variantCount} different rewrites.`,
    config: {
      ...fastGenerationConfig(Math.min(4096, input.text.length * input.variantCount * 2 + 256)),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variants: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
              },
              required: ["text"],
            },
          },
        },
        required: ["variants"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Model returned empty response.");
  }

  const parsed = parseJsonResponse(text);
  if (parsed.variants.length < input.variantCount) {
    throw new Error("Model returned too few variants.");
  }

  return { variants: parsed.variants.slice(0, input.variantCount) };
}

async function generateVariants(input: {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
  variantCount: number;
}): Promise<RewriteResponse> {
  if (input.variantCount === 1) {
    return generateSingleVariant(input);
  }

  return generateMultipleVariants(input);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RewriteRequest;
    const text = String(body.text ?? "").trim();
    const style = body.style;
    const variantCount = clamp(Number(body.variantCount ?? 3), 1, MAX_VARIANTS);
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

    const data = await generateVariants({
      text,
      style,
      genzIntensity,
      variantCount,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Rewrite API error:", error);
    return NextResponse.json(
      { message: SERVER_ERROR_MESSAGE },
      { status: 500 },
    );
  }
}
