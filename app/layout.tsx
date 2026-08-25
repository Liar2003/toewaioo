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
    default: "MG MG — Senior Full-Stack Developer",
    template: "%s | MG MG",
  },
  description:
    "Senior Full-Stack Developer building scalable web applications, high-performance APIs, automation systems and production infrastructure.",
  keywords: [
    "full-stack developer",
    "backend engineer",
    "API engineering",
    "system architecture",
    "Laravel",
    "Go",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "MG MG" }],
  creator: "MG MG",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MG MG — Portfolio",
    title: "MG MG — Senior Full-Stack Developer",
    description:
      "Senior Full-Stack Developer building scalable web applications, high-performance APIs, automation systems and production infrastructure.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MG MG — Senior Full-Stack Developer",
    description:
      "Senior Full-Stack Developer building scalable web applications, high-performance APIs, automation systems and production infrastructure.",
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
  name: "MG MG",
  jobTitle: "Senior Full-Stack Developer",
  description:
    "Full-stack developer focused on backend architecture, API engineering and production infrastructure.",
  knowsAbout: [
    "Backend Architecture",
    "API Engineering",
    "Database Design",
    "DevOps",
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
