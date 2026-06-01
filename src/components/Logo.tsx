type LogoSize = "sm" | "md" | "lg";

const SIZES: Record<LogoSize, string> = {
  sm: "text-[23px]",
  md: "text-[28px]",
  lg: "text-[36px]",
};

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const textSize = SIZES[size];

  return (
    <div className="flex items-center font-sans">
      <span className={`${textSize} font-medium tracking-tight text-[#111]`}>
        Message
      </span>
      <span className="mx-[3px] mb-[2px] inline-block h-[5px] w-[5px] self-center rounded-full bg-[#534AB7]" />
      <span className={`${textSize} font-light tracking-tight text-[#888]`}>
        Rewriter
      </span>
    </div>
  );
}
