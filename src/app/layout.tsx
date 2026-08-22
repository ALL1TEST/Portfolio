import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getProfile } from "@/lib/data-fetching";
import { generateRootJsonLd } from "@/lib/json-ld";
import { DynamicFaviconSync } from "@/components/dynamic-favicon-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let profile: Awaited<ReturnType<typeof getProfile>> = null;
  try {
    profile = await getProfile();
  } catch (error) {
    console.error("Failed to fetch profile for metadata:", error);
  }

  const baseUrl = "https://www.codevirtox.dev";
  const fullName = profile?.fullName ?? "Abdellah Ait-Si";
  const brandName = profile?.brandName ?? "CodeVirtox";
  const version = profile?.updatedAt ? new Date(profile.updatedAt).getTime() : Date.now();
  const rawLogo = profile?.logoUrl || `${baseUrl}/logo.png`;
  const logoUrl = rawLogo.includes("?") ? rawLogo : `${rawLogo}?v=${version}`;
  const defaultTitle = `${brandName} | ${fullName} - Full Stack Developer Portfolio`;
  const description =
    profile?.shortBio ??
    "CodeVirtox is the personal developer portfolio and professional brand of Abdellah Ait-Si, a Full Stack Developer specializing in React, Next.js, Laravel, scalable web applications, and AI workflow automation.";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${brandName}`,
    },
    description,
    keywords: [
      "CodeVirtox",
      "Codevirtox",
      "CodeVirtox Portfolio",
      "CodeVirtox Developer Portfolio",
      "Abdellah Ait-Si",
      "Abdellah Ait SI",
      "Abdellah Ait-Si developer",
      "Abdellah Ait-Si Full Stack Developer",
      "Abdellah Ait-Si CodeVirtox",
      "Full Stack Developer",
      "React Developer",
      "Next.js Developer",
      "Laravel Developer",
      "AI Automation Developer",
      "Web Developer Morocco",
      "Software Engineer Morocco",
    ],
    authors: [{ name: fullName, url: baseUrl }],
    creator: fullName,
    publisher: brandName,
    alternates: {
      canonical: baseUrl,
    },
    manifest: "/manifest.json",
    icons: {
      icon: profile?.logoUrl
        ? [{ url: logoUrl, type: "image/png" }]
        : [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/logo.png", type: "image/png" },
          ],
      shortcut: [logoUrl],
      apple: [
        { url: logoUrl, sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: baseUrl,
      siteName: brandName,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `${brandName} - ${fullName} Developer Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [logoUrl],
      creator: "@CodeVirtox",
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile: Awaited<ReturnType<typeof getProfile>> = null;
  try {
    profile = await getProfile();
  } catch (error) {
    // Silently continue with defaults
  }

  const jsonLd = generateRootJsonLd(profile);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E8NW4EHWKG"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-E8NW4EHWKG');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-dark text-white noise-bg`}
      >
        <DynamicFaviconSync initialLogoUrl={profile?.logoUrl} />
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}

