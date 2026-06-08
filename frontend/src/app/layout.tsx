import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMEN — Voice-Directed Intelligence for the Operating Room",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
