import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import {
  city,
  country,
  defaultLocale,
  googleSiteVerification,
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
    siteName,
    locale: defaultLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Explore Nigerian agricultural produce from Sodoh Nigeria Limited and contact our Abuja team.",
  },
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
    ? { google: googleSiteVerification }
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
