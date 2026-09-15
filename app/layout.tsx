import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const description =
  "Secure, tenant-isolated e-voting for elections, pageants, and institutions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://balotiq.com"),
  title: {
    default: "Balotiq — Secure e-voting for elections & Engage events",
    template: "%s | Balotiq",
  },
  description,
  applicationName: "Balotiq",
  keywords: [
    "e-voting platform",
    "online voting software",
    "election software",
    "pageant voting",
    "awards voting",
    "secure voting",
  ],
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Balotiq",
    description,
    url: "https://balotiq.com",
    siteName: "Balotiq",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balotiq",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
