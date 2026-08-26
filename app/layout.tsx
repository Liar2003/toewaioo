import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// PLACEHOLDER domain — replace before production deployment.
const SITE_URL = "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toewaioo — Intermediate Developer",
    template: "%s | Toewaioo",
  },
  description:
    "Intermediate Developer from Myanmar building modern web applications, clean APIs and reliable digital systems.",
  keywords: [
    "intermediate developer",
    "myanmar developer",
    "web developer",
    "API engineering",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Toewaioo" }],
  creator: "Toewaioo",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Toewaioo — Portfolio",
    title: "Toewaioo — Intermediate Developer",
    description:
      "Intermediate Developer from Myanmar building modern web applications, clean APIs and reliable digital systems.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toewaioo — Intermediate Developer",
    description:
      "Intermediate Developer from Myanmar building modern web applications, clean APIs and reliable digital systems.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#030508",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Toewaioo",
  jobTitle: "Intermediate Developer",
  description:
    "Developer from Myanmar focused on building clean, reliable and modern digital systems.",
  knowsAbout: [
    "Web Development",
    "API Engineering",
    "Database Design",
    "Problem Solving",
  ],
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
