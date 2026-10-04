import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SEO from "../components/SEO";
function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const [targetSize, setTargetSize] = useState(500);
  const [unit, setUnit] = useState("KB");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const clearResult = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setResultUrl("");
    setResultSize(0);
    setMessage("");
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
      clearResult();

      const bytes = await selected.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      setFile(selected);
      setPageCount(pdf.getPageCount());

      // Automatically suggest a smaller target.
      const sizeKB = selected.size / 1024;

      if (sizeKB > 2048) {
        setTargetSize(1);
        setUnit("MB");
      } else if (sizeKB > 1000) {
        setTargetSize(500);
        setUnit("KB");
      } else if (sizeKB > 500) {
        setTargetSize(200);
        setUnit("KB");
      } else {
        setTargetSize(
          Math.max(50, Math.floor(sizeKB * 0.7))
        );
        setUnit("KB");
      }
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

  const compressPdf = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    const size = Number(targetSize);

    if (!size || size <= 0) {
      setError("Please enter a valid target size.");
      return;
    }

    const targetBytes =
      unit === "MB"
        ? size * 1024 * 1024
        : size * 1024;

    if (targetBytes >= file.size) {
      setError(
        `Your selected PDF is already ${formatSize(
          file.size
        )}. Please choose a target smaller than the original file.`
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      clearResult();

      const originalBytes =
        await file.arrayBuffer();

      const sourcePdf =
        await PDFDocument.load(originalBytes);

      /*
        Safe browser-side optimization.

        This can remove some unnecessary PDF structure
        and rewrite the document efficiently.

        It cannot guarantee heavy image recompression
        for every PDF.
      */

      const compressedBytes =
        await sourcePdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        });

      const finalBytes =
        compressedBytes.byteLength;

      /*
        Do not offer a "compressed" file when
        rewriting actually makes it larger.
      */

      if (finalBytes >= file.size) {
        setMessage(
          "This PDF is already well optimized. We could not safely make it smaller in your browser."
        );

        setResultSize(file.size);
        return;
      }

      const blob = new Blob(
        [compressedBytes],
        {
          type: "application/pdf",
        }
      );

      const url =
        URL.createObjectURL(blob);

      setResultUrl(url);
      setResultSize(finalBytes);

      if (finalBytes <= targetBytes) {
        setMessage(
          `Success! Your PDF is now ${formatSize(
            finalBytes
          )}, which is within your selected target.`
        );
      } else {
        setMessage(
          `We reduced the PDF to ${formatSize(
            finalBytes
          )}, but could not safely reach ${formatSize(
            targetBytes
          )} in your browser.`
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "We could not compress this PDF. Please try another PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    clearResult();

    setFile(null);
    setPageCount(0);
    setError("");
  };

  const reduction =
    file && resultSize < file.size
      ? (
          ((file.size - resultSize) /
            file.size) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="container tool-page">
        <SEO
  title="PDF Compressor - Reduce PDF Size Online"
  description="Reduce PDF file size online directly in your browser. Free and simple PDF compression tool."
  keywords="pdf compressor, compress pdf, reduce pdf size, pdf size reducer"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          PDF TOOL
        </span>

        <h1>Compress PDF</h1>

        <p>
          Reduce PDF file size quickly and
          privately in your browser.
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
              Choose the PDF you want to reduce
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
                <i className="bi bi-file-earmark-zip"></i>

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
                  Choose required size
                </strong>

                <span>
                  How small should your PDF be?
                </span>
              </div>
            </div>

            <div className="target-size-section">
              <label>
                Target File Size
              </label>

              <div className="target-size-input">
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={targetSize}
                  onChange={(e) => {
                    setTargetSize(
                      e.target.value
                    );

                    clearResult();
                  }}
                />

                <select
                  className="form-select"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    clearResult();
                  }}
                >
                  <option value="KB">
                    KB
                  </option>

                  <option value="MB">
                    MB
                  </option>
                </select>
              </div>

              <div className="quick-size-buttons">
                {[100, 200, 500].map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        setTargetSize(size);
                        setUnit("KB");
                        clearResult();
                      }}
                    >
                      {size} KB
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => {
                    setTargetSize(1);
                    setUnit("MB");
                    clearResult();
                  }}
                >
                  1 MB
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetSize(2);
                    setUnit("MB");
                    clearResult();
                  }}
                >
                  2 MB
                </button>
              </div>

              <div className="target-help">
                Original PDF:
                <strong>
                  {" "}
                  {formatSize(file.size)}
                </strong>
              </div>
            </div>

            {/* STEP 3 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                3
              </div>

              <div>
                <strong>
                  Compress & download
                </strong>

                <span>
                  We will reduce it as much as safely possible
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={compressPdf}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Compressing PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-zip me-2"></i>
                  Compress PDF
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

        {message && (
          <div
            className={
              resultUrl
                ? "compression-status success"
                : "compression-status warning"
            }
          >
            <i
              className={
                resultUrl
                  ? "bi bi-check-circle-fill"
                  : "bi bi-info-circle-fill"
              }
            ></i>

            <span>{message}</span>
          </div>
        )}

        {resultUrl && (
          <div className="pdf-compression-result">
            <div className="compression-result-title">
              <i className="bi bi-check-circle-fill"></i>

              <div>
                <small>
                  Your PDF is ready
                </small>

                <strong>
                  Compression Complete
                </strong>
              </div>
            </div>

            <div className="pdf-size-results">
              <div>
                <span>Before</span>

                <strong>
                  {formatSize(file.size)}
                </strong>
              </div>

              <div className="size-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>

              <div>
                <span>After</span>

                <strong>
                  {formatSize(resultSize)}
                </strong>
              </div>
            </div>

            <div className="reduction-badge">
              <i className="bi bi-arrow-down"></i>

              {reduction}% smaller
            </div>

            <a
              href={resultUrl}
              download="compressed-pdf.pdf"
              className="primary-btn big-action-btn d-block text-center text-decoration-none mt-3"
            >
              <i className="bi bi-download me-2"></i>
              Download PDF
            </a>
          </div>
        )}

        <div className="browser-processing">
          <i className="bi bi-shield-check"></i>

          <span>
            Your PDF stays on your device
          </span>
        </div>
      </div>

      <div className="ad-placeholder mt-4">
        <small>
          ADVERTISEMENT
        </small>

        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>
          Compress PDF to 100KB, 200KB,
          500KB or 1MB
        </h2>

        <p>
          Select your PDF and choose the file
          size you need. You can select a common
          target such as 100KB, 200KB, 500KB,
          1MB or enter a custom size.
        </p>

        <h2>
          Can every PDF be compressed to an
          exact size?
        </h2>

        <p>
          No. The amount a PDF can be reduced
          depends on its images, fonts and
          existing compression. DailyTools shows
          the actual result instead of claiming
          an incorrect file size.
        </p>

        <h2>
          Is my PDF uploaded?
        </h2>

        <p>
          Supported PDF processing happens
          directly in your browser, which helps
          keep your files private.
        </p>
      </div>
    </div>
  );
}

export default PdfCompressor;