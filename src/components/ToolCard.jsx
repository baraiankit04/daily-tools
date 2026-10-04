import { Link } from "react-router-dom";

function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="modern-tool-card"
    >
      <div className="modern-tool-icon">
        <i className={`bi ${tool.icon}`}></i>
      </div>

      <div className="modern-tool-content">
        <div className="tool-title-row">
          <h3>{tool.name}</h3>

          {tool.popular && (
            <span className="popular-badge">
              Popular
            </span>
          )}
        </div>

        <p>{tool.description}</p>

        <div className="tool-card-bottom">
          <span>{tool.category}</span>

          <i className="bi bi-arrow-right"></i>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;