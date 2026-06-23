import Link from "next/link";
import { GITHUB_RELEASES_URL } from "@/lib/constants";

type DownloadButtonProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function DownloadButton({
  className = "",
  children = "Download for Mac",
  variant = "primary",
}: DownloadButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all";
  const styles =
    variant === "primary"
      ? "site-button-primary"
      : "site-button-secondary";

  return (
    <a
      href={GITHUB_RELEASES_URL}
      className={`${base} ${styles} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function DownloadLink({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href="/download/" className={className}>
      {children}
    </Link>
  );
}
