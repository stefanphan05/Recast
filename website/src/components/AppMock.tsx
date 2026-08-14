"use client";

export type AppMockVariant = "hero" | "tones" | "hotkey" | "private" | "fast";

type AppMockProps = {
  variant: AppMockVariant;
  className?: string;
};

const STYLE_CHIPS = [
  "Correct",
  "Shorter",
  "Longer",
  "Gen Z",
  "Flirty",
  "Casual",
] as const;

const SAMPLE_INPUT =
  "hey stefan, can you send me the latest build when you get a chance? i want to test it tonight";

const SAMPLE_OUTPUT =
  "Hey Stefan, can you send me the latest build when you get a chance? I want to test it tonight.";

export default function AppMock({ variant, className = "" }: AppMockProps) {
  const flirtMode = variant === "tones";
  const activeChip =
    flirtMode ? "Flirty" : variant === "hotkey" ? "Gen Z" : "Correct";
  const outputText = flirtMode
    ? "OMG Stefan, if you could magically beam over here and send me that latest build when you have a sec? I'm dying to test this masterpiece tonight! 😉"
    : SAMPLE_OUTPUT;

  return (
    <div className={`flex h-full w-full flex-col bg-white ${className}`}>
      {/* Mac window titlebar */}
      <div className="grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-black/[0.06] bg-[#f7f7f8] px-4 py-3">
        <div className="flex items-center gap-[7px]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-center text-[13px] font-medium text-black/35">
          Recast
        </p>
        <div aria-hidden className="h-3 w-[57px]" />
      </div>

      {/* Desktop area the Recast panel floats over */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-2.5 bg-[#f4f4f5] px-[7%] py-[6%]">
        <div className="w-full max-w-[400px] rounded-[20px] border border-black/[0.08] bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:p-4">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {STYLE_CHIPS.map((chip) => (
              <span
                key={chip}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium md:px-3.5 md:text-[13px] ${
                  chip === activeChip
                    ? "border-black bg-black text-white"
                    : "border-black/[0.08] bg-[#fafafa] text-black/50"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>

          {flirtMode ? (
            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.08em] text-black/35 md:text-[11px]">
                  How flirt
                </span>
                <span className="text-[13px] tabular-nums text-black/55">
                  7
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/[0.08]">
                <div className="h-full w-[70%] rounded-full bg-black/80" />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-black/35">
                <span>Normal cringe</span>
                <span>Most cringy</span>
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2.5">
            <p className="flex-1 text-[14px] leading-snug text-black/90 md:text-[15px]">
              {SAMPLE_INPUT}
            </p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <SendUpIcon />
            </span>
          </div>
        </div>

        <div className="w-full max-w-[400px] rounded-[20px] border border-black/[0.08] bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:p-4">
          <p className="text-[14px] leading-snug text-black/85 md:text-[15px]">
            {outputText}
          </p>
        </div>

        <div className="flex w-full max-w-[400px] items-center justify-between">
          <ActionIconButton>
            <CopyIcon />
          </ActionIconButton>

          <div className="flex items-center gap-1.5">
            <ActionIconButton>
              <RotateIcon />
            </ActionIconButton>
            <ActionIconButton>
              <CloseIcon />
            </ActionIconButton>
          </div>
        </div>

        {variant === "private" ? (
          <div className="mt-1 max-w-[300px] rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-center text-[12px] text-black/60 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            Runs locally on your Mac. Your text stays private.
          </div>
        ) : null}

        {variant === "hotkey" ? (
          <div className="mt-1 flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-[12px] text-black/60 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <Keycap label="⌥ Option" />
            <span>+</span>
            <Keycap label="Tab" />
            <span className="ml-1">from anywhere</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ActionIconButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black/[0.08] bg-white text-black/45">
      {children}
    </span>
  );
}

function Keycap({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-black/[0.08] bg-[#fafafa] px-2 py-1 text-[11px] font-medium text-black/70">
      {label}
    </span>
  );
}

function SendUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="13" height="13" x="9" y="9" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
