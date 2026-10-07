import { Link, useLocation } from "react-router-dom";
import toolsData from "../data/toolsData";

function RelatedTools() {
  const { pathname } = useLocation();

  const currentTool = toolsData.find((tool) => tool.path === pathname);

  // Do not render on Home, normal pages or unknown/404 routes.
  if (!currentTool) return null;

  const sameCategory = toolsData.filter(
    (tool) =>
      tool.path !== currentTool.path &&
      tool.category === currentTool.category
  );

  // If a category has fewer than 4 other tools, fill the remaining
  // positions with popular tools from other categories.
  const fallbackPopular = toolsData.filter(
    (tool) =>
      tool.path !== currentTool.path &&
      tool.category !== currentTool.category &&
      tool.popular
  );

  const relatedTools = [...sameCategory, ...fallbackPopular]
    .filter(
      (tool, index, array) =>
        array.findIndex((item) => item.path === tool.path) === index
    )
    .slice(0, 4);

  if (relatedTools.length === 0) return null;

  return (
    <section className="py-5 border-top bg-light">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 mb-4">
          <div>
            <span className="text-primary fw-bold small text-uppercase">
              Explore More
            </span>
            <h2 className="h3 fw-bold mb-1">Related Tools</h2>
            <p className="text-secondary mb-0">
              More free tools that may help with your next task.
            </p>
          </div>

          <Link to="/tools" className="btn btn-outline-primary btn-sm align-self-start">
            View All Tools
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        <div className="row g-3">
          {relatedTools.map((tool) => (
            <div className="col-12 col-sm-6 col-lg-3" key={tool.path}>
              <Link
                to={tool.path}
                className="card h-100 border-0 shadow-sm text-decoration-none"
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3 text-primary lh-1">
                      <i className={`bi ${tool.icon}`}></i>
                    </div>

                    <div className="flex-grow-1">
                      <h3 className="h6 fw-bold text-dark mb-2">
                        {tool.name}
                      </h3>
                      <p className="small text-secondary mb-0">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedTools;
