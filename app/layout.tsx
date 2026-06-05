import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POLR — Editorial Photo Album",
  description:
    "A quiet, museum-grade photo album. Warm monochrome, film grain, and polaroid frames.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
      </body>
    </html>
  );
}
