export type RecommendedModel = {
  id: string;
  label: string;
  size: string;
  description: string;
};

export function getModelDisplayName(modelId: string): string {
  return (
    RECOMMENDED_MODELS.find((model) => model.id === modelId)?.label ?? modelId
  );
}

export const RECOMMENDED_MODELS: RecommendedModel[] = [
  {
    id: "gemma4:e2b",
    label: "Gemma 4 E2B",
    size: "3.2 GB",
    description: "Recommended — best balance of speed and quality",
  },
  {
    id: "gemma4:e4b",
    label: "Gemma 4 E4B",
    size: "6.2 GB",
    description: "Smarter rewrites, needs more disk space",
  },
  {
    id: "gemma3:4b",
    label: "Gemma 3 4B",
    size: "2.3 GB",
    description: "Lightweight and fast on older Macs",
  },
  {
    id: "qwen3:1.7b",
    label: "Qwen 3 1.7B",
    size: "1.0 GB",
    description: "Smallest download, lighter quality",
  },
];

export const DEFAULT_MODEL_ID = "gemma4:e2b";
