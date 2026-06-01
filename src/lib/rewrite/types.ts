import type { RewriteInput } from "./prompts";

export type RewriteResult = {
  text: string;
};

export type RewriteProvider = {
  id: string;
  isConfigured: () => boolean;
  rewrite: (input: RewriteInput) => Promise<RewriteResult>;
};

export class ProviderError extends Error {
  readonly providerId: string;
  readonly retryable: boolean;
  readonly status?: number;

  constructor(
    providerId: string,
    message: string,
    options?: { retryable?: boolean; status?: number; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ProviderError";
    this.providerId = providerId;
    this.retryable = options?.retryable ?? true;
    this.status = options?.status;
  }
}
