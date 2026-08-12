export type LocalAIEngineProgress = {
  phase: "downloading" | "extracting" | "starting" | "ready" | "error";
  percent?: number;
  message?: string;
};
