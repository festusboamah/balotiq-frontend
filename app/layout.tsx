import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import HomeHeader from "@/components/home/home-header";

const frauncesHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "900"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "600", "700", "900"],
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
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        outfit.variable,
        frauncesHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <HomeHeader />

        {children}
      </body>
    </html>
  );
}
