import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://descuentia.eu"),
  title: {
    default: "Descuentia | Intelligent Discounts for Local Commerce",
    template: "%s | Descuentia"
  },
  description:
    "Descuentia is the mobile-first marketplace that connects consumers with local businesses through smart discounts, loyalty programs, and campaigns that give back.",
  keywords: [
    "Descuentia",
    "discounts",
    "local commerce",
    "loyalty programs",
    "coupon marketplace",
    "cancer research"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://descuentia.eu",
    title: "Descuentia | Intelligent Discounts for Local Commerce",
    description:
      "Discover incredible discounts nearby, strengthen local businesses, and support cancer research with Descuentia.",
    siteName: "Descuentia",
    images: [
      {
        url: "https://descuentia.eu/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "Descuentia - Intelligent Discounts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Descuentia | Intelligent Discounts for Local Commerce",
    description:
      "Discover incredible discounts nearby, strengthen local businesses, and support cancer research with Descuentia.",
    images: ["https://descuentia.eu/meta/og-image.png"],
    creator: "@descuentia"
  }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
    <body className="font-sans antialiased bg-slate-50 text-slate-900">
      {children}
    </body>
  </html>
);

export default RootLayout;
