import { useEffect } from "react";

function SEO({
  title,
  description,
  keywords = "",
  noIndex = false,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | DailyTools`
      : "DailyTools - Free Online Tools";

    document.title = fullTitle;

    const updateMeta = (name, content) => {
      let tag = document.querySelector(
        `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    updateMeta(
      "description",
      description ||
        "Free online tools for images, PDF, calculations and everyday work."
    );

    if (keywords) {
      updateMeta("keywords", keywords);
    }

    updateMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow"
    );

    return () => {};
  }, [
    title,
    description,
    keywords,
    noIndex,
  ]);

  return null;
}

export default SEO;