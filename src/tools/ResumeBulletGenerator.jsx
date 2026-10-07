import { useState } from "react";
import SEO from "../components/SEO";

function ResumeBulletGenerator() {
  const [role, setRole] = useState("");
  const [work, setWork] = useState("");
  const [bullets, setBullets] = useState([]);

  const generate = () => {
    if (!role.trim() || !work.trim()) {
      alert("Please enter your role and work details.");
      return;
    }

    const tasks = work
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    const actionWords = [
      "Managed",
      "Coordinated",
      "Handled",
      "Maintained",
      "Supported",
      "Prepared",
      "Streamlined",
      "Monitored",
    ];

    const generated = tasks.map((task, index) => {
      let cleaned = task
        .replace(
          /^(managed|handled|prepared|worked on|responsible for)\s+/i,
          ""
        )
        .replace(/\.$/, "");

      cleaned =
        cleaned.charAt(0).toLowerCase() +
        cleaned.slice(1);

      return `${
        actionWords[index % actionWords.length]
      } ${cleaned} as part of the ${role.trim()} role, supporting accurate and efficient day-to-day operations.`;
    });

    setBullets(generated.slice(0, 8));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(
      bullets.map((item) => `• ${item}`).join("\n")
    );

    alert("Resume points copied.");
  };

  return (
    <>
      <SEO
        title="Resume Bullet Point Generator - Create Resume Points Free"
        description="Turn your work experience and responsibilities into professional resume bullet points with this free resume bullet generator."
        keywords="resume bullet generator, resume points generator, CV bullet points, work experience generator, resume writing tool"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              RESUME TOOL
            </span>

            <h1>Resume Bullet Generator</h1>

            <p>
              Turn your work responsibilities into clean
              resume bullet points.
            </p>
          </div>

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Job Role
                </label>

                <input
                  className="form-control"
                  placeholder="Example: Export Documentation Executive"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setBullets([]);
                  }}
                />
              </div>

              <div>
                <label className="form-label fw-semibold">
                  What work did you do?
                </label>

                <textarea
                  className="form-control"
                  rows="7"
                  placeholder={`Example:
Prepared export invoices
Managed customer orders
Handled shipment documents
Updated Excel reports`}
                  value={work}
                  onChange={(e) => {
                    setWork(e.target.value);
                    setBullets([]);
                  }}
                />

                <div className="form-text">
                  Write one responsibility per line for
                  better results.
                </div>
              </div>

              <button
                className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                onClick={generate}
              >
                <i className="bi bi-file-earmark-person me-2"></i>
                Generate Resume Points
              </button>

              {bullets.length > 0 && (
                <div className="mt-4">
                  <h5 className="fw-bold mb-3">
                    Resume Bullet Points
                  </h5>

                  <div className="list-group">
                    {bullets.map((bullet, index) => (
                      <div
                        className="list-group-item py-3"
                        key={index}
                      >
                        <div className="d-flex gap-2">
                          <i className="bi bi-check-circle-fill text-success"></i>
                          <span>{bullet}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={copyAll}
                  >
                    <i className="bi bi-copy me-2"></i>
                    Copy All Points
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="seo-content">
            <h2>Free Resume Bullet Point Generator</h2>
            <p>
              Convert job responsibilities into
              professional resume bullet points that are
              easier to read and add to your CV.
            </p>

            <h2>How to create resume bullet points?</h2>
            <p>
              Enter your job role and write your main
              responsibilities one per line. The tool will
              turn them into structured resume points that
              you can review and customize.
            </p>

            <h2>Should I add numbers to resume bullet points?</h2>
            <p>
              When accurate numbers are available, adding
              measurable results such as time saved,
              orders processed or revenue supported can
              make resume points more specific. Never add
              numbers that you cannot verify.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeBulletGenerator;