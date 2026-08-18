const MODIFIER_ONLY_KEYS = new Set([
  "Meta",
  "Control",
  "Alt",
  "Shift",
  "CapsLock",
  "Escape",
]);

const SPECIAL_KEYS = {
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

function normalizeKey(key) {
  if (!key) return null;
  if (key.length === 1) return key.toUpperCase();
  if (/^F\d{1,2}$/.test(key)) return key;
  return SPECIAL_KEYS[key] ?? null;
}

function codeToAcceleratorKey(code) {
  if (!code) return null;
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) {
    const digit = code.slice(6);
    if (/^\d$/.test(digit)) return `num${digit}`;
  }

  const codeMap = {
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

function resolveAcceleratorKey(input) {
  return codeToAcceleratorKey(input.code) ?? normalizeKey(input.key);
}

function inputEventToAccelerator(input) {
  if (input.type !== "keyDown") return null;
  if (MODIFIER_ONLY_KEYS.has(input.key)) return null;

  const key = resolveAcceleratorKey(input);
  if (!key) return null;

  const parts = [];
  if (input.meta) parts.push("Command");
  if (input.control) parts.push("Control");
  if (input.alt) parts.push("Alt");
  if (input.shift) parts.push("Shift");
  parts.push(key);

  return parts.join("+");
}

module.exports = {
  inputEventToAccelerator,
};
