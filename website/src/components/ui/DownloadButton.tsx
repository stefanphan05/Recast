import Link from "next/link";
import { GITHUB_RELEASES_URL } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DownloadButtonProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  directDownload?: boolean;
};

export default function DownloadButton({
  className = "",
  children = "Download for Mac",
  variant = "default",
  size = "lg",
  directDownload = false,
}: DownloadButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (directDownload) {
    return (
      <a
        href={GITHUB_RELEASES_URL}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href="/download/" className={classes}>
      {children}
    </Link>
  );
}
