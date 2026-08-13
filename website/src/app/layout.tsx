import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recast — Write with confidence on Mac",
  description:
    "Paste your message, pick a tone, and get a rewritten version in seconds. Local AI for Mac — your text never leaves your device.",
};

const THEME_INIT_SCRIPT = `
try {
  var stored = localStorage.getItem("recast-theme");
  var theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
