import { useState } from "react";
import SEO from "../components/SEO";
function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  const [targetSize, setTargetSize] = useState(100);
  const [unit, setUnit] = useState("KB");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const dataURLSize = (dataURL) => {
    const base64 = dataURL.split(",")[1];
    return Math.ceil((base64.length * 3) / 4);
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file.");
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

    let targetBytes =
      unit === "MB"
        ? enteredSize * 1024 * 1024
        : enteredSize * 1024;

    setLoading(true);
    setMessage("");

    const image = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      const maxDimension = 2200;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(
          maxDimension / width,
          maxDimension / height
        );

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      let bestResult = "";
      let bestSize = Infinity;

      let scale = 1;

      for (let round = 0; round < 7; round++) {
        const canvas = document.createElement("canvas");

        const currentWidth = Math.max(
          100,
          Math.round(width * scale)
        );

        const currentHeight = Math.max(
          100,
          Math.round(height * scale)
        );

        canvas.width = currentWidth;
        canvas.height = currentHeight;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, currentWidth, currentHeight);

        ctx.drawImage(
          image,
          0,
          0,
          currentWidth,
          currentHeight
        );

        let low = 0.05;
        let high = 0.95;

        for (let i = 0; i < 12; i++) {
          const quality = (low + high) / 2;

          const output = canvas.toDataURL(
            "image/jpeg",
            quality
          );

          const bytes = dataURLSize(output);

          if (
            bytes <= targetBytes &&
            targetBytes - bytes <
              targetBytes - bestSize
          ) {
            bestResult = output;
            bestSize = bytes;
          }

          if (bytes > targetBytes) {
            high = quality;
          } else {
            low = quality;
          }
        }

        if (bestResult) break;

        scale *= 0.82;
      }

      if (!bestResult) {
        setMessage(
          "The exact target could not be reached without making the image extremely small. Try a slightly larger target size."
        );

        setLoading(false);
        return;
      }

      setResult(bestResult);
      setResultSize(bestSize);

      const difference = Math.abs(
        targetBytes - bestSize
      );

      if (difference <= targetBytes * 0.1) {
        setMessage(
          `Compressed successfully to approximately ${formatSize(
            bestSize
          )}.`
        );
      } else {
        setMessage(
          `Best result: ${formatSize(
            bestSize
          )}. Exact file size can vary slightly depending on the image.`
        );
      }

      setLoading(false);
    };

    image.src = preview;
  };

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
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>Compress Image to Specific Size</h1>

        <p>
          Compress an image to your required KB or MB size
          directly in your browser.
        </p>
      </div>

      <div className="calculator-card">
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

        {preview && (
          <>
            <div className="original-file-info">
              <span>Original File Size</span>
              <strong>{formatSize(originalSize)}</strong>
            </div>

            <img
              src={preview}
              className="img-fluid preview-image"
              alt="Original preview"
            />

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

        {message && (
          <div className="compression-message">
            <i className="bi bi-info-circle"></i>
            {message}
          </div>
        )}

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
                <strong>{reduction}%</strong>
              </div>
            </div>

            <img
              src={result}
              alt="Compressed result"
              className="img-fluid preview-image"
            />

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

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>Compress Image to 20KB, 50KB, 100KB or 1MB</h2>

        <p>
          Select an image, enter the file size you need and
          choose KB or MB. DailyTools will try to reduce the
          image as close as possible to your requested size.
        </p>

        <h2>Are images uploaded?</h2>

        <p>
          This tool processes supported images directly inside
          your browser. This also makes compression faster and
          avoids unnecessary server uploads.
        </p>
      </div>
    </div>
  );
}

export default ImageCompressor;