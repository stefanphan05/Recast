"use client";

type AppMockVariant = "hero" | "tones" | "hotkey" | "private" | "fast";

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
    <div
      className={`relative overflow-hidden rounded-[2.25rem] bg-[#f7d3be] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(84,18,54,0.9),transparent_24%),linear-gradient(135deg,#6c1d51_0%,#c9194f_24%,#e64839_58%,#ff8c58_84%,#f6d5c0_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-95 [background:repeating-linear-gradient(-32deg,rgba(255,255,255,0.09)_0,rgba(255,255,255,0.09)_22px,transparent_22px,transparent_64px)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_28%)]" />

      <div className="relative flex h-full flex-col px-[8.5%] py-[9%]">
        <div className="rounded-4xl border border-black/8 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(125,37,32,0.2)] md:px-5 md:py-5">
          <div className="flex items-center gap-2 overflow-hidden">
            {STYLE_CHIPS.map((chip) => (
              <span
                key={chip}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] md:px-4 md:text-[12px] ${
                  chip === activeChip
                    ? "border-black bg-black text-white"
                    : "border-black/8 bg-[#fbfbfb] text-black/60"
                }`}
              >
                {chip}
              </span>
            ))}

            <span className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white text-black/40">
              <ArrowRightIcon />
            </span>
          </div>

          {flirtMode ? (
            <div className="mt-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-black/30 md:text-[11px]">
                <span>How flirt</span>
                <span className="text-lg tracking-normal text-black/65">10</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-black/8">
                <div className="relative h-full w-full rounded-full">
                  <span className="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-black shadow-[0_1px_3px_rgba(0,0,0,0.18)]" />
                </div>
              </div>
              <div className="mt-3 flex justify-between text-sm text-black/32">
                <span>Normal cringe</span>
                <span>Most cringy</span>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex items-end gap-3">
            <p className="flex-1 text-[19px] leading-[1.45] text-black/90 md:text-[21px]">
              {SAMPLE_INPUT}
            </p>
            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
              <SendUpIcon />
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-4xl border border-black/8 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(125,37,32,0.18)] md:px-5">
          <p className="text-[19px] leading-[1.45] text-black/88 md:text-[21px]">
            {outputText}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <ActionIconButton>
            <CopyIcon />
          </ActionIconButton>

          <div className="flex items-center gap-3">
            <ActionIconButton>
              <RotateIcon />
            </ActionIconButton>
            <ActionIconButton>
              <CloseIcon />
            </ActionIconButton>
          </div>
        </div>

        {variant === "private" ? (
          <div className="mt-4 max-w-[320px] rounded-3xl border border-white/55 bg-white/82 px-4 py-3 text-sm text-black/65 shadow-[0_10px_20px_rgba(125,37,32,0.14)] backdrop-blur-sm">
            Runs locally on your Mac. Your text stays private.
          </div>
        ) : null}

        {variant === "hotkey" ? (
          <div className="mt-4 flex items-center gap-2 self-start rounded-3xl border border-white/55 bg-white/82 px-4 py-3 text-sm text-black/65 shadow-[0_10px_20px_rgba(125,37,32,0.14)] backdrop-blur-sm">
            <Keycap label="Option" />
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
    <button className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-black/8 bg-white text-black/55 shadow-[0_8px_18px_rgba(125,37,32,0.14)]">
      {children}
    </button>
  );
}

function Keycap({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-black/8 bg-white px-2 py-1 text-[11px] font-medium text-black/72">
      {label}
    </span>
  );
}

function ArrowRightIcon() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SendUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="21"
      height="21"
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
      width="21"
      height="21"
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
