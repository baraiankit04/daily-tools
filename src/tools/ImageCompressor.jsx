import { useState } from "react";
import SEO from "../components/SEO";

function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [result, setResult] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);

  const [targetSize, setTargetSize] = useState(100);
  const [unit, setUnit] = useState("KB");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // ==========================================
  // SELECT IMAGE
  // ==========================================

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setFile(selected);
    setOriginalSize(selected.size);

    setResult("");
    setResultSize(0);
    setMessage("");

    const reader = new FileReader();

    reader.onload = (e) => {
      setPreview(e.target.result);
    };

    reader.readAsDataURL(selected);
  };

  // ==========================================
  // CANVAS -> BLOB
  // ==========================================

  const canvasToBlob = (canvas, quality) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    });
  };

  // ==========================================
  // COMPRESS IMAGE
  // ==========================================

  const compressImage = async () => {
    if (!file || !preview) {
      alert("Please select an image first.");
      return;
    }

    const enteredSize = Number(targetSize);

    if (!enteredSize || enteredSize <= 0) {
      alert("Please enter a valid target size.");
      return;
    }

    const targetBytes =
      unit === "MB"
        ? enteredSize * 1024 * 1024
        : enteredSize * 1024;

    setLoading(true);
    setMessage("");
    setResult("");
    setResultSize(0);

    try {
      const image = new Image();

      image.onload = async () => {
        try {
          let baseWidth = image.naturalWidth || image.width;
          let baseHeight = image.naturalHeight || image.height;

          // Prevent unnecessarily huge canvas
          const maxDimension = 3000;

          if (
            baseWidth > maxDimension ||
            baseHeight > maxDimension
          ) {
            const ratio = Math.min(
              maxDimension / baseWidth,
              maxDimension / baseHeight
            );

            baseWidth = Math.round(baseWidth * ratio);
            baseHeight = Math.round(baseHeight * ratio);
          }

          let bestBlob = null;

          /*
            We want the largest possible file that is still
            at or below the requested target.
          */
          let bestDifference = Infinity;

          /*
            Fallback keeps the smallest valid output we managed
            to create. Therefore the tool doesn't simply fail.
          */
          let fallbackBlob = null;

          let scale = 1;

          // More rounds than old version for difficult images
          for (let round = 0; round < 14; round++) {
            const currentWidth = Math.max(
              80,
              Math.round(baseWidth * scale)
            );

            const currentHeight = Math.max(
              80,
              Math.round(baseHeight * scale)
            );

            const canvas = document.createElement("canvas");

            canvas.width = currentWidth;
            canvas.height = currentHeight;

            const ctx = canvas.getContext("2d", {
              alpha: false,
            });

            if (!ctx) {
              throw new Error("Canvas is not supported.");
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // JPEG doesn't support transparency
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(
              0,
              0,
              currentWidth,
              currentHeight
            );

            ctx.drawImage(
              image,
              0,
              0,
              currentWidth,
              currentHeight
            );

            // ------------------------------------------
            // BINARY SEARCH JPEG QUALITY
            // ------------------------------------------

            let low = 0.01;
            let high = 0.98;

            for (let attempt = 0; attempt < 16; attempt++) {
              const quality = (low + high) / 2;

              const blob = await canvasToBlob(
                canvas,
                quality
              );

              if (!blob) {
                break;
              }

              // Save smallest generated output as fallback
              if (
                !fallbackBlob ||
                blob.size < fallbackBlob.size
              ) {
                fallbackBlob = blob;
              }

              if (blob.size <= targetBytes) {
                const difference =
                  targetBytes - blob.size;

                if (difference < bestDifference) {
                  bestBlob = blob;
                  bestDifference = difference;
                }

                // We can try better quality
                low = quality;
              } else {
                // Need smaller file
                high = quality;
              }
            }

            /*
              If we're already very close to target,
              there is no need to keep shrinking dimensions.
            */

            if (
              bestBlob &&
              bestBlob.size >= targetBytes * 0.95
            ) {
              break;
            }

            // Reduce dimensions for next round
            scale *= 0.82;

            if (
              currentWidth <= 80 ||
              currentHeight <= 80
            ) {
              break;
            }
          }

          // ==========================================
          // CHOOSE FINAL RESULT
          // ==========================================

          const finalBlob = bestBlob || fallbackBlob;

          if (!finalBlob) {
            setMessage(
              "Unable to compress this image. Please try another image."
            );

            setLoading(false);
            return;
          }

          const resultUrl =
            URL.createObjectURL(finalBlob);

          setResult(resultUrl);
          setResultSize(finalBlob.size);

          // ==========================================
          // RESULT MESSAGE
          // ==========================================

          if (finalBlob.size <= targetBytes) {
            const difference =
              targetBytes - finalBlob.size;

            const differencePercent =
              (difference / targetBytes) * 100;

            if (differencePercent <= 5) {
              setMessage(
                `Compressed successfully to ${formatSize(
                  finalBlob.size
                )}, very close to your ${enteredSize} ${unit} target.`
              );
            } else {
              setMessage(
                `Compressed successfully to ${formatSize(
                  finalBlob.size
                )}. The result is below your ${enteredSize} ${unit} target.`
              );
            }
          } else {
            setMessage(
              `Best possible result is ${formatSize(
                finalBlob.size
              )}. This image could not be reduced to ${enteredSize} ${unit} without making it extremely small.`
            );
          }

          setLoading(false);
        } catch (error) {
          console.error(error);

          setMessage(
            "Something went wrong while compressing the image."
          );

          setLoading(false);
        }
      };

      image.onerror = () => {
        setMessage(
          "Unable to read this image. Please try another JPG, PNG or WebP image."
        );

        setLoading(false);
      };

      image.src = preview;
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while compressing the image."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // REDUCTION %
  // ==========================================

  const reduction =
    originalSize && resultSize
      ? Math.max(
          0,
          (
            ((originalSize - resultSize) /
              originalSize) *
            100
          ).toFixed(1)
        )
      : 0;

  return (
    <div className="container tool-page">
      <SEO
        title="Image Compressor - Compress Image to KB Online"
        description="Compress JPG, PNG and WebP images online to your required KB or MB size. Free, fast and easy image compressor."
        keywords="image compressor, compress image to 20kb, compress image to 50kb, compress image to 100kb, reduce image size"
      />

      {/* =========================
          HEADING
      ========================= */}

      <div className="tool-page-heading text-center">
        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>Compress Image to Specific Size</h1>

        <p>
          Compress an image to your required KB or MB
          size directly in your browser.
        </p>
      </div>

      {/* =========================
          TOOL CARD
      ========================= */}

      <div className="calculator-card">

        {/* UPLOAD */}

        <label className="upload-area">
          <i className="bi bi-cloud-arrow-up"></i>

          <strong>
            {file ? file.name : "Select Image"}
          </strong>

          <span>
            JPG, PNG, WEBP and other supported images
          </span>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </label>

        {/* IMAGE SELECTED */}

        {preview && (
          <>
            <div className="original-file-info">
              <span>Original File Size</span>

              <strong>
                {formatSize(originalSize)}
              </strong>
            </div>

            <img
              src={preview}
              className="img-fluid preview-image"
              alt="Original preview"
            />

            {/* TARGET SIZE */}

            <div className="target-size-section">
              <label>Required File Size</label>

              <div className="target-size-input">
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={targetSize}
                  onChange={(e) =>
                    setTargetSize(e.target.value)
                  }
                />

                <select
                  className="form-select"
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value)
                  }
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>

              {/* QUICK SIZE */}

              <div className="quick-size-buttons">
                {[20, 50, 100, 200, 500].map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setTargetSize(size);
                        setUnit("KB");
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
                  }}
                >
                  1 MB
                </button>
              </div>
            </div>

            {/* COMPRESS BUTTON */}

            <button
              className="primary-btn w-100 mt-4"
              onClick={compressImage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Compressing...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  Compress Image
                </>
              )}
            </button>
          </>
        )}

        {/* MESSAGE */}

        {message && (
          <div className="compression-message">
            <i className="bi bi-info-circle"></i>
            {message}
          </div>
        )}

        {/* =========================
            RESULT
        ========================= */}

        {result && (
          <div className="compression-result">

            <div className="result-success">
              <i className="bi bi-check-circle-fill"></i>

              <div>
                <small>Compressed Size</small>

                <strong>
                  {formatSize(resultSize)}
                </strong>
              </div>
            </div>

            {/* SIZE COMPARISON */}

            <div className="size-comparison">

              <div>
                <span>Before</span>

                <strong>
                  {formatSize(originalSize)}
                </strong>
              </div>

              <i className="bi bi-arrow-right"></i>

              <div>
                <span>After</span>

                <strong>
                  {formatSize(resultSize)}
                </strong>
              </div>

              <div>
                <span>Reduced</span>

                <strong>
                  {reduction}%
                </strong>
              </div>

            </div>

            {/* RESULT PREVIEW */}

            <img
              src={result}
              alt="Compressed result"
              className="img-fluid preview-image"
            />

            {/* DOWNLOAD */}

            <a
              href={result}
              download="compressed-image.jpg"
              className="primary-btn text-decoration-none d-block text-center"
            >
              <i className="bi bi-download me-2"></i>
              Download Compressed Image
            </a>

          </div>
        )}

      </div>

      {/* =========================
          AD
      ========================= */}

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      {/* =========================
          SEO CONTENT
      ========================= */}

      <div className="seo-content">

        <h2>
          Compress Image to 20KB, 50KB, 100KB or 1MB
        </h2>

        <p>
          Select an image, enter the file size you need
          and choose KB or MB. DailyTools will reduce
          the image as close as possible to your
          requested size while keeping the image usable.
        </p>

        <h2>Are images uploaded?</h2>

        <p>
          This tool processes supported images directly
          inside your browser. Your image does not need
          to be uploaded to a DailyTools server for
          compression.
        </p>

      </div>
    </div>
  );
}

export default ImageCompressor;