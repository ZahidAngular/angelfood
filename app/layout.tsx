import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { websiteSchema } from "@/lib/schema";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Aotearoa's original vegan cheese company — started a food revolution in 2006. Dairy-free cheese that doesn't ask you to compromise — because doing good should taste incredible.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Angel Food — Better Vegan Cheese",
    // Page-level titles already include "— Angel Food", so pass them through.
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "vegan cheese",
    "dairy free",
    "New Zealand",
    "Angel Food",
    "plant based",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NZ",
    url: "/",
    title: "Angel Food — Better Vegan Cheese",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Angel Food vegan cheese",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Food — Better Vegan Cheese",
    description: SITE_DESCRIPTION,
    images: ["/images/hero.webp"],
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
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

/** Organization details for search engines — invisible to visitors.
 *  The @id lets the WebSite block point back here instead of repeating the
 *  brand details, so Google reads the two as one entity. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2006",
  email: "info@angelfood.co.nz",
  telephone: "0800 115002",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NZ",
  },
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" className={`${bricolage.variable} ${jakarta.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VC39WBBMXK"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VC39WBBMXK');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KQBSXHJ9');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="grain">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQBSXHJ9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <JsonLd data={[organizationJsonLd, websiteSchema]} />
        <SmoothScroll>
          <ScrollToTop />
          <CustomCursor />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
