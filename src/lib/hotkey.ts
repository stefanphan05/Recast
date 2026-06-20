const MODIFIER_KEYS = new Set([
  "Meta",
  "Control",
  "Alt",
  "Shift",
  "CapsLock",
  "Tab",
  "Escape",
]);

function normalizeKey(key: string): string | null {
  if (key.length === 1) return key.toUpperCase();
  if (key === " ") return "Space";
  if (key === "ArrowUp") return "Up";
  if (key === "ArrowDown") return "Down";
  if (key === "ArrowLeft") return "Left";
  if (key === "ArrowRight") return "Right";
  if (/^F\d{1,2}$/.test(key)) return key;
  if (key === "Backspace") return "Backspace";
  if (key === "Delete") return "Delete";
  if (key === "Enter") return "Enter";
  if (key === "Return") return "Return";
  return null;
}

export function keyboardEventToAccelerator(
  event: KeyboardEvent,
): string | null {
  const key = normalizeKey(event.key);
  if (!key || MODIFIER_KEYS.has(event.key)) return null;

  const parts: string[] = [];
  if (event.metaKey) parts.push("Command");
  if (event.ctrlKey) parts.push("Control");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  parts.push(key);

  return parts.join("+");
}

export function formatHotkeyDisplay(accelerator: string): string {
  const isMac = window.electronAPI?.platform === "darwin";

  return accelerator
    .split("+")
    .map((part) => {
      switch (part) {
        case "Command":
          return isMac ? "⌘" : "Ctrl";
        case "CommandOrControl":
          return isMac ? "⌘" : "Ctrl";
        case "Control":
          return isMac ? "⌃" : "Ctrl";
        case "Alt":
          return isMac ? "⌥" : "Alt";
        case "Shift":
          return isMac ? "⇧" : "Shift";
        case "Space":
          return "Space";
        default:
          return part;
      }
    })
    .join(isMac ? "" : "+");
}
