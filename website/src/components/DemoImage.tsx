import Image from "next/image";

type DemoImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function DemoImage({
  src,
  alt,
  className = "",
  priority = false,
}: DemoImageProps) {
  return (
    <div
      className={`demo-frame relative overflow-hidden rounded-[1.75rem] bg-[#ece7df] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1152px"
        className="object-cover object-top"
      />
    </div>
  );
}
