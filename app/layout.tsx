import type { Metadata, Viewport } from "next";
import "./globals.css";
import ArticlePanel from "@/components/ArticlePanel";

export const metadata: Metadata = {
  title: "Orion Space Digest — Gujarat's Astronomy Window",
  description:
    "Live space news, NASA APOD, asteroid watch, ISS crew, and tonight's Gujarat sky. Updated every 6 hours by Orion Invincible NGO.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    title: "Orion Space Digest",
    description: "Astronomy news curated for Gujarat — updated every 6 hours.",
    type: "website",
    images: ["/whitelogo.png"]
  }
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
