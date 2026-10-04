import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SEO from "../components/SEO";
function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState("custom");
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleFile = async (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (
      selected.type !== "application/pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPages("");

      const bytes = await selected.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      setFile(selected);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error(err);

      setFile(null);
      setPageCount(0);

      setError(
        "This PDF could not be opened. Password-protected or damaged PDFs may not work."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const parsePages = () => {
    if (!pages.trim()) {
      throw new Error(
        "Enter the pages you want to extract."
      );
    }

    const result = new Set();

    const parts = pages.split(",");

    for (const part of parts) {
      const value = part.trim();

      if (!value) continue;

      if (value.includes("-")) {
        const range = value.split("-");

        if (range.length !== 2) {
          throw new Error(
            "Please use a format like 1,3,5-8."
          );
        }

        const start = Number(range[0]);
        const end = Number(range[1]);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 1 ||
          end < 1 ||
          start > end ||
          end > pageCount
        ) {
          throw new Error(
            `Please enter pages between 1 and ${pageCount}.`
          );
        }

        for (let i = start; i <= end; i++) {
          result.add(i - 1);
        }
      } else {
        const page = Number(value);

        if (
          !Number.isInteger(page) ||
          page < 1 ||
          page > pageCount
        ) {
          throw new Error(
            `Please enter pages between 1 and ${pageCount}.`
          );
        }

        result.add(page - 1);
      }
    }

    if (result.size === 0) {
      throw new Error(
        "Please select at least one page."
      );
    }

    return Array.from(result).sort(
      (a, b) => a - b
    );
  };

  const downloadBlob = (
    bytes,
    filename
  ) => {
    const blob = new Blob([bytes], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const extractPages = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const selectedPages = parsePages();

      const sourceBytes =
        await file.arrayBuffer();

      const sourcePdf =
        await PDFDocument.load(sourceBytes);

      const newPdf =
        await PDFDocument.create();

      const copiedPages =
        await newPdf.copyPages(
          sourcePdf,
          selectedPages
        );

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      const output =
        await newPdf.save();

      downloadBlob(
        output,
        "selected-pages.pdf"
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not split this PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  const splitEveryPage = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const sourceBytes =
        await file.arrayBuffer();

      const sourcePdf =
        await PDFDocument.load(sourceBytes);

      /*
        Browser security means multiple automatic
        downloads may be blocked.

        So each page gets a visible download button
        instead of forcing many downloads at once.
      */

      const container =
        document.getElementById(
          "split-download-results"
        );

      container.innerHTML = "";

      for (
        let i = 0;
        i < sourcePdf.getPageCount();
        i++
      ) {
        const newPdf =
          await PDFDocument.create();

        const [copiedPage] =
          await newPdf.copyPages(
            sourcePdf,
            [i]
          );

        newPdf.addPage(copiedPage);

        const bytes =
          await newPdf.save();

        const blob = new Blob([bytes], {
          type: "application/pdf",
        });

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;
        link.download = `page-${i + 1}.pdf`;

        link.className =
          "split-page-download";

        link.innerHTML = `
          <span>
            <i class="bi bi-file-earmark-pdf"></i>
            Page ${i + 1}
          </span>

          <strong>
            <i class="bi bi-download"></i>
            Download
          </strong>
        `;

        container.appendChild(link);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Could not split this PDF. Please try another PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  const startSplit = () => {
    if (mode === "custom") {
      extractPages();
    } else {
      splitEveryPage();
    }
  };

  const removeFile = () => {
    setFile(null);
    setPageCount(0);
    setPages("");
    setError("");

    const container =
      document.getElementById(
        "split-download-results"
      );

    if (container) {
      container.innerHTML = "";
    }
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Split PDF - Extract PDF Pages Online"
  description="Split PDF files online or extract selected PDF pages. Choose specific pages and download a new PDF."
  keywords="split pdf, extract pdf pages, separate pdf pages, pdf splitter"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          PDF TOOL
        </span>

        <h1>Split PDF</h1>

        <p>
          Extract the pages you need or separate
          every PDF page.
        </p>
      </div>

      <div className="calculator-card pdf-tool-card">

        {/* STEP 1 */}

        <div className="simple-step">
          <div className="step-number">
            1
          </div>

          <div>
            <strong>
              Select your PDF
            </strong>

            <span>
              Choose the PDF you want to split
            </span>
          </div>
        </div>

        {!file && (
          <label className="upload-area mt-3">
            {loading ? (
              <>
                <span className="spinner-border text-primary"></span>

                <strong className="mt-3">
                  Reading PDF...
                </strong>
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-pdf"></i>

                <strong>
                  Choose PDF
                </strong>

                <span>
                  Tap here to select a PDF
                </span>
              </>
            )}

            <input
              type="file"
              accept="application/pdf,.pdf"
              hidden
              disabled={loading}
              onChange={handleFile}
            />
          </label>
        )}

        {file && (
          <>
            <div className="selected-single-pdf">
              <div className="pdf-file-icon">
                <i className="bi bi-file-earmark-pdf"></i>
              </div>

              <div className="selected-pdf-info">
                <strong>
                  {file.name}
                </strong>

                <span>
                  {pageCount}{" "}
                  {pageCount === 1
                    ? "Page"
                    : "Pages"}
                  {" • "}
                  {formatSize(file.size)}
                </span>
              </div>

              <button
                type="button"
                onClick={removeFile}
                aria-label="Remove PDF"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* STEP 2 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                2
              </div>

              <div>
                <strong>
                  What do you want?
                </strong>

                <span>
                  Choose one simple option
                </span>
              </div>
            </div>

            <div className="split-options">
              <button
                type="button"
                className={
                  mode === "custom"
                    ? "split-option active"
                    : "split-option"
                }
                onClick={() =>
                  setMode("custom")
                }
              >
                <i className="bi bi-file-earmark-check"></i>

                <div>
                  <strong>
                    Select Pages
                  </strong>

                  <span>
                    Example: pages 1, 3, 5-8
                  </span>
                </div>

                <i
                  className={
                    mode === "custom"
                      ? "bi bi-check-circle-fill option-check"
                      : "bi bi-circle option-check"
                  }
                ></i>
              </button>

              <button
                type="button"
                className={
                  mode === "every"
                    ? "split-option active"
                    : "split-option"
                }
                onClick={() =>
                  setMode("every")
                }
              >
                <i className="bi bi-files"></i>

                <div>
                  <strong>
                    Separate Every Page
                  </strong>

                  <span>
                    Create one PDF for each page
                  </span>
                </div>

                <i
                  className={
                    mode === "every"
                      ? "bi bi-check-circle-fill option-check"
                      : "bi bi-circle option-check"
                  }
                ></i>
              </button>
            </div>

            {mode === "custom" && (
              <div className="page-selection-box">
                <label>
                  Which pages do you need?
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: 1,3,5-8"
                  value={pages}
                  onChange={(e) =>
                    setPages(e.target.value)
                  }
                />

                <div className="page-example">
                  <i className="bi bi-lightbulb"></i>

                  <span>
                    For pages 1, 3 and 5 to 8,
                    type:
                    <strong> 1,3,5-8</strong>
                  </span>
                </div>

                <div className="quick-page-buttons">
                  <button
                    type="button"
                    onClick={() =>
                      setPages("1")
                    }
                  >
                    First Page
                  </button>

                  {pageCount > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPages(
                          `${pageCount}`
                        )
                      }
                    >
                      Last Page
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setPages(
                        `1-${pageCount}`
                      )
                    }
                  >
                    All Pages
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                3
              </div>

              <div>
                <strong>
                  Create your PDF
                </strong>

                <span>
                  Your original PDF stays unchanged
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              disabled={
                loading ||
                (mode === "custom" &&
                  !pages.trim())
              }
              onClick={startSplit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </>
              ) : mode === "custom" ? (
                <>
                  <i className="bi bi-download me-2"></i>
                  Extract Selected Pages
                </>
              ) : (
                <>
                  <i className="bi bi-scissors me-2"></i>
                  Split Every Page
                </>
              )}
            </button>
          </>
        )}

        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div
          id="split-download-results"
          className="split-download-results"
        ></div>

        <div className="browser-processing">
          <i className="bi bi-shield-check"></i>

          <span>
            Your PDF is processed in your browser
          </span>
        </div>
      </div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>Split PDF Online</h2>

        <p>
          Use this free Split PDF tool to extract
          specific pages from a PDF or separate every
          page into an individual PDF file.
        </p>

        <h2>How to split a PDF</h2>

        <p>
          Select your PDF, choose Select Pages or
          Separate Every Page, and download the
          resulting PDF files.
        </p>

        <h2>
          How do I extract specific PDF pages?
        </h2>

        <p>
          Enter page numbers such as 1,3,5-8. The
          tool will create a new PDF containing only
          those pages.
        </p>
      </div>
    </div>
  );
}

export default SplitPdf;