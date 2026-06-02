type LogoSize = "sm" | "md" | "lg";

const SIZES: Record<LogoSize, string> = {
  sm: "text-[20px] sm:text-[23px]",
  md: "text-[28px]",
  lg: "text-[36px]",
};

const DOT_SIZES: Record<LogoSize, string> = {
  sm: "mx-[3px] mb-[2px] inline-block h-[4px] w-[4px] self-center rounded-full bg-[#534AB7] sm:h-[5px] sm:w-[5px]",
  md: "mx-[3px] mb-[2px] inline-block h-[5px] w-[5px] self-center rounded-full bg-[#534AB7]",
  lg: "mx-[3px] mb-[2px] inline-block h-[6px] w-[6px] self-center rounded-full bg-[#534AB7]",
};

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const textSize = SIZES[size];

  return (
    <div className="flex items-center font-sans">
      <span
        className={`${textSize} font-medium tracking-tight text-neutral-950 dark:text-neutral-100`}
      >
        Message
      </span>
      <span className={DOT_SIZES[size]} />
      <span
        className={`${textSize} font-light tracking-tight text-neutral-500 dark:text-neutral-400`}
      >
        Rewriter
      </span>
    </div>
  );
}
