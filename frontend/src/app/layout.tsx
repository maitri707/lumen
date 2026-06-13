import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMEN",
  description:
    "LUMEN gives surgeons hands-free access to everything — patient data, CT imaging, 3D anatomy, and AI-driven surgical checklists — using only their voice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=League+Gothic&family=Sora:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased sora">{children}</body>
    </html>
  );
}
