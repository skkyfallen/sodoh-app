import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sodoh Nigeria Limited",
  description:
    "Sodoh Nigeria Limited — premium agricultural operations and produce across Nigeria.",
  openGraph: {
    title: "Sodoh Nigeria Limited",
    description:
      "Premium agricultural operations and produce across Nigeria.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: inter.style.fontFamily }}
      >
        {children}
      </body>
    </html>
  );
}
