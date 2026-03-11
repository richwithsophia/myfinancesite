import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Rich with Sophia — Markets explained for your real life.",
    template: "%s | Rich with Sophia",
  },
  description: "Personal finance and market news explained simply for high-earning women. Get your daily brief, calculate your net worth, and actually understand what's happening in the markets.",
  keywords: ["personal finance for women", "market news explained simply", "investing for women", "daily market brief", "net worth calculator", "financial literacy"],
  openGraph: {
    siteName: "Rich with Sophia",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    site: "@richwithsophia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}