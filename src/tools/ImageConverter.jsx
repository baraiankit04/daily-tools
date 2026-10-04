import { useState } from "react";
import SEO from "../components/SEO";
function ImageConverter() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);

  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError("");
    clearResult();

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        setFile(selected);
        setImage(img);
        setPreview(e.target.result);
        setLoading(false);
      };

      img.onerror = () => {
        setError("Could not open this image.");
        setLoading(false);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(selected);

    event.target.value = "";
  };

  const convertImage = () => {
    if (!image || !file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      clearResult();

      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");

      /*
        JPG does not support transparency.
        Fill transparent areas with white.
      */

      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const mimeTypes = {
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };

      const mimeType = mimeTypes[format];

      const outputQuality =
        format === "png"
          ? undefined
          : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError(
              "Could not convert this image."
            );

            setLoading(false);
            return;
          }

          const url =
            URL.createObjectURL(blob);

          setResultUrl(url);
          setResultSize(blob.size);

          setLoading(false);
        },
        mimeType,
        outputQuality
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not convert this image."
      );

      setLoading(false);
    }
  };

  const removeImage = () => {
    clearResult();

    setFile(null);
    setImage(null);
    setPreview("");
    setError("");
  };

  const extension =
    format === "jpeg"
      ? "jpg"
      : format;

  const originalName = file
    ? file.name.replace(/\.[^/.]+$/, "")
    : "converted-image";

  return (
    <div className="container tool-page">
        <SEO
  title="Image Converter - JPG PNG WebP Converter"
  description="Convert images between JPG, PNG and WebP formats online for free. Fast browser-based image converter."
  keywords="image converter, jpg to png, png to jpg, jpg to webp, webp to jpg"
/>

      <div className="tool-page-heading text-center">

        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>Image Converter</h1>

        <p>
          Convert JPG, PNG and WebP images
          quickly in your browser.
        </p>

      </div>

      <div className="calculator-card image-converter-card">

        {/* STEP 1 */}

        <div className="simple-step">

          <div className="step-number">
            1
          </div>

          <div>
            <strong>
              Select your image
            </strong>

            <span>
              JPG, PNG or WebP
            </span>
          </div>

        </div>

        {!image && (
          <label className="upload-area mt-3">

            {loading ? (
              <>
                <span className="spinner-border text-primary"></span>

                <strong className="mt-3">
                  Opening image...
                </strong>
              </>
            ) : (
              <>
                <i className="bi bi-images"></i>

                <strong>
                  Choose Image
                </strong>

                <span>
                  Tap here to select an image
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFile}
            />

          </label>
        )}

        {image && (
          <>

            <div className="converter-selected">

              <img
                src={preview}
                alt="Selected"
              />

              <div>
                <strong>
                  {file.name}
                </strong>

                <span>
                  {image.naturalWidth}
                  {" × "}
                  {image.naturalHeight}
                  {" px • "}
                  {formatSize(file.size)}
                </span>
              </div>

              <button
                type="button"
                onClick={removeImage}
              >
                Change
              </button>

            </div>

            {/* STEP 2 */}

            <div className="simple-step mt-4">

              <div className="step-number">
                2
              </div>

              <div>
                <strong>
                  Choose new format
                </strong>

                <span>
                  What format do you need?
                </span>
              </div>

            </div>

            <div className="converter-format-options">

              <button
                type="button"
                className={
                  format === "jpeg"
                    ? "converter-format active"
                    : "converter-format"
                }
                onClick={() => {
                  setFormat("jpeg");
                  clearResult();
                }}
              >
                <span className="format-icon">
                  JPG
                </span>

                <strong>
                  JPG
                </strong>

                <small>
                  Small & compatible
                </small>
              </button>

              <button
                type="button"
                className={
                  format === "png"
                    ? "converter-format active"
                    : "converter-format"
                }
                onClick={() => {
                  setFormat("png");
                  clearResult();
                }}
              >
                <span className="format-icon">
                  PNG
                </span>

                <strong>
                  PNG
                </strong>

                <small>
                  Supports transparency
                </small>
              </button>

              <button
                type="button"
                className={
                  format === "webp"
                    ? "converter-format active"
                    : "converter-format"
                }
                onClick={() => {
                  setFormat("webp");
                  clearResult();
                }}
              >
                <span className="format-icon">
                  WEBP
                </span>

                <strong>
                  WebP
                </strong>

                <small>
                  Modern & smaller
                </small>
              </button>

            </div>

            {(format === "jpeg" ||
              format === "webp") && (
              <div className="converter-quality">

                <div>
                  <span>
                    Image Quality
                  </span>

                  <strong>
                    {quality}%
                  </strong>
                </div>

                <input
                  type="range"
                  min="30"
                  max="100"
                  value={quality}
                  onChange={(e) => {
                    setQuality(
                      Number(e.target.value)
                    );

                    clearResult();
                  }}
                />

                <small>
                  Higher quality may create a
                  larger file.
                </small>

              </div>
            )}

            {/* STEP 3 */}

            <div className="simple-step mt-4">

              <div className="step-number">
                3
              </div>

              <div>
                <strong>
                  Convert & download
                </strong>

                <span>
                  Your original image stays unchanged
                </span>
              </div>

            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={convertImage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Converting...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Convert to {extension.toUpperCase()}
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

        {resultUrl && (
          <div className="converter-result">

            <div className="converter-success">

              <i className="bi bi-check-circle-fill"></i>

              <div>
                <small>
                  Conversion Complete
                </small>

                <strong>
                  {extension.toUpperCase()} image ready
                </strong>
              </div>

            </div>

            <img
              src={resultUrl}
              alt="Converted result"
            />

            <div className="converter-result-info">

              <div>
                <span>
                  Original
                </span>

                <strong>
                  {formatSize(file.size)}
                </strong>
              </div>

              <i className="bi bi-arrow-right"></i>

              <div>
                <span>
                  Converted
                </span>

                <strong>
                  {formatSize(resultSize)}
                </strong>
              </div>

            </div>

            <a
              href={resultUrl}
              download={`${originalName}.${extension}`}
              className="primary-btn big-action-btn d-block text-center text-decoration-none mt-3"
            >
              <i className="bi bi-download me-2"></i>
              Download {extension.toUpperCase()}
            </a>

          </div>
        )}

        <div className="browser-processing">

          <i className="bi bi-shield-check"></i>

          <span>
            Your image stays on your device
          </span>

        </div>

      </div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">

        <h2>
          Free Image Converter
        </h2>

        <p>
          Convert JPG, PNG and WebP images
          online without installing additional
          software.
        </p>

        <h2>
          JPG to PNG Converter
        </h2>

        <p>
          Upload a JPG image, choose PNG and
          select Convert to create a PNG image.
        </p>

        <h2>
          PNG to JPG Converter
        </h2>

        <p>
          Convert PNG images to JPG. Transparent
          areas are placed on a white background
          because JPG does not support transparency.
        </p>

        <h2>
          JPG or PNG to WebP
        </h2>

        <p>
          WebP can provide good image quality
          while often creating smaller files,
          making it useful for websites.
        </p>

      </div>

    </div>
  );
}

export default ImageConverter;