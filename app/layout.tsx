import type { Metadata } from "next";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/instrument-sans/index.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource-variable/caveat/index.css";
import "./globals.css";
import { getSite } from "@/lib/content";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.title} — ${site.motto}`, template: `%s — ${site.title}` },
    description: site.description,
    authors: [{ name: site.author.name }],
    openGraph: { type: "website", siteName: site.title, title: site.title, description: site.description },
    twitter: { card: "summary" },
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
  };
}

// Applies the saved (or system) theme before first paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Masthead title={site.title} established={site.established} />
        <main id="main" className="flex-1">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
