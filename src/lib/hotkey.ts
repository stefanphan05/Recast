export const DEFAULT_GLOBAL_HOTKEY = "Alt+Tab";

const MODIFIER_ONLY_KEYS = new Set([
  "Meta",
  "Control",
  "Alt",
  "Shift",
  "CapsLock",
  "Escape",
]);

const SPECIAL_KEYS: Record<string, string> = {
  " ": "Space",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Backspace: "Backspace",
  Delete: "Delete",
  Enter: "Enter",
  Return: "Return",
  Tab: "Tab",
};

export function getEffectiveHotkey(hotkey: string | undefined): string {
  return hotkey || DEFAULT_GLOBAL_HOTKEY;
}

function normalizeKey(key: string): string | null {
  if (key.length === 1) return key.toUpperCase();
  if (/^F\d{1,2}$/.test(key)) return key;
  return SPECIAL_KEYS[key] ?? null;
}

function codeToAcceleratorKey(code: string): string | null {
  if (!code) return null;
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) {
    const digit = code.slice(6);
    if (/^\d$/.test(digit)) return `num${digit}`;
  }

  const codeMap: Record<string, string> = {
    Space: "Space",
    Tab: "Tab",
    Backspace: "Backspace",
    Delete: "Delete",
    Enter: "Enter",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
  };

  if (codeMap[code]) return codeMap[code];
  if (/^F\d{1,2}$/.test(code)) return code;
  return null;
}

function resolveAcceleratorKey(event: KeyboardEvent): string | null {
  return codeToAcceleratorKey(event.code) ?? normalizeKey(event.key);
}

export function keyboardEventToAccelerator(
  event: KeyboardEvent,
): string | null {
  if (MODIFIER_ONLY_KEYS.has(event.key)) return null;

  const key = resolveAcceleratorKey(event);
  if (!key) return null;

  const parts: string[] = [];
  if (event.metaKey) parts.push("Command");
  if (event.ctrlKey) parts.push("Control");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  parts.push(key);

  return parts.join("+");
}

const DISPLAY_SYMBOLS: Record<string, { mac: string; other: string }> = {
  Command: { mac: "⌘", other: "Ctrl" },
  CommandOrControl: { mac: "⌘", other: "Ctrl" },
  Control: { mac: "⌃", other: "Ctrl" },
  Alt: { mac: "⌥", other: "Alt" },
  Shift: { mac: "⇧", other: "Shift" },
  Space: { mac: "Space", other: "Space" },
};

export function formatHotkeyDisplay(accelerator: string): string {
  const isMac = window.electronAPI?.platform === "darwin";

  return accelerator
    .split("+")
    .map((part) => {
      const symbols = DISPLAY_SYMBOLS[part];
      if (symbols) return isMac ? symbols.mac : symbols.other;
      return part;
    })
    .join(isMac ? "" : "+");
}
