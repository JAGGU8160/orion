import type { Metadata, Viewport } from "next";
import "./globals.css";
import ArticlePanel from "@/components/ArticlePanel";

const SITE_URL = "https://orion-space-digest.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Orion Space Digest — Astronomy News for Gujarat & Ahmedabad",
    template: "%s | Orion Space Digest",
  },
  description:
    "Live astronomy news, NASA APOD, tonight's sky from Ahmedabad & Gujarat, asteroid alerts, ISS crew, moon phases & stargazing events. Curated by Invincible Project Orion NGO.",
  keywords: [
    "astronomy Gujarat", "space news Ahmedabad", "tonight sky Gujarat",
    "new moon Ahmedabad", "full moon Gujarat", "stargazing Ahmedabad",
    "meteor shower Gujarat", "ISS visible Ahmedabad", "NASA news India",
    "telescope events Gujarat", "Invincible Project Orion", "Orion NGO astronomy",
    "space digest India", "astronomy news Hindi Gujarat", "planet visible tonight Gujarat",
    "moon phase Ahmedabad", "asteroid watch India", "NASA APOD today",
    "space education Gujarat", "astronomy club Ahmedabad",
  ],
  authors: [{ name: "Invincible Project Orion", url: SITE_URL }],
  creator: "Invincible Project Orion NGO",
  publisher: "Invincible Project Orion",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Orion Space Digest — Astronomy News for Gujarat & Ahmedabad",
    description:
      "Tonight's sky from Ahmedabad, live space news, NASA APOD, asteroid alerts & ISS crew. Updated every 6 hours by Invincible Project Orion NGO.",
    url: SITE_URL,
    siteName: "Orion Space Digest",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/whitelogo.png",
        width: 1200,
        height: 630,
        alt: "Orion Space Digest — Gujarat Astronomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion Space Digest — Gujarat's Astronomy Window",
    description: "Tonight's sky from Ahmedabad, NASA news & asteroid alerts. Updated every 6h.",
    images: ["/whitelogo.png"],
  },
  category: "science",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060f" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" }
  ]
};

// Pre-paint script: pick theme based on stored preference OR a coarse
// "is it daytime in IST?" check. The precise sunrise/sunset calc takes over
// after hydration in ThemeToggle.
const themeInitScript = `
(function(){
  try {
    var m = localStorage.getItem('orion-theme-mode');
    var t;
    if (m === 'light' || m === 'dark') {
      t = m;
    } else {
      // auto / unset — use IST hour (6:00–18:00 = day, else night)
      var d = new Date();
      var ist = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000);
      var h = ist.getHours();
      t = (h >= 6 && h < 18) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Invincible Project Orion",
      "alternateName": "Orion NGO",
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/whitelogo.png` },
      "description": "Astronomy outreach NGO based in Ahmedabad, Gujarat, India — making space science accessible to students and communities.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
        "addressCountry": "IN",
      },
      "areaServed": ["Ahmedabad", "Gujarat", "India"],
      "knowsAbout": ["Astronomy", "Space Science", "Stargazing", "Moon Phases", "Meteor Showers", "Telescopes"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Orion Space Digest",
      "description": "Live astronomy news and tonight's sky guide for Gujarat & Ahmedabad.",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
      "inLanguage": "en-IN",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": "Orion Space Digest — Astronomy News for Gujarat & Ahmedabad",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".top-stories", ".sky-tonight"],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        {children}
        <ArticlePanel />
      </body>
    </html>
  );
}
