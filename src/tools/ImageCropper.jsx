import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";
const ratios = {
  free: {
    label: "Free",
    ratio: null,
  },
  square: {
    label: "1 : 1",
    ratio: 1,
  },
  landscape: {
    label: "4 : 3",
    ratio: 4 / 3,
  },
  wide: {
    label: "16 : 9",
    ratio: 16 / 9,
  },
  portrait: {
    label: "3 : 4",
    ratio: 3 / 4,
  },
};

function ImageCropper() {
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const [ratioType, setRatioType] =
    useState("free");

  const [zoom, setZoom] =
    useState(1);

  const [positionX, setPositionX] =
    useState(0);

  const [positionY, setPositionY] =
    useState(0);

  const [freeWidth, setFreeWidth] =
    useState(800);

  const [freeHeight, setFreeHeight] =
    useState(600);

  const [format, setFormat] =
    useState("jpeg");

  const [quality, setQuality] =
    useState(92);

  const [resultUrl, setResultUrl] =
    useState("");

  const [resultSize, setResultSize] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes >= 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(2)} MB`;
    }

    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  };

  const clearResult = () => {
    if (resultUrl) {
      URL.revokeObjectURL(
        resultUrl
      );
    }

    setResultUrl("");
    setResultSize(0);
  };

  const handleFile = (event) => {
    const selected =
      event.target.files?.[0];

    if (!selected) return;

    if (
      !selected.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image."
      );
      return;
    }

    setLoading(true);
    setError("");
    clearResult();

    const reader =
      new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        setImage(img);
        setFile(selected);

        /*
          Default free crop keeps
          original image dimensions.
        */

        setFreeWidth(
          img.naturalWidth
        );

        setFreeHeight(
          img.naturalHeight
        );

        setZoom(1);
        setPositionX(0);
        setPositionY(0);

        setLoading(false);
      };

      img.onerror = () => {
        setError(
          "Could not open this image."
        );

        setLoading(false);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(
      selected
    );

    event.target.value = "";
  };

  const getCanvasSize = () => {
    if (!image) {
      return {
        width: 800,
        height: 600,
      };
    }

    /*
      Output limited to sensible size
      so very large phone images do not
      create huge canvas memory usage.
    */

    const maxOutput = 1600;

    if (
      ratioType === "free"
    ) {
      let width = Math.max(
        100,
        Number(freeWidth) || 800
      );

      let height = Math.max(
        100,
        Number(freeHeight) || 600
      );

      const scale = Math.min(
        1,
        maxOutput /
          Math.max(
            width,
            height
          )
      );

      return {
        width: Math.round(
          width * scale
        ),

        height: Math.round(
          height * scale
        ),
      };
    }

    const selectedRatio =
      ratios[ratioType].ratio;

    if (selectedRatio >= 1) {
      return {
        width: maxOutput,

        height: Math.round(
          maxOutput /
            selectedRatio
        ),
      };
    }

    return {
      width: Math.round(
        maxOutput *
          selectedRatio
      ),

      height: maxOutput,
    };
  };

  const drawImage = (
    canvas,
    withGuide = false
  ) => {
    if (!image || !canvas) {
      return;
    }

    const {
      width,
      height,
    } = getCanvasSize();

    canvas.width = width;
    canvas.height = height;

    const ctx =
      canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    /*
      JPG does not support transparency.
    */

    if (format === "jpeg") {
      ctx.fillStyle =
        "#ffffff";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    /*
      Cover image across crop area.
    */

    const baseScale =
      Math.max(
        width /
          image.naturalWidth,

        height /
          image.naturalHeight
      );

    const finalScale =
      baseScale *
      Number(zoom);

    const drawWidth =
      image.naturalWidth *
      finalScale;

    const drawHeight =
      image.naturalHeight *
      finalScale;

    const offsetX =
      (Number(positionX) /
        100) *
      width;

    const offsetY =
      (Number(positionY) /
        100) *
      height;

    const x =
      (width - drawWidth) /
        2 +
      offsetX;

    const y =
      (height - drawHeight) /
        2 +
      offsetY;

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    if (withGuide) {
      /*
        Rule-of-thirds guide.
        Preview only.
      */

      ctx.save();

      ctx.strokeStyle =
        "rgba(255,255,255,0.75)";

      ctx.lineWidth =
        Math.max(
          1,
          width / 800
        );

      ctx.setLineDash([
        8,
        8,
      ]);

      for (
        let i = 1;
        i <= 2;
        i++
      ) {
        const gx =
          (width / 3) * i;

        const gy =
          (height / 3) * i;

        ctx.beginPath();

        ctx.moveTo(
          gx,
          0
        );

        ctx.lineTo(
          gx,
          height
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(
          0,
          gy
        );

        ctx.lineTo(
          width,
          gy
        );

        ctx.stroke();
      }

      ctx.restore();
    }
  };

  const updatePreview = () => {
    if (
      !image ||
      !canvasRef.current
    ) {
      return;
    }

    drawImage(
      canvasRef.current,
      true
    );
  };

  useEffect(() => {
    updatePreview();
  }, [
    image,
    ratioType,
    zoom,
    positionX,
    positionY,
    freeWidth,
    freeHeight,
    format,
  ]);

  const cropImage = () => {
    if (!image) {
      setError(
        "Please select an image first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      clearResult();

      const canvas =
        document.createElement(
          "canvas"
        );

      /*
        Download version does not
        include grid lines.
      */

      drawImage(
        canvas,
        false
      );

      const mime =
        format === "png"
          ? "image/png"
          : format === "webp"
          ? "image/webp"
          : "image/jpeg";

      const outputQuality =
        format === "png"
          ? undefined
          : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError(
              "Could not crop this image."
            );

            setLoading(false);
            return;
          }

          const url =
            URL.createObjectURL(
              blob
            );

          setResultUrl(url);
          setResultSize(
            blob.size
          );

          setLoading(false);
        },

        mime,
        outputQuality
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not crop this image."
      );

      setLoading(false);
    }
  };

  const resetPosition = () => {
    setZoom(1);
    setPositionX(0);
    setPositionY(0);

    clearResult();
  };

  const removeImage = () => {
    clearResult();

    setImage(null);
    setFile(null);
    setError("");

    setZoom(1);
    setPositionX(0);
    setPositionY(0);
  };

  const extension =
    format === "jpeg"
      ? "jpg"
      : format;

  const originalName =
    file
      ? file.name.replace(
          /\.[^/.]+$/,
          ""
        )
      : "cropped-image";

  return (
    <div className="container tool-page">
        <SEO
  title="Image Cropper - Crop Image Online"
  description="Crop images online to square, portrait, landscape, 1:1, 4:3 and 16:9 sizes. Free online image cropper."
  keywords="image cropper, crop image online, square image cropper, crop photo"
/>

      <div className="tool-page-heading text-center">

        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>
          Image Cropper
        </h1>

        <p>
          Crop images to square,
          portrait, landscape or
          custom size.
        </p>

      </div>

      <div className="calculator-card cropper-tool-card">

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
              Choose the photo you want to crop
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
                <i className="bi bi-crop"></i>

                <strong>
                  Choose Image
                </strong>

                <span>
                  JPG, PNG or WebP
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              disabled={loading}
              onChange={
                handleFile
              }
            />

          </label>
        )}

        {image && (
          <>

            <div className="crop-selected-file">

              <i className="bi bi-image"></i>

              <div>
                <strong>
                  {file.name}
                </strong>

                <span>
                  {image.naturalWidth}
                  {" × "}
                  {image.naturalHeight}
                  {" px • "}
                  {formatSize(
                    file.size
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  removeImage
                }
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
                  Choose crop shape
                </strong>

                <span>
                  Select the shape you need
                </span>
              </div>

            </div>

            <div className="crop-ratios">

              {Object.entries(
                ratios
              ).map(
                ([
                  key,
                  item,
                ]) => (

                  <button
                    type="button"
                    key={key}
                    className={
                      ratioType ===
                      key
                        ? "crop-ratio-btn active"
                        : "crop-ratio-btn"
                    }
                    onClick={() => {
                      setRatioType(
                        key
                      );

                      clearResult();
                    }}
                  >

                    <i
                      className={
                        key ===
                        "portrait"
                          ? "bi bi-file-image"
                          : key ===
                            "wide"
                          ? "bi bi-display"
                          : key ===
                            "square"
                          ? "bi bi-square"
                          : "bi bi-crop"
                      }
                    ></i>

                    <strong>
                      {item.label}
                    </strong>

                  </button>

                )
              )}

            </div>

            {ratioType ===
              "free" && (

              <div className="free-crop-size">

                <div>
                  <label>
                    Width
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      min="100"
                      className="form-control"
                      value={
                        freeWidth
                      }
                      onChange={(
                        e
                      ) => {
                        setFreeWidth(
                          e.target
                            .value
                        );

                        clearResult();
                      }}
                    />

                    <span>
                      px
                    </span>

                  </div>
                </div>

                <div>
                  <label>
                    Height
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      min="100"
                      className="form-control"
                      value={
                        freeHeight
                      }
                      onChange={(
                        e
                      ) => {
                        setFreeHeight(
                          e.target
                            .value
                        );

                        clearResult();
                      }}
                    />

                    <span>
                      px
                    </span>

                  </div>
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
                  Adjust your image
                </strong>

                <span>
                  Zoom and move until it looks right
                </span>
              </div>

            </div>

            <div className="crop-preview">

              <canvas
                ref={canvasRef}
              ></canvas>

              <span>
                Crop Preview
              </span>

            </div>

            <div className="crop-controls">

              <div>

                <div className="control-heading">

                  <span>
                    <i className="bi bi-zoom-in"></i>
                    Zoom
                  </span>

                  <strong>
                    {Math.round(
                      zoom * 100
                    )}
                    %
                  </strong>

                </div>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(
                    e
                  ) => {
                    setZoom(
                      Number(
                        e.target
                          .value
                      )
                    );

                    clearResult();
                  }}
                />

              </div>

              <div>

                <div className="control-heading">

                  <span>
                    <i className="bi bi-arrows"></i>
                    Left / Right
                  </span>

                </div>

                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={
                    positionX
                  }
                  onChange={(
                    e
                  ) => {
                    setPositionX(
                      Number(
                        e.target
                          .value
                      )
                    );

                    clearResult();
                  }}
                />

              </div>

              <div>

                <div className="control-heading">

                  <span>
                    <i className="bi bi-arrows-vertical"></i>
                    Up / Down
                  </span>

                </div>

                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={
                    positionY
                  }
                  onChange={(
                    e
                  ) => {
                    setPositionY(
                      Number(
                        e.target
                          .value
                      )
                    );

                    clearResult();
                  }}
                />

              </div>

              <button
                type="button"
                className="reset-photo-btn"
                onClick={
                  resetPosition
                }
              >
                <i className="bi bi-arrow-counterclockwise"></i>

                Reset
              </button>

            </div>

            <div className="crop-output-options">

              <div>

                <label>
                  Save As
                </label>

                <select
                  className="form-select"
                  value={format}
                  onChange={(
                    e
                  ) => {
                    setFormat(
                      e.target.value
                    );

                    clearResult();
                  }}
                >
                  <option value="jpeg">
                    JPG
                  </option>

                  <option value="png">
                    PNG
                  </option>

                  <option value="webp">
                    WebP
                  </option>
                </select>

              </div>

              {format !==
                "png" && (

                <div>

                  <label>
                    Quality
                  </label>

                  <select
                    className="form-select"
                    value={
                      quality
                    }
                    onChange={(
                      e
                    ) => {
                      setQuality(
                        Number(
                          e.target
                            .value
                        )
                      );

                      clearResult();
                    }}
                  >
                    <option value="100">
                      Best
                    </option>

                    <option value="92">
                      High
                    </option>

                    <option value="80">
                      Medium
                    </option>

                    <option value="60">
                      Small File
                    </option>
                  </select>

                </div>
              )}

            </div>

            {/* STEP 4 */}

            <div className="simple-step mt-4">

              <div className="step-number">
                4
              </div>

              <div>
                <strong>
                  Crop & download
                </strong>

                <span>
                  Grid lines will not appear in the final image
                </span>
              </div>

            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={
                cropImage
              }
              disabled={
                loading
              }
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Cropping...
                </>
              ) : (
                <>
                  <i className="bi bi-crop me-2"></i>
                  Crop Image
                </>
              )}

            </button>

          </>
        )}

        {error && (
          <div className="tool-error">

            <i className="bi bi-exclamation-circle"></i>

            <span>
              {error}
            </span>

          </div>
        )}

        {resultUrl && (
          <div className="crop-result">

            <div className="crop-result-heading">

              <i className="bi bi-check-circle-fill"></i>

              <div>
                <small>
                  Image Ready
                </small>

                <strong>
                  Crop completed
                </strong>
              </div>

            </div>

            <img
              src={
                resultUrl
              }
              alt="Cropped"
            />

            <div className="crop-result-size">

              <span>
                File Size
              </span>

              <strong>
                {formatSize(
                  resultSize
                )}
              </strong>

            </div>

            <a
              href={
                resultUrl
              }
              download={`${originalName}-cropped.${extension}`}
              className="primary-btn big-action-btn d-block text-center text-decoration-none mt-3"
            >
              <i className="bi bi-download me-2"></i>

              Download Cropped Image
            </a>

          </div>
        )}

        <div className="browser-processing">

          <i className="bi bi-shield-check"></i>

          <span>
            Your image is processed on your device
          </span>

        </div>

      </div>

      <div className="ad-placeholder mt-4">
        <small>
          ADVERTISEMENT
        </small>

        <span>
          Ad Space
        </span>
      </div>

      <div className="seo-content">

        <h2>
          Crop Image Online
        </h2>

        <p>
          Crop JPG, PNG and WebP images directly
          in your browser. Choose a crop ratio,
          adjust the photo and download the
          finished image.
        </p>

        <h2>
          Square Image Cropper
        </h2>

        <p>
          Choose the 1:1 option to create square
          profile photos and social media images.
        </p>

        <h2>
          Crop Image to 16:9
        </h2>

        <p>
          The 16:9 option can be useful for
          banners, thumbnails and widescreen
          images.
        </p>

        <h2>
          Is my image uploaded?
        </h2>

        <p>
          Image processing happens in your
          browser, so supported images do not
          need to be uploaded to our server.
        </p>

      </div>

    </div>
  );
}

export default ImageCropper;