import type { Metadata } from "next";
import { geistSans, geistMono, nanumBrushScript } from "./fonts";
import "./globals.css";
import CircleMenu from "@/components/CircleMenu";

const SITE_URL = "https://qxenith.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QXENITH — Digital Studio | Web Development, Design & Branding",
    template: "%s | QXENITH",
  },
  description:
    "We craft ideas worth existing — merging technology, design, and purpose into digital experiences that matter. Web development, UI/UX design, brand identity, and motion.",
  keywords: [
    "web development",
    "UI/UX design",
    "brand identity",
    "digital studio",
    "creative agency",
    "motion design",
    "3D",
    "Next.js",
    "QXENITH",
  ],
  authors: [{ name: "QXENITH" }],
  creator: "QXENITH",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "QXENITH",
    title: "QXENITH — Digital Studio | Web Development, Design & Branding",
    description:
      "We craft ideas worth existing — merging technology, design, and purpose into digital experiences that matter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QXENITH — Digital Studio",
    description:
      "We craft ideas worth existing — merging technology, design, and purpose into digital experiences that matter.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${nanumBrushScript.variable} antialiased`}
      >
        <CircleMenu />
        {children}
      </body>
    </html>
  );
}
