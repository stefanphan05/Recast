import AppMock, { type AppMockVariant } from "@/components/AppMock";

type AppMockFrameProps = {
  variant: AppMockVariant;
  alt: string;
  className?: string;
};

export default function AppMockFrame({
  variant,
  alt,
  className = "",
}: AppMockFrameProps) {
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
