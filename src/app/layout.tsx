import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "TREK | The Bison Tribe",
  description:
    "Assess your life. Discover your path. Become the man you were meant to be.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TREK | The Bison Tribe",
    description:
      "Assess your life. Discover your path. Become the man you were meant to be.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TREK by The Bison Tribe",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TREK | The Bison Tribe",
    description:
      "Assess your life. Discover your path. Become the man you were meant to be.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1410] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
