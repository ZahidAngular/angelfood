import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/site";

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
        url: "/images/hero.png",
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
    images: ["/images/hero.png"],
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

/** Organization details for search engines — invisible to visitors. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
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
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
