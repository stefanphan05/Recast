export type RecommendedModel = {
  id: string;
  label: string;
  size: string;
  description: string;
};

export const RECOMMENDED_MODELS: RecommendedModel[] = [
  {
    id: "llama3.2",
    label: "Balanced",
    size: "~2 GB",
    description: "Best default for rewrite quality and speed",
  },
  {
    id: "gemma3:4b",
    label: "Fast & light",
    size: "~3 GB",
    description: "Good on older Macs",
  },
  {
    id: "phi4-mini",
    label: "Smallest",
    size: "~2.5 GB",
    description: "Fastest, lighter quality",
  },
];

export const DEFAULT_MODEL_ID = "llama3.2";
