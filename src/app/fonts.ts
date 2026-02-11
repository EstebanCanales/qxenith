import { Geist, Geist_Mono, Nanum_Brush_Script } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const nanumBrushScript = Nanum_Brush_Script({
  variable: "--font-nanum-brush-script",
  weight: "400",
  subsets: ["latin"],
});
