import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/winkelwagen/",
          "/auth/",
          "/sign-in/",
          "/studio/",
          "/search-results",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

