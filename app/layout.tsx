import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import SpotlightTracker from "@/components/SpotlightTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.shortName} — ${profile.title}`,
  description: profile.tagline,
  keywords: [
    "Satyanarayana Motipalli",
    "Software Developer",
    "Angular",
    "React",
    "Next.js",
    "Node.js",
    "AI",
    "LangChain",
    "Full-Stack Developer",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.shortName} — ${profile.title}`,
    description: profile.tagline,
    type: "website",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SpotlightTracker />
        {children}
      </body>
    </html>
  );
}
