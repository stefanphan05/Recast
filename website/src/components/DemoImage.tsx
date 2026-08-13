import AppMock from "@/components/AppMock";
import type { DemoId } from "@/lib/demos";

type DemoImageProps = {
  variant: DemoId | "hero";
  alt: string;
  className?: string;
};

export default function DemoImage({
  variant,
  alt,
  className = "",
}: DemoImageProps) {
  return (
    <div
      className={`demo-frame relative overflow-hidden bg-white ${className}`}
      aria-label={alt}
      role="img"
    >
      <AppMock variant={variant} className="h-full w-full" />
    </div>
  );
}
