import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
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
  title: "Sodoh Nigeria Limited",
  description:
    "Explore agricultural products from Sodoh Nigeria Limited and contact the team about your needs.",
  openGraph: {
    title: "Sodoh Nigeria Limited",
    description:
      "Premium agricultural operations and produce across Nigeria.",
    type: "website",
  },
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
