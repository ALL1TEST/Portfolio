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

export const metadata: Metadata = {
  title: "Abdellah Ait-Si | Full Stack Developer & AI Automation",
  description:
    "Full Stack Developer specializing in React, Laravel, modern web applications, AI tools, and workflow automation. CodeVirtox — Building smart automated solutions.",
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
  authors: [{ name: "Abdellah Ait-Si" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Abdellah Ait-Si | Full Stack Developer & AI Automation",
    description:
      "Full Stack Developer specializing in React, Laravel, modern web applications, AI tools, and workflow automation.",
    siteName: "CodeVirtox",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdellah Ait-Si | Full Stack Developer & AI Automation",
    description:
      "Full Stack Developer specializing in React, Laravel, modern web applications, AI tools, and workflow automation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
