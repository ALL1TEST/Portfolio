import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { db } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  let profile = null;
  try {
    profile = await db.profile.findFirst();
  } catch (error) {
    console.error("Failed to fetch profile for metadata:", error);
  }

  const logoUrl = profile ? (profile.logoUrl || undefined) : "/logo.png";
  const fullName = profile?.fullName ?? 'Abdellah Ait-Si';
  const brandName = profile?.brandName ?? 'CodeVirtox';
  const title = profile?.brandName ? `${fullName} | ${brandName}` : "Abdellah Ait-Si | Full Stack Developer & AI Automation";
  const description = profile?.shortBio ?? "Full Stack Developer specializing in React, Laravel, modern web applications, AI tools, and workflow automation.";

  return {
    title,
    description,
    keywords: [
      "Abdellah Ait-Si",
      "CodeVirtox",
      "Full Stack Developer",
      "React",
      "Laravel",
      "Next.js",
      "AI Automation",
      "Web Developer",
      "Morocco",
    ],
    authors: [{ name: fullName }],
    ...(logoUrl && { icons: { icon: logoUrl } }),
    openGraph: {
      title,
      description,
      siteName: brandName,
      type: "website",
      locale: "en_US",
      ...(logoUrl && { images: [logoUrl] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(logoUrl && { images: [logoUrl] }),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-dark text-white noise-bg`}
      >
        <AuthProvider>
          {children}
          <Toaster theme="dark" position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
