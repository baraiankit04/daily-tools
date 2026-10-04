import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SEO from "../components/SEO";
function MergePdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    const newFiles = pdfFiles.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setError("");

    event.target.value = "";
  };

  const removeFile = (id) => {
    setFiles((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const moveFile = (index, direction) => {
    const updated = [...files];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updated.length) {
      return;
    }

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setFiles(updated);
  };

  const clearAll = () => {
    setFiles([]);
    setError("");
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const bytes = await item.file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "merged-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        "We could not merge these PDFs. Password-protected or damaged PDF files may not work."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Merge PDF - Combine PDF Files Online"
  description="Merge multiple PDF files into one PDF online. Arrange PDF order and combine files quickly in your browser."
  keywords="merge pdf, combine pdf, join pdf files, pdf merger"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          PDF TOOL
        </span>

        <h1>Merge PDF</h1>

        <p>
          Combine multiple PDF files into one PDF.
          Select your files, arrange them and tap Merge.
        </p>
      </div>

      <div className="calculator-card pdf-tool-card">
        {/* STEP 1 */}

        <div className="simple-step">
          <div className="step-number">1</div>

          <div>
            <strong>Select PDF files</strong>
            <span>
              Choose 2 or more PDF files
            </span>
          </div>
        </div>

        <label className="upload-area mt-3">
          <i className="bi bi-file-earmark-pdf"></i>

          <strong>
            {files.length
              ? "Add More PDFs"
              : "Choose PDF Files"}
          </strong>

          <span>
            Tap here to select files
          </span>

          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            hidden
            onChange={handleFiles}
          />
        </label>

        {files.length > 0 && (
          <>
            {/* STEP 2 */}

            <div className="simple-step mt-4">
              <div className="step-number">2</div>

              <div>
                <strong>Check the order</strong>

                <span>
                  The first PDF will appear first
                </span>
              </div>
            </div>

            <div className="selected-files-header">
              <div>
                <strong>
                  {files.length} PDF{" "}
                  {files.length === 1
                    ? "File"
                    : "Files"}
                </strong>

                <span>
                  Use arrows to change order
                </span>
              </div>

              <button
                type="button"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>

            <div className="pdf-image-list">
              {files.map((item, index) => (
                <div
                  className="pdf-file-item"
                  key={item.id}
                >
                  <div className="pdf-file-icon">
                    <i className="bi bi-file-earmark-pdf"></i>
                  </div>

                  <div className="pdf-image-info">
                    <strong>
                      {index + 1}. {item.file.name}
                    </strong>

                    <span>
                      {formatSize(item.file.size)}
                    </span>
                  </div>

                  <div className="image-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveFile(index, -1)
                      }
                      aria-label="Move PDF up"
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        files.length - 1
                      }
                      onClick={() =>
                        moveFile(index, 1)
                      }
                      aria-label="Move PDF down"
                    >
                      <i className="bi bi-arrow-down"></i>
                    </button>

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        removeFile(item.id)
                      }
                      aria-label="Remove PDF"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* STEP 3 */}

            <div className="simple-step mt-4">
              <div className="step-number">3</div>

              <div>
                <strong>Merge & download</strong>

                <span>
                  Your PDFs will be combined into one file
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={mergePDFs}
              disabled={loading || files.length < 2}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <i className="bi bi-files me-2"></i>
                  Merge {files.length} PDFs
                </>
              )}
            </button>

            {files.length === 1 && (
              <div className="simple-help">
                <i className="bi bi-info-circle"></i>

                Add one more PDF to continue.
              </div>
            )}
          </>
        )}

        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="browser-processing">
          <i className="bi bi-shield-check"></i>

          <span>
            Processing happens in your browser
          </span>
        </div>
      </div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>Merge PDF Files Online</h2>

        <p>
          Combine two or more PDF documents into a
          single PDF. Select your files, arrange their
          order and download the combined document.
        </p>

        <h2>How to merge PDF files</h2>

        <p>
          Choose at least two PDF files. Use the arrow
          buttons to arrange them in the order you want,
          then select Merge PDFs.
        </p>

        <h2>Are my PDF files uploaded?</h2>

        <p>
          This tool processes supported PDF files inside
          your browser, so files do not need to be sent
          to our server for merging.
        </p>
      </div>
    </div>
  );
}

export default MergePdf;