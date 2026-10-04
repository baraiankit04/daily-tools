import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";
function SignatureResizer() {
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);

  const [targetSize, setTargetSize] = useState(50);

  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const [resultSize, setResultSize] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a signature image.");
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

  const createCanvas = () => {
    if (!image) return null;

    const finalWidth = Math.max(
      50,
      Number(width) || 300
    );

    const finalHeight = Math.max(
      20,
      Number(height) || 100
    );

    const canvas = document.createElement("canvas");

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext("2d");

    /*
      White background is normally safest
      for online forms.
    */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      finalWidth,
      finalHeight
    );

    /*
      Fit signature inside selected size
      without stretching it.
    */

    const scale = Math.min(
      finalWidth / image.width,
      finalHeight / image.height
    );

    const drawWidth =
      image.width * scale;

    const drawHeight =
      image.height * scale;

    const x =
      (finalWidth - drawWidth) / 2;

    const y =
      (finalHeight - drawHeight) / 2;

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    return canvas;
  };

  const updatePreview = () => {
    if (!image || !canvasRef.current) return;

    const sourceCanvas = createCanvas();

    if (!sourceCanvas) return;

    const previewCanvas =
      canvasRef.current;

    previewCanvas.width =
      sourceCanvas.width;

    previewCanvas.height =
      sourceCanvas.height;

    const ctx =
      previewCanvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    );

    ctx.drawImage(
      sourceCanvas,
      0,
      0
    );
  };

  useEffect(() => {
    updatePreview();
  }, [image, width, height]);

  const canvasToBlob = (
    canvas,
    quality
  ) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        "image/jpeg",
        quality
      );
    });
  };

  const resizeSignature = async () => {
    if (!image) {
      setError(
        "Please select your signature first."
      );

      return;
    }

    const targetKB =
      Number(targetSize);

    if (!targetKB || targetKB <= 0) {
      setError(
        "Please enter a valid target size."
      );

      return;
    }

    const finalWidth =
      Number(width);

    const finalHeight =
      Number(height);

    if (
      !finalWidth ||
      !finalHeight ||
      finalWidth < 50 ||
      finalHeight < 20
    ) {
      setError(
        "Please enter valid width and height."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      clearResult();

      const canvas = createCanvas();

      const targetBytes =
        targetKB * 1024;

      let low = 0.05;
      let high = 0.98;

      let bestBlob = null;

      /*
        Find the highest JPEG quality that
        stays under requested file size.
      */

      for (let i = 0; i < 14; i++) {
        const quality =
          (low + high) / 2;

        const blob =
          await canvasToBlob(
            canvas,
            quality
          );

        if (!blob) break;

        if (blob.size <= targetBytes) {
          bestBlob = blob;
          low = quality;
        } else {
          high = quality;
        }
      }

      /*
        If even low JPEG quality is larger,
        use the smallest possible result.
      */

      if (!bestBlob) {
        bestBlob =
          await canvasToBlob(
            canvas,
            0.05
          );
      }

      if (!bestBlob) {
        throw new Error(
          "Image could not be created."
        );
      }

      const url =
        URL.createObjectURL(bestBlob);

      setResultUrl(url);
      setResultSize(bestBlob.size);

      if (bestBlob.size <= targetBytes) {
        setMessage(
          `Signature ready at ${formatSize(
            bestBlob.size
          )}.`
        );
      } else {
        setMessage(
          `Best possible size is ${formatSize(
            bestBlob.size
          )}. Try increasing the target size or reducing dimensions.`
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Could not resize the signature. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    clearResult();

    setImage(null);
    setFile(null);
    setPreview("");
    setError("");
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Signature Resizer - Resize Signature in KB"
  description="Resize your signature online by width, height and file size. Compress signature to 10KB, 20KB, 50KB or custom size."
  keywords="signature resizer, resize signature, signature 20kb, signature 50kb, signature size converter"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>Signature Resizer</h1>

        <p>
          Resize your signature by width,
          height and required file size.
        </p>
      </div>

      <div className="calculator-card signature-tool-card">

        {/* STEP 1 */}

        <div className="simple-step">
          <div className="step-number">
            1
          </div>

          <div>
            <strong>
              Select signature
            </strong>

            <span>
              Choose a clear signature image
            </span>
          </div>
        </div>

        {!image && (
          <label className="upload-area mt-3">
            {loading ? (
              <>
                <span className="spinner-border text-primary"></span>

                <strong className="mt-3">
                  Opening signature...
                </strong>
              </>
            ) : (
              <>
                <i className="bi bi-pen"></i>

                <strong>
                  Choose Signature
                </strong>

                <span>
                  JPG, PNG or phone image
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={handleFile}
            />
          </label>
        )}

        {image && (
          <>
            <div className="signature-original">
              <div className="signature-original-image">
                <img
                  src={preview}
                  alt="Original signature"
                />
              </div>

              <div>
                <strong>
                  {file?.name}
                </strong>

                <span>
                  Original:{" "}
                  {formatSize(
                    file?.size || 0
                  )}
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
                  Enter required dimensions
                </strong>

                <span>
                  Check your form for width and height
                </span>
              </div>
            </div>

            <div className="signature-dimensions">
              <div>
                <label>
                  Width
                </label>

                <div className="input-with-unit">
                  <input
                    type="number"
                    className="form-control"
                    min="50"
                    value={width}
                    onChange={(e) => {
                      setWidth(
                        e.target.value
                      );

                      clearResult();
                    }}
                  />

                  <span>px</span>
                </div>
              </div>

              <div>
                <label>
                  Height
                </label>

                <div className="input-with-unit">
                  <input
                    type="number"
                    className="form-control"
                    min="20"
                    value={height}
                    onChange={(e) => {
                      setHeight(
                        e.target.value
                      );

                      clearResult();
                    }}
                  />

                  <span>px</span>
                </div>
              </div>
            </div>

            <div className="signature-presets">
              <span>Quick Size:</span>

              <button
                type="button"
                onClick={() => {
                  setWidth(300);
                  setHeight(100);
                  clearResult();
                }}
              >
                300 × 100
              </button>

              <button
                type="button"
                onClick={() => {
                  setWidth(400);
                  setHeight(150);
                  clearResult();
                }}
              >
                400 × 150
              </button>

              <button
                type="button"
                onClick={() => {
                  setWidth(200);
                  setHeight(80);
                  clearResult();
                }}
              >
                200 × 80
              </button>
            </div>

            {/* PREVIEW */}

            <div className="signature-preview-box">
              <span className="signature-preview-title">
                Preview
              </span>

              <canvas
                ref={canvasRef}
              ></canvas>

              <small>
                {width} × {height} px
              </small>
            </div>

            {/* STEP 3 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                3
              </div>

              <div>
                <strong>
                  Choose required file size
                </strong>

                <span>
                  Example: 20 KB or 50 KB
                </span>
              </div>
            </div>

            <div className="signature-target">
              <label>
                Maximum File Size
              </label>

              <div className="signature-target-input">
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

                <span>KB</span>
              </div>

              <div className="quick-size-buttons">
                {[10, 20, 50, 100].map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        setTargetSize(size);
                        clearResult();
                      }}
                    >
                      {size} KB
                    </button>
                  )
                )}
              </div>
            </div>

            {/* STEP 4 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                4
              </div>

              <div>
                <strong>
                  Resize & download
                </strong>

                <span>
                  We will keep it within your selected size when possible
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={resizeSignature}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Signature...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  Resize Signature
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
            <i className="bi bi-check-circle-fill"></i>

            <span>{message}</span>
          </div>
        )}

        {resultUrl && (
          <div className="signature-result">
            <div className="signature-ready">
              <i className="bi bi-check-circle-fill"></i>

              <div>
                <small>
                  Signature Ready
                </small>

                <strong>
                  {width} × {height} px
                  {" • "}
                  {formatSize(resultSize)}
                </strong>
              </div>
            </div>

            <img
              src={resultUrl}
              alt="Resized signature"
            />

            <a
              href={resultUrl}
              download={`signature-${width}x${height}.jpg`}
              className="primary-btn big-action-btn d-block text-center text-decoration-none"
            >
              <i className="bi bi-download me-2"></i>
              Download Signature
            </a>
          </div>
        )}

        <div className="browser-processing">
          <i className="bi bi-shield-check"></i>

          <span>
            Your signature stays on your device
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
          Resize Signature to 10KB, 20KB,
          50KB or 100KB
        </h2>

        <p>
          Upload your signature, enter the
          required width and height and choose
          the maximum file size. The tool will
          resize and compress the signature for
          you.
        </p>

        <h2>
          Signature Resizer for Online Forms
        </h2>

        <p>
          This tool can be useful when an online
          application asks for a signature with
          specific pixel dimensions and a maximum
          file size.
        </p>

        <h2>
          Does it stretch my signature?
        </h2>

        <p>
          No. The signature is fitted inside the
          selected dimensions while keeping its
          original proportions.
        </p>

        <h2>
          Important
        </h2>

        <p>
          Always check the exact signature
          dimensions and file-size requirements
          shown on the official application or
          form before uploading your image.
        </p>
      </div>
    </div>
  );
}

export default SignatureResizer;