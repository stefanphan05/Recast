import {
  buildSystemInstruction,
  buildUserPrompt,
  maxOutputTokens,
  type RewriteInput,
} from "./prompts";
import { DEFAULT_MODEL_ID } from "./models";
import { sanitizeRewriteOutput } from "./sanitize-output";

export const OLLAMA_BASE = "http://localhost:11434";
export const DEFAULT_OLLAMA_MODEL =
  process.env.NEXT_PUBLIC_OLLAMA_MODEL?.trim() || DEFAULT_MODEL_ID;

export class OllamaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OllamaError";
  }
}

export type OllamaHealthStatus =
  | { status: "ok" }
  | { status: "not_running" }
  | { status: "model_missing"; model: string };

export type PullProgress = {
  completed: number;
  total: number;
  status?: string;
};

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

export async function checkOllamaRunning(): Promise<boolean> {
  try {
    const response = await fetch(OLLAMA_BASE);
    return response.ok;
  } catch {
    return false;
  }
}

export async function listInstalledModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`);
    if (!response.ok) return [];

    const data = (await response.json()) as TagsResponse;
    return (data.models ?? [])
      .map((entry) => entry.name ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function checkModelAvailable(
  model: string = DEFAULT_OLLAMA_MODEL,
): Promise<boolean> {
  const installed = await listInstalledModels();
  return installed.some((name) => modelMatches(name, model));
}

export async function getOllamaHealthStatus(
  model: string = DEFAULT_OLLAMA_MODEL,
): Promise<OllamaHealthStatus> {
  const running = await checkOllamaRunning();
  if (!running) {
    return { status: "not_running" };
  }

  const modelAvailable = await checkModelAvailable(model);
  if (!modelAvailable) {
    return { status: "model_missing", model };
  }

  return { status: "ok" };
}

export async function pullOllamaModel(
  model: string,
  onProgress?: (progress: PullProgress) => void,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${OLLAMA_BASE}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: model, stream: true }),
    });
  } catch (error) {
    if (isConnectionError(error)) {
      throw new OllamaError(
        "Please start Ollama: run `ollama serve` in your terminal",
      );
    }
    throw new OllamaError("Could not reach Ollama. Please try again.");
  }

  if (!response.ok) {
    throw new OllamaError("Failed to download model. Please try again.");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new OllamaError("Failed to download model. Please try again.");
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
        throw new OllamaError(chunk.error);
      }

      onProgress?.({
        completed: chunk.completed ?? 0,
        total: chunk.total ?? 0,
        status: chunk.status,
      });
    }
  }
}

export async function rewriteWithOllama(
  input: RewriteInput,
  model: string = DEFAULT_OLLAMA_MODEL,
): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemInstruction(input) },
          { role: "user", content: buildUserPrompt(input) },
        ],
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: maxOutputTokens(input.text.length),
        },
      }),
    });
  } catch (error) {
    if (isConnectionError(error)) {
      throw new OllamaError(
        "Please start Ollama: run `ollama serve` in your terminal",
      );
    }
    throw new OllamaError("Could not reach Ollama. Please try again.");
  }

  let payload: ChatResponse;
  try {
    payload = (await response.json()) as ChatResponse;
  } catch {
    throw new OllamaError("Invalid response from Ollama. Please try again.");
  }

  if (!response.ok) {
    const message = payload.error ?? "";
    if (response.status === 404 || /not found/i.test(message)) {
      throw new OllamaError(
        `Model ${model} not found. Run: ollama pull ${model}`,
      );
    }
    throw new OllamaError(
      message || "Ollama request failed. Please try again.",
    );
  }

  const raw = payload.message?.content?.trim();
  if (!raw) {
    throw new OllamaError("Model returned empty rewrite. Please try again.");
  }

  const rewritten = sanitizeRewriteOutput(raw, input.text);
  if (!rewritten) {
    throw new OllamaError("Model returned empty rewrite. Please try again.");
  }

  return rewritten;
}
