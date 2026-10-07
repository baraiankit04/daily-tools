import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seoData from "../data/seoData";

const SITE_NAME = "DailyTools";
const SITE_URL = "https://mydailytools-gamma.vercel.app";

function SEO({
  title,
  description = "Free online tools for images, PDF, calculations, finance, business and everyday work.",
  keywords = "",
  noIndex = false,
  image = "/og-image.png",
  type = "website",
}) {
  const location = useLocation();

  useEffect(() => {
    const cleanPath =
      location.pathname === "/"
        ? ""
        : location.pathname.replace(/\/+$/, "");

    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    const routeSeo = seoData[location.pathname];
    const effectiveTitle = routeSeo?.title || title;
    const effectiveDescription = routeSeo?.description || description;
    const effectiveKeywords = routeSeo?.keywords || keywords;

    const fullTitle = effectiveTitle
      ? `${effectiveTitle} | ${SITE_NAME}`
      : "DailyTools - Free Online Tools";

    document.title = fullTitle;

    // =========================
    // META NAME
    // =========================

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

    // =========================
    // META PROPERTY
    // =========================

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

    // =========================
    // BASIC SEO
    // =========================

    updateMeta("description", effectiveDescription);

    if (effectiveKeywords) {
      updateMeta("keywords", effectiveKeywords);
    } else {
      const oldKeywords = document.head.querySelector(
        'meta[name="keywords"]'
      );

      if (oldKeywords) {
        oldKeywords.remove();
      }
    }

    const robotsValue = noIndex
      ? "noindex, nofollow"
      : "index, follow";

    updateMeta("robots", robotsValue);
    updateMeta("googlebot", robotsValue);

    // =========================
    // CANONICAL
    // =========================

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");

      canonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      canonicalUrl
    );

    // =========================
    // OPEN GRAPH
    // =========================

    updateProperty("og:type", "website");

    updateProperty(
      "og:site_name",
      SITE_NAME
    );

    updateProperty(
      "og:title",
      fullTitle
    );

    updateProperty(
      "og:description",
      effectiveDescription
    );

    updateProperty(
      "og:url",
      canonicalUrl
    );

    updateProperty(
      "og:image",
      `${SITE_URL}${image}`
    );

    // =========================
    // TWITTER / X
    // =========================

    updateMeta(
      "twitter:card",
      "summary_large_image"
    );

    updateMeta(
      "twitter:title",
      fullTitle
    );

    updateMeta(
      "twitter:description",
      effectiveDescription
    );

    updateMeta(
      "twitter:image",
      `${SITE_URL}${image}`
    );

    // =========================
    // REMOVE OLD SCHEMA
    // =========================

    const oldSchema =
      document.getElementById(
        "dailytools-schema"
      );

    if (oldSchema) {
      oldSchema.remove();
    }

    // =========================
    // STRUCTURED DATA
    // =========================

    let schema;

    const standardPages = [
      "/",
      "/tools",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
    ];

    const isToolPage =
      !noIndex &&
      (type === "tool" || !standardPages.includes(location.pathname));

    if (isToolPage) {
      schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",

        name:
          effectiveTitle ||
          "DailyTools Online Tool",

        url: canonicalUrl,

        description: effectiveDescription,

        applicationCategory:
          "UtilitiesApplication",

        operatingSystem: "Any",

        browserRequirements:
          "Requires JavaScript and a modern web browser",

        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },

        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      };
    } else {
      schema = {
        "@context": "https://schema.org",

        "@type": "WebSite",

        name: SITE_NAME,

        url: SITE_URL,

        description:
          "Free online tools for images, PDF, calculators, finance, business, text and everyday tasks.",
      };
    }

    const schemaScript =
      document.createElement("script");

    schemaScript.type =
      "application/ld+json";

    schemaScript.id =
      "dailytools-schema";

    if (routeSeo?.faq?.length) {
      schema = {
        "@context": "https://schema.org",
        "@graph": [
          schema,
          {
            "@type": "FAQPage",
            mainEntity: routeSeo.faq.map((question, index) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  index === 0
                    ? `${effectiveTitle} is available as a free DailyTools utility. Follow the on-page steps and review the result before using or submitting it.`
                    : "The tool works in supported modern browsers. For official, financial or document requirements, verify the final result against the relevant requirements.",
              },
            })),
          },
        ],
      };
    }

    schemaScript.textContent =
      JSON.stringify(schema);

    document.head.appendChild(
      schemaScript
    );

    // =========================
    // CLEANUP
    // =========================

    return () => {
      const script =
        document.getElementById(
          "dailytools-schema"
        );

      if (script) {
        script.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    noIndex,
    image,
    type,
    location.pathname,
  ]);

  return null;
}

export default SEO;