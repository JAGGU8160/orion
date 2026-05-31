import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orion Space Digest — Gujarat's Astronomy Window",
  description:
    "Live space news, NASA APOD, asteroid watch, ISS crew, and tonight's Gujarat sky. Updated every 6 hours by Orion Invincible NGO.",
  openGraph: {
    title: "Orion Space Digest",
    description: "Astronomy news curated for Gujarat — updated every 6 hours.",
    type: "website"
  }
};

const themeInitScript = `
(function(){try{var t=localStorage.getItem('orion-theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
