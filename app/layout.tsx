import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import {
  bingSiteVerification,
  city,
  country,
  googleSiteVerification,
  ogImagePath,
  ogLocale,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | Sodoh Nigeria Limited",
  },
  description:
    "Explore Nigerian agricultural produce from Sodoh Nigeria Limited, with products for local and international buyers. Contact our Abuja team about your sourcing needs.",
  openGraph: {
    title: siteName,
    description: "Explore Nigerian agricultural produce from Sodoh Nigeria Limited and contact our Abuja team.",
    url: siteUrl,
    siteName,
    images: [
      {
        url: ogImagePath,
        width: 256,
        height: 161,
        alt: siteName,
      },
    ],
    locale: ogLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Explore Nigerian agricultural produce from Sodoh Nigeria Limited and contact our Abuja team.",
    images: [ogImagePath],
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
  alternates: { canonical: siteUrl },
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { telephone: true },
  other: {
    "geo.region": "NG-FC",
    "geo.placename": city,
    "geo.country": country,
  },
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
        ...(bingSiteVerification
          ? { other: { "msvalidate.01": bingSiteVerification } }
          : {}),
      }
    : bingSiteVerification
      ? { other: { "msvalidate.01": bingSiteVerification } }
      : undefined,
};

// Light-only rendering: tells the browser (including forced-dark modes
// such as Opera's auto dark mode) to leave the page colors alone.
export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
