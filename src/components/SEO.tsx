import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  noindex?: boolean;
}

const BASE_DOMAIN = "https://sohaildevops.site";
const SITE_NAME = "SohailVerse";

// Reliable existing public visual asset for social share preview cards
const DEFAULT_SOCIAL_IMAGE = "https://sohaildevops.site/about-hero.jpg";

/**
 * Updates or creates a <meta> tag by its name attribute.
 */
function setMetaByName(name: string, content: string | null) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Updates or creates a <meta> tag by its property attribute (e.g. Open Graph).
 */
function setMetaByProperty(property: string, content: string | null) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Updates or creates the single <link rel="canonical"> tag.
 */
function setCanonicalUrl(url: string | null) {
  // Remove any duplicate canonical links if they exist
  const existingLinks = document.querySelectorAll('link[rel="canonical"]');
  if (existingLinks.length > 1) {
    existingLinks.forEach((l, idx) => {
      if (idx > 0) l.remove();
    });
  }

  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!url) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/**
 * Updates or injects the structured data (JSON-LD) script.
 */
function setJsonLd(id: string, schemaObj: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!schemaObj) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaObj);
}

/**
 * Route-specific default SEO metadata map.
 */
export const ROUTE_SEO_MAP: Record<string, SEOProps> = {
  "/": {
    title: "SohailVerse — Systems, Cloud & Full-Stack Engineering",
    description:
      "SohailVerse is Mohammed Sohail's digital portfolio covering systems, cloud, DevOps, full-stack engineering, projects, cinema, and learning.",
    canonicalPath: "/",
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/about": {
    title: "About — SohailVerse",
    description:
      "Learn about Mohammed Sohail, his journey, engineering mindset, skills, and experience through the SohailVerse digital portfolio.",
    canonicalPath: "/about",
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/timeline": {
    title: "About — SohailVerse",
    description:
      "Learn about Mohammed Sohail, his journey, engineering mindset, skills, and experience through the SohailVerse digital portfolio.",
    canonicalPath: "/about", // Canonicalizes to /about
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/projects": {
    title: "Projects — SohailVerse",
    description:
      "Explore SohailVerse projects covering DevOps, cloud, full-stack development, automation, and software engineering.",
    canonicalPath: "/projects",
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/cinema": {
    title: "Cinema — SohailVerse",
    description:
      "Explore the SohailVerse Cinema Observatory, a curated collection of movies, observations, ratings, and cinematic experiences.",
    canonicalPath: "/cinema",
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/devops": {
    title: "DevOps — SohailVerse",
    description:
      "Explore the SohailVerse DevOps roadmap, learning modules, infrastructure work, cloud technologies, automation, and engineering notes.",
    canonicalPath: "/devops",
    type: "website",
    image: DEFAULT_SOCIAL_IMAGE,
    noindex: false,
  },
  "/admin": {
    title: "Admin Console — SohailVerse",
    description: "Private administration console for SohailVerse portfolio management.",
    canonicalPath: "/admin",
    noindex: true,
  },
  "/console": {
    title: "Admin Console — SohailVerse",
    description: "Private administration console for SohailVerse portfolio management.",
    canonicalPath: "/console",
    noindex: true,
  },
};

/**
 * Structured Data definitions
 */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SohailVerse",
  alternateName: "SohailVerse",
  url: "https://sohaildevops.site/",
  description:
    "SohailVerse is Mohammed Sohail's digital portfolio covering systems, cloud, DevOps, full-stack engineering, projects, cinema, and learning.",
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammed Sohail",
  url: "https://sohaildevops.site/",
  sameAs: [
    "https://github.com/sohail-24",
    "https://www.linkedin.com/in/md-sohail2001",
    "https://twitter.com",
  ],
};

/**
 * Lightweight Hook for updating Document Head SEO & metadata dynamically on route changes.
 */
export function useSEO(overrideProps?: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const defaultMeta = ROUTE_SEO_MAP[location.pathname] || {
      title: "SohailVerse — Systems, Cloud & Full-Stack Engineering",
      description:
        "SohailVerse is Mohammed Sohail's digital portfolio covering systems, cloud, DevOps, full-stack engineering, projects, cinema, and learning.",
      canonicalPath: location.pathname,
      type: "website",
      image: DEFAULT_SOCIAL_IMAGE,
      noindex: location.pathname.startsWith("/admin") || location.pathname.startsWith("/console"),
    };

    const finalConfig: SEOProps = {
      ...defaultMeta,
      ...overrideProps,
    };

    const title = finalConfig.title || "SohailVerse — Systems, Cloud & Full-Stack Engineering";
    const description = finalConfig.description || "";
    const canonicalPath = finalConfig.canonicalPath || location.pathname;
    const canonicalUrl = `${BASE_DOMAIN}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
    const ogType = finalConfig.type || "website";
    const ogImage = finalConfig.image || DEFAULT_SOCIAL_IMAGE;
    const isNoindex = Boolean(finalConfig.noindex);

    // 1. Update Document Title
    document.title = title;

    // 2. Robots meta (noindex, nofollow for admin/console)
    if (isNoindex) {
      setMetaByName("robots", "noindex, nofollow");
    } else {
      setMetaByName("robots", "index, follow");
    }

    // 3. Meta Description
    setMetaByName("description", description);

    // 4. Canonical URL
    setCanonicalUrl(canonicalUrl);

    // 5. Open Graph Metadata
    setMetaByProperty("og:title", title);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:type", ogType);
    setMetaByProperty("og:site_name", SITE_NAME);
    if (ogImage) {
      setMetaByProperty("og:image", ogImage);
    }

    // 6. Twitter / X Cards
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
    if (ogImage) {
      setMetaByName("twitter:image", ogImage);
    }

    // 7. Structured Data (WebSite & Person JSON-LD)
    if (!isNoindex) {
      setJsonLd("structured-data-website", websiteJsonLd);
      setJsonLd("structured-data-person", personJsonLd);
    } else {
      setJsonLd("structured-data-website", null);
      setJsonLd("structured-data-person", null);
    }
  }, [location.pathname, overrideProps]);
}

/**
 * Reusable SEO Component that mounts the head manager
 */
export default function SEO(props: SEOProps) {
  useSEO(props);
  return null;
}
