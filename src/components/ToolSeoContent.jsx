import { useLocation } from "react-router-dom";
import toolsData from "../data/toolsData";
import seoData from "../data/seoData";

function ToolSeoContent() {
  const { pathname } = useLocation();
  const tool = toolsData.find((item) => item.path === pathname);
  const seo = seoData[pathname];

  if (!tool || !seo) return null;

  return (
    <section className="py-5 bg-white border-top">
      <div className="container" style={{ maxWidth: "900px" }}>
        <h2 className="h3 fw-bold mb-3">About {tool.name}</h2>
        <p className="text-secondary lh-lg">
          {seo.description} DailyTools keeps the process simple so you can finish the task without complicated settings or unnecessary steps.
        </p>

        <h2 className="h4 fw-bold mt-4 mb-3">How to use {tool.name}</h2>
        <p className="text-secondary lh-lg mb-4">{seo.how}</p>

        <h2 className="h4 fw-bold mb-3">Frequently Asked Questions</h2>
        <div className="accordion" id={`faq-${tool.path.replaceAll("/", "")}`}>
          {seo.faq.map((question, index) => (
            <div className="accordion-item" key={question}>
              <h3 className="accordion-header">
                <button
                  className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-answer-${tool.path.replaceAll("/", "")}-${index}`}
                >
                  {question}
                </button>
              </h3>
              <div
                id={`faq-answer-${tool.path.replaceAll("/", "")}-${index}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
              >
                <div className="accordion-body text-secondary">
                  {index === 0
                    ? `${tool.name} is designed to make this task quick and easy in a modern web browser. Follow the steps above and review the result before using or submitting it.`
                    : `Yes, you can use this free DailyTools utility on supported desktop and mobile browsers. For official, financial or document requirements, always verify the final result against the relevant requirements.`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToolSeoContent;
