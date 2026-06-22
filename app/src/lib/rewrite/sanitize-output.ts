const CHAIN_OF_THOUGHT_MARKERS = [
  /\bthe user wants me to\b/i,
  /\blet me look at\b/i,
  /\blet me check\b/i,
  /^first,/im,
  /^next,/im,
  /^original:/im,
  /^fixed:/im,
  /\bshould be capitalized\b/i,
  /\bpreserve meaning\b/i,
];

const META_LINE_MARKERS = [
  /^first,/i,
  /^next,/i,
  /^original:/i,
  /^fixed:/i,
  /^wait,/i,
  /^the user /i,
  /^let me /i,
  /^i should /i,
];

function normalizeForDedupe(line: string): string {
  return line
    .trim()
    .toLowerCase()
    .replace(/[¿?¡!.,…:;'"()]/g, "")
    .replace(/\s+/g, " ");
}

/** Drop consecutive duplicate lines models sometimes emit when "trying" variants. */
function collapseDuplicateLines(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let previousKey = "";

  for (const line of lines) {
    const key = normalizeForDedupe(line);
    if (key && key === previousKey) continue;
    result.push(line);
    previousKey = key;
  }

  return result.join("\n").trim();
}

function stripWrappingQuotes(text: string): string {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function looksLikeChainOfThought(text: string, originalLength: number): boolean {
  if (CHAIN_OF_THOUGHT_MARKERS.some((pattern) => pattern.test(text))) {
    return true;
  }

  const lineCount = text.split("\n").filter((line) => line.trim()).length;
  return lineCount > 2 && text.length > originalLength * 4 + 80;
}

function isMetaLine(line: string): boolean {
  return META_LINE_MARKERS.some((pattern) => pattern.test(line.trim()));
}

function extractLabeledRewrite(text: string): string | undefined {
  const labeled = text.match(
    /(?:^|\n)\s*(?:Fixed|Rewritten|Rewrite|Output|Result)\s*:\s*["']?(.+?)["']?\s*$/im,
  );
  if (labeled?.[1]) {
    return stripWrappingQuotes(labeled[1]);
  }

  const quotedAfterLabel = text.match(
    /(?:Fixed|Rewritten|Rewrite|Output|Result)\s*:\s*["']([^"\n]+)["']/i,
  );
  if (quotedAfterLabel?.[1]) {
    return quotedAfterLabel[1].trim();
  }

  return undefined;
}

function extractFromQuotedLines(text: string): string | undefined {
  const matches = [...text.matchAll(/"([^"\n]{3,300})"/g)];
  if (matches.length === 0) return undefined;
  return matches[matches.length - 1][1].trim();
}

function extractFromLastSensibleLine(text: string): string | undefined {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = stripWrappingQuotes(
      lines[i].replace(/^(?:Fixed|Rewritten|Rewrite|Output|Result)\s*:\s*/i, ""),
    );
    if (line.length > 280 || isMetaLine(line)) continue;
    if (/[.!?]$/.test(line) || line.split(/\s+/).length <= 40) {
      return line;
    }
  }

  return undefined;
}

export function sanitizeRewriteOutput(
  raw: string,
  originalText: string,
): string {
  let text = raw.trim();
  if (!text) return text;

  if (looksLikeChainOfThought(text, originalText.length)) {
    const extracted =
      extractLabeledRewrite(text) ??
      extractFromQuotedLines(text) ??
      extractFromLastSensibleLine(text);
    if (extracted) {
      text = extracted;
    }
  }

  return collapseDuplicateLines(stripWrappingQuotes(text));
}
