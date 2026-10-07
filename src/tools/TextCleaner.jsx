import { useState } from "react";
import SEO from "../components/SEO";

function TextCleaner() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const cleanText = () => {
    const cleaned = text
      .split("\n")
      .map((line) =>
        line.trim().replace(/\s+/g, " ")
      )
      .filter((line) => line !== "");

    const unique = [...new Set(cleaned)];

    setResult(unique.join("\n"));
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    alert("Cleaned text copied.");
  };

  return (
    <>
      <SEO
        title="Remove Duplicate Lines Online - Free Text Cleaner"
        description="Remove duplicate lines, blank lines and extra spaces from text instantly with this free online text cleaner."
        keywords="remove duplicate lines, text cleaner, remove blank lines, remove duplicate text, clean text online"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              TEXT TOOL
            </span>

            <h1>Remove Duplicate Lines</h1>

            <p>
              Clean duplicate lines, blank lines and extra
              spaces instantly.
            </p>
          </div>

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">
              <label className="form-label fw-semibold">
                Paste Your Text
              </label>

              <textarea
                className="form-control"
                rows="9"
                placeholder={`Apple\nBanana\nApple\nMango`}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setResult("");
                }}
              />

              <div className="d-flex justify-content-between mt-2 small text-secondary">
                <span>
                  Lines: {text ? text.split("\n").length : 0}
                </span>

                <span>
                  Characters: {text.length}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                onClick={cleanText}
              >
                <i className="bi bi-stars me-2"></i>
                Clean Text
              </button>

              {result && (
                <div className="mt-4">
                  <label className="form-label fw-semibold">
                    Cleaned Text
                  </label>

                  <textarea
                    className="form-control bg-light"
                    rows="9"
                    readOnly
                    value={result}
                  />

                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <button
                        className="btn btn-success w-100"
                        onClick={copyResult}
                      >
                        <i className="bi bi-copy me-2"></i>
                        Copy
                      </button>
                    </div>

                    <div className="col-6">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => {
                          setText("");
                          setResult("");
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="seo-content">
            <h2>Free Duplicate Line Remover</h2>
            <p>
              Remove repeated lines, empty lines and
              unnecessary spaces from lists and other text.
            </p>

            <h2>How does the Text Cleaner work?</h2>
            <p>
              Paste your text and click Clean Text. The
              tool removes duplicate lines, blank lines and
              extra spaces automatically.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TextCleaner;