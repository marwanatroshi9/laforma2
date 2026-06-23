import type { Metadata } from "next";
import "./globals.css";
import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import Shell from "@/components/Shell";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function fontHref(...families: string[]) {
  const params = families
    .filter(Boolean)
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await api.settings();
  const title = pick(s?.seo_title, s?.default_locale || "en", "Architecture Studio");
  const description = pick(s?.seo_description, s?.default_locale || "en", "");
  return {
    title: { default: title, template: `%s — ${pick(s?.company_name, "en", "Studio")}` },
    description,
    keywords: s?.seo_keywords,
    openGraph: {
      title,
      description,
      images: s?.og_image_url ? [s.og_image_url] : [],
      type: "website",
    },
    icons: s?.favicon_url ? { icon: s.favicon_url } : undefined,
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await api.settings();
  const heading = settings?.font_heading || "Cormorant Garamond";
  const body = settings?.font_body || "Inter";

  const orgName = pick(settings?.company_name, "en", "Architecture Studio");
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    url: SITE_URL,
    logo: settings?.logo_url || undefined,
    description: pick(settings?.seo_description, "en", ""),
    email: settings?.email || undefined,
    telephone: settings?.phone || undefined,
    sameAs: (settings?.social_links || []).map((s) => s.url).filter(Boolean),
  };

  const lang = settings?.default_locale || "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={fontHref(heading, body)} rel="stylesheet" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-heading:"${heading}",serif;--font-body:"${body}",sans-serif;}`,
          }}
        />
      </head>
      <body className="grain">
        <JsonLd data={organization} />
        <Shell settings={settings}>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
