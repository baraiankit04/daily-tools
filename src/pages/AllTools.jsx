import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import ToolCard from "../components/ToolCard";
import toolsData from "../data/toolsData";

const categories = [
  "All",
  "Image",
  "PDF",
  "Calculator",
  "Finance",
  "Business",
  "Daily",
  "Text",
];

function AllTools() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const filteredTools =
    useMemo(() => {
      return toolsData.filter(
        (tool) => {
          const searchText =
            search.toLowerCase();

          const matchesSearch =
            tool.name
              .toLowerCase()
              .includes(searchText) ||
            tool.description
              .toLowerCase()
              .includes(searchText);

          const matchesCategory =
            category === "All" ||
            tool.category === category;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [search, category]);

  return (
    
    <div className="all-tools-page">
        <SEO
  title="All Free Online Tools"
  description="Browse all DailyTools utilities including image tools, PDF tools, calculators, GST calculator, EMI calculator and everyday online tools."
  keywords="online tools, free tools, image tools, PDF tools, calculators"
/>

      {/* HEADER */}

      <section className="all-tools-header">
        <div className="container">

          <div className="all-tools-heading">

            <span className="section-eyebrow">
              DAILYTOOLS
            </span>

            <h1>
              All Online Tools
            </h1>

            <p>
              Find free tools for images,
              PDFs, calculations, business
              and everyday work.
            </p>

            <div className="all-tools-search">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search image compressor, GST, PDF..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* TOOLS */}

      <section className="all-tools-content">
        <div className="container">

          <div className="all-tools-toolbar">

            <div className="all-tools-categories">

              {categories.map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      category === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            <span className="tools-found-count">
              {filteredTools.length}{" "}
              {filteredTools.length === 1
                ? "tool"
                : "tools"}
            </span>

          </div>

          {filteredTools.length > 0 ? (

            <div className="row g-3">

              {filteredTools.map(
                (tool) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4"
                    key={tool.path}
                  >
                    <ToolCard
                      tool={tool}
                    />
                  </div>
                )
              )}

            </div>

          ) : (

            <div className="all-tools-empty">

              <div>
                <i className="bi bi-search"></i>
              </div>

              <h2>
                No tool found
              </h2>

              <p>
                Try another search or
                select a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Show All Tools
              </button>

            </div>

          )}

          {/* AD */}

          <div className="ad-placeholder mt-5">
            <small>
              ADVERTISEMENT
            </small>

            <span>
              Ad Space
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}

export default AllTools;