import AppMock from "@/components/AppMock";
import type { DemoId } from "@/lib/demos";

type DemoImageProps = {
  variant: DemoId | "hero";
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function DemoImage({
  variant,
  alt,
  className = "",
}: DemoImageProps) {
  return (
    <div
      className={`demo-frame relative overflow-hidden rounded-[1.75rem] bg-white ${className}`}
      aria-label={alt}
      role="img"
    >
      <AppMock variant={variant} className="h-full w-full" />
    </div>
  );
}
