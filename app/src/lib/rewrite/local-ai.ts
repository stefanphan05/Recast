import {
  buildSystemInstruction,
  buildUserPrompt,
  maxOutputTokens,
  type RewriteInput,
} from "./prompts";
import { DEFAULT_MODEL_ID } from "./models";
import { sanitizeRewriteOutput } from "./sanitize-output";

export const LOCAL_AI_BASE =
  process.env.NEXT_PUBLIC_LOCAL_AI_BASE?.trim() || "http://127.0.0.1:11435";
export const DEFAULT_MODEL =
  process.env.NEXT_PUBLIC_LOCAL_AI_MODEL?.trim() || DEFAULT_MODEL_ID;

export class LocalAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalAIError";
  }
}

export type LocalAIHealthStatus =
  | { status: "ok" }
  | { status: "not_running" }
  | { status: "model_missing"; model: string };

export type PullProgress = {
  completed: number;
  total: number;
  status?: string;
};

export function formatPullProgressStatus(
  progress: PullProgress | null | undefined,
): string {
  if (!progress?.status) {
    return progress?.total ? "Downloading…" : "Starting download…";
  }

  const status = progress.status.toLowerCase();

  if (status === "success") return "Finishing up…";
  if (status === "pulling manifest") return "Preparing download…";
  if (status.startsWith("pulling")) return "Downloading model files…";
  if (status.startsWith("downloading")) return "Downloading model files…";
  if (status.startsWith("verifying")) return "Verifying download…";

  return "Downloading…";
}

type ChatResponse = {
  message?: {
    content?: string;
  };
  error?: string;
};

type TagsResponse = {
  models?: Array<{ name?: string }>;
};

type PullStreamChunk = {
  status?: string;
  completed?: number;
  total?: number;
  error?: string;
};

function isConnectionError(error: unknown): boolean {
  return error instanceof TypeError;
}

function modelMatches(name: string, model: string): boolean {
  return name === model || name.startsWith(`${model}:`);
}

export async function checkLocalAIRunning(): Promise<boolean> {
  try {
    const response = await fetch(LOCAL_AI_BASE);
    return response.ok;
  } catch {
    return false;
  }
}

export async function listInstalledModels(): Promise<string[]> {
  try {
    const response = await fetch(`${LOCAL_AI_BASE}/api/tags`);
    if (!response.ok) return [];

    const data = (await response.json()) as TagsResponse;
    return (data.models ?? []).map((entry) => entry.name ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

export async function checkModelAvailable(
  model: string = DEFAULT_MODEL,
): Promise<boolean> {
  const installed = await listInstalledModels();
  return installed.some((name) => modelMatches(name, model));
}

export async function getLocalAIHealthStatus(
  model: string = DEFAULT_MODEL,
): Promise<LocalAIHealthStatus> {
  const running = await checkLocalAIRunning();
  if (!running) {
    return { status: "not_running" };
  }

  const modelAvailable = await checkModelAvailable(model);
  if (!modelAvailable) {
    return { status: "model_missing", model };
  }

  return { status: "ok" };
}

export async function downloadModel(
  model: string,
  onProgress?: (progress: PullProgress) => void,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${LOCAL_AI_BASE}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: model, stream: true }),
    });
  } catch (error) {
    if (isConnectionError(error)) {
      throw new LocalAIError(
        "Local AI engine is not running. Restart Recast and try again.",
      );
    }
    throw new LocalAIError(
      "Could not reach the local AI engine. Please try again.",
    );
  }

  if (!response.ok) {
    throw new LocalAIError("Failed to download model. Please try again.");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new LocalAIError("Failed to download model. Please try again.");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      let chunk: PullStreamChunk;
      try {
        chunk = JSON.parse(line) as PullStreamChunk;
      } catch {
        continue;
      }

      if (chunk.error) {
        throw new LocalAIError(chunk.error);
      }

      onProgress?.({
        completed: chunk.completed ?? 0,
        total: chunk.total ?? 0,
        status: chunk.status,
      });
    }
  }
}

export async function rewriteWithLocalAI(
  input: RewriteInput,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${LOCAL_AI_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemInstruction(input) },
          { role: "user", content: buildUserPrompt(input) },
        ],
        stream: false,
        think: false,
        options: {
          temperature: 0.2,
          num_predict: maxOutputTokens(input.text.length),
        },
      }),
    });
  } catch (error) {
    if (isConnectionError(error)) {
      throw new LocalAIError(
        "Local AI engine is not running. Restart Recast and try again.",
      );
    }
    throw new LocalAIError(
      "Could not reach the local AI engine. Please try again.",
    );
  }

  let payload: ChatResponse;
  try {
    payload = (await response.json()) as ChatResponse;
  } catch {
    throw new LocalAIError(
      "Invalid response from the AI engine. Please try again.",
    );
  }

  if (!response.ok) {
    const message = payload.error ?? "";
    if (response.status === 404 || /not found/i.test(message)) {
      throw new LocalAIError(
        `Model ${model} is not installed. Download it in Settings.`,
      );
    }
    throw new LocalAIError(message || "AI request failed. Please try again.");
  }

  const raw = payload.message?.content?.trim();
  if (!raw) {
    throw new LocalAIError("Model returned empty rewrite. Please try again.");
  }

  const rewritten = sanitizeRewriteOutput(raw, input.text);
  if (!rewritten) {
    throw new LocalAIError("Model returned empty rewrite. Please try again.");
  }

  return rewritten;
}
