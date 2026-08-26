import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
} from "@/data/site";
import { profile } from "@/data/profile";
import { techCategories } from "@/data/techStack";
import { projects } from "@/data/projects";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${profile.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  category: "technology",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#030508",
  width: "device-width",
  initialScale: 1,
};

/** Structured data: Person + WebSite + ProfilePage + project ItemList. */
function buildJsonLd() {
  const sameAs = [
    profile.socials.github,
    profile.socials.linkedin,
    profile.socials.telegram,
    profile.socials.website,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        jobTitle: profile.title,
        description:
          "Developer from Myanmar focused on building clean, reliable and modern digital systems.",
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        email: profile.socials.email || undefined,
        address: { "@type": "PostalAddress", addressCountry: "MM" },
        knowsAbout: [
          ...profile.focus,
          ...techCategories.flatMap((c) => c.items),
        ],
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Projects",
        itemListElement: projects.map((project, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: project.name,
            description: project.description,
            keywords: project.technologies.join(", "),
            url: `${SITE_URL}/#projects`,
            creator: { "@id": `${SITE_URL}/#person` },
          },
        })),
      },
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
