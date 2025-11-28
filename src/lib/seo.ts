/**
 * SEO Configuration
 * Centralized SEO constants and utilities
 */

export const siteConfig = {
  name: "Lazo Spirits Den Haag",
  shortName: "Lazo Spirits",
  description: "Authentieke Smaken uit Bulgarije, Polen & Griekenland. Ontdek onze exclusieve collectie van traditionele dranken, direct geïmporteerd voor de beste kwaliteit en smaak.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.lazodenhaagspirits.nl",
  ogImage: "/logo.png",
  locale: "nl_NL",
  type: "website",
  keywords: [
    "spirits",
    "alcoholische dranken",
    "wodka",
    "ouzo",
    "rakija",
    "Bulgarije",
    "Polen",
    "Griekenland",
    "Den Haag",
    "premium spirits",
    "traditionele dranken",
    "exclusieve collectie",
    "Lazo Spirits",
  ],
  twitter: {
    card: "summary_large_image" as const,
    site: "@lazospirits", // Update if you have Twitter handle
  },
  contact: {
    email: process.env.COMPANY_EMAIL || "info@lazodenhaagspirits.nl",
    phone: process.env.COMPANY_PHONE || "",
    address: process.env.COMPANY_ADDRESS || "",
    city: process.env.COMPANY_CITY || "Den Haag",
  },
};

/**
 * Generate metadata for a page
 */
export function generateMetadata({
  title,
  description,
  path = "",
  image,
  noindex = false,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  keywords?: string[];
}) {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords ? keywords.join(", ") : siteConfig.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      type: siteConfig.type,
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
      areaServed: "NL",
      availableLanguage: ["Dutch", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.city,
      addressCountry: "NL",
    },
    sameAs: [
      // Add social media links if available
      // "https://www.facebook.com/lazospirits",
      // "https://www.instagram.com/lazospirits",
    ],
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search-results?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  inStock: boolean;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}${product.url}`,
      priceCurrency: "EUR",
      price: product.price.toString(),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };
}

