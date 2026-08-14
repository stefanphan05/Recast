import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type UnderlineLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  showIcon?: boolean;
};

export default function UnderlineLink({
  href,
  children,
  className = "",
  external = false,
  showIcon = true,
}: UnderlineLinkProps) {
  const classes = cn("underline-link", className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        {showIcon && (
          <ExternalLink className="ml-1 -mt-0.5 inline-block h-3.5 w-3.5" />
        )}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
