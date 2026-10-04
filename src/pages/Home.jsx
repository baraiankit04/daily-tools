import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import toolsData from "../data/toolsData";
import ToolCard from "../components/ToolCard";

const categories = [
  {
    name: "Image",
    label: "Image Tools",
    icon: "bi-image",
    description: "Compress, resize, crop & convert",
  },
  {
    name: "PDF",
    label: "PDF Tools",
    icon: "bi-file-earmark-pdf",
    description: "Merge, split, compress & convert",
  },
  {
    name: "Calculator",
    label: "Calculators",
    icon: "bi-calculator",
    description: "Quick everyday calculations",
  },
  {
    name: "Finance",
    label: "Finance",
    icon: "bi-bank",
    description: "EMI and financial tools",
  },
  {
    name: "Business",
    label: "Business",
    icon: "bi-briefcase",
    description: "GST, profit & shipment tools",
  },
  {
    name: "Daily",
    label: "Daily Tools",
    icon: "bi-grid",
    description: "Useful everyday utilities",
  },
];

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const popularTools = toolsData.filter(
    (tool) => tool.popular
  );

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesSearch =
        tool.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        tool.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSearch("");

    setTimeout(() => {
      document
        .getElementById("all-tools")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  return (
    <>
    <SEO
  title="Free Online Tools for Images, PDF & Calculations"
  description="Free online image, PDF, calculator and business tools. Compress images, resize photos, edit PDFs, calculate GST, EMI and more."
  keywords="free online tools, image compressor, PDF tools, GST calculator, EMI calculator, image resizer"
/>
      {/* HERO */}

      <section className="new-home-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="bi bi-stars"></i>
              Free Online Tools
            </div>

            <h1>
              Simple tools for
              <span> everyday work.</span>
            </h1>

            <p>
              Free image, PDF, calculator and
              business tools. Fast, simple and
              designed to work on any device.
            </p>

            <div className="main-tool-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search a tool..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCategory("All");
                }}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            <div className="hero-search-examples">
              <span>Try:</span>

              <button
                onClick={() =>
                  setSearch("compress")
                }
              >
                Compress Image
              </button>

              <button
                onClick={() =>
                  setSearch("PDF")
                }
              >
                PDF
              </button>

              <button
                onClick={() =>
                  setSearch("GST")
                }
              >
                GST
              </button>

              <button
                onClick={() =>
                  setSearch("signature")
                }
              >
                Signature
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}

      {search && (
        <section className="home-section search-result-section">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-eyebrow">
                  SEARCH
                </span>

                <h2>
                  Results for “{search}”
                </h2>
              </div>

              <span className="result-count">
                {filteredTools.length} tools
              </span>
            </div>

            {filteredTools.length > 0 ? (
              <div className="row g-3">
                {filteredTools.map((tool) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4"
                    key={tool.path}
                  >
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tool-found">
                <i className="bi bi-search"></i>

                <h3>No tool found</h3>

                <p>
                  Try searching for image, PDF,
                  GST, EMI or calculator.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {!search && (
        <>
          {/* POPULAR */}

          <section className="home-section">
            <div className="container">
              <div className="section-heading-row">
                <div>
                  <span className="section-eyebrow">
                    MOST USED
                  </span>

                  <h2>Popular Tools</h2>

                  <p>
                    Quick access to our most useful
                    tools.
                  </p>
                </div>

                <Link
                  to="/tools"
                  className="view-all-link"
                >
                  View all
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row g-3">
                {popularTools
                  .slice(0, 8)
                  .map((tool) => (
                    <div
                      className="col-12 col-sm-6 col-lg-3"
                      key={tool.path}
                    >
                      <ToolCard tool={tool} />
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* AD */}

          <div className="container">
            <div className="ad-placeholder">
              <small>ADVERTISEMENT</small>
              <span>Ad Space</span>
            </div>
          </div>

          {/* CATEGORIES */}

          <section className="home-section category-section">
            <div className="container">
              <div className="section-heading-row">
                <div>
                  <span className="section-eyebrow">
                    EXPLORE
                  </span>

                  <h2>Browse by Category</h2>

                  <p>
                    Find the right tool faster.
                  </p>
                </div>
              </div>

              <div className="home-category-grid">
                {categories.map((category) => {
                  const count = toolsData.filter(
                    (tool) =>
                      tool.category === category.name
                  ).length;

                  return (
                    <button
                      type="button"
                      className="home-category-card"
                      key={category.name}
                      onClick={() =>
                        selectCategory(category.name)
                      }
                    >
                      <div className="category-icon">
                        <i
                          className={`bi ${category.icon}`}
                        ></i>
                      </div>

                      <div>
                        <strong>
                          {category.label}
                        </strong>

                        <span>
                          {category.description}
                        </span>

                        <small>
                          {count}{" "}
                          {count === 1
                            ? "tool"
                            : "tools"}
                        </small>
                      </div>

                      <i className="bi bi-arrow-right category-arrow"></i>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ALL TOOLS */}

          <section
            className="home-section"
            id="all-tools"
          >
            <div className="container">
              <div className="section-heading-row">
                <div>
                  <span className="section-eyebrow">
                    TOOLBOX
                  </span>

                  <h2>
                    {selectedCategory === "All"
                      ? "All Tools"
                      : `${selectedCategory} Tools`}
                  </h2>

                  <p>
                    {filteredTools.length} free
                    tools available.
                  </p>
                </div>

                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    className="clear-category-btn"
                    onClick={() =>
                      setSelectedCategory("All")
                    }
                  >
                    Show All
                  </button>
                )}
              </div>

              <div className="quick-category-tabs">
                <button
                  type="button"
                  className={
                    selectedCategory === "All"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory("All")
                  }
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.name}
                    className={
                      selectedCategory ===
                      category.name
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category.name
                      )
                    }
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="row g-3 mt-1">
                {filteredTools.map((tool) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4"
                    key={tool.path}
                  >
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* WHY */}

          <section className="home-section">
            <div className="container">
              <div className="why-tools-box">
                <div className="why-heading">
                  <span className="section-eyebrow">
                    WHY DAILYTOOLS
                  </span>

                  <h2>
                    Tools that just work.
                  </h2>

                  <p>
                    No complicated settings. Select
                    your file or enter your values,
                    get the result and continue with
                    your work.
                  </p>
                </div>

                <div className="why-feature-grid">
                  <div>
                    <i className="bi bi-lightning-charge"></i>

                    <strong>Fast</strong>

                    <span>
                      Simple tools with fewer steps.
                    </span>
                  </div>

                  <div>
                    <i className="bi bi-phone"></i>

                    <strong>
                      Mobile Friendly
                    </strong>

                    <span>
                      Built for phones, tablets and
                      computers.
                    </span>
                  </div>

                  <div>
                    <i className="bi bi-shield-check"></i>

                    <strong>
                      Privacy Friendly
                    </strong>

                    <span>
                      Many file tools process data
                      directly in your browser.
                    </span>
                  </div>

                  <div>
                    <i className="bi bi-currency-rupee"></i>

                    <strong>Free</strong>

                    <span>
                      Everyday utilities available
                      without complicated plans.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Home;