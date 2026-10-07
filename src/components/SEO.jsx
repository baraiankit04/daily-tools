import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "DailyTools";
const SITE_URL = "https://daily-tools-zeta.vercel.app";

function SEO({
  title,
  description = "Free online tools for images, PDF, calculations, finance, business and everyday work.",
  keywords = "",
  noIndex = false,
  image = "/og-image.png",
}) {
  const location = useLocation();

  useEffect(() => {
    // ==============================
    // TITLE
    // ==============================

    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : "DailyTools - Free Online Tools";

    document.title = fullTitle;

    // ==============================
    // CANONICAL URL
    // ==============================

    const cleanPath =
      location.pathname === "/"
        ? ""
        : location.pathname.replace(/\/+$/, "");

    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    // ==============================
    // META NAME
    // ==============================

    const updateMeta = (name, content) => {
      let tag = document.head.querySelector(
        `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // ==============================
    // META PROPERTY
    // ==============================

    const updateProperty = (property, content) => {
      let tag = document.head.querySelector(
        `meta[property="${property}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // ==============================
    // BASIC SEO
    // ==============================

    updateMeta("description", description);

    if (keywords) {
      updateMeta("keywords", keywords);
    } else {
      const oldKeywords = document.head.querySelector(
        'meta[name="keywords"]'
      );

      if (oldKeywords) {
        oldKeywords.remove();
      }
    }

    updateMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow"
    );

    updateMeta(
      "googlebot",
      noIndex
        ? "noindex, nofollow"
        : "index, follow"
    );

    // ==============================
    // CANONICAL
    // ==============================

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    // ==============================
    // OPEN GRAPH
    // ==============================

    updateProperty("og:type", "website");
    updateProperty("og:site_name", SITE_NAME);
    updateProperty("og:title", fullTitle);
    updateProperty("og:description", description);
    updateProperty("og:url", canonicalUrl);
    updateProperty(
      "og:image",
      `${SITE_URL}${image}`
    );

    // ==============================
    // TWITTER / X
    // ==============================

    updateMeta(
      "twitter:card",
      "summary_large_image"
    );

    updateMeta("twitter:title", fullTitle);
    updateMeta(
      "twitter:description",
      description
    );

    updateMeta(
      "twitter:image",
      `${SITE_URL}${image}`
    );
  }, [
    title,
    description,
    keywords,
    noIndex,
    image,
    location.pathname,
  ]);

  return null;
}

export default SEO;