import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";

const presets = {
  india: {
    name: "35 × 45 mm",
    width: 413,
    height: 531,
  },

  square: {
    name: "2 × 2 inch",
    width: 600,
    height: 600,
  },

  smallSquare: {
    name: "35 × 35 mm",
    width: 413,
    height: 413,
  },
};

function PassportPhotoMaker() {
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [preset, setPreset] = useState("india");

  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  const [background, setBackground] =
    useState("#ffffff");

  const [loading, setLoading] = useState(false);

  const [customWidth, setCustomWidth] =
    useState(413);

  const [customHeight, setCustomHeight] =
    useState(531);

  const getOutputSize = () => {
    if (preset === "custom") {
      return {
        width: Math.max(
          100,
          Number(customWidth) || 413
        ),

        height: Math.max(
          100,
          Number(customHeight) || 531
        ),
      };
    }

    return presets[preset];
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        setImage(img);
        setFileName(file.name);

        setZoom(1);
        setPositionX(0);
        setPositionY(0);

        setLoading(false);
      };

      img.onerror = () => {
        alert("Could not open this image.");
        setLoading(false);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const drawPhoto = () => {
    if (!image || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const { width, height } =
      getOutputSize();

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    /*
      Background is useful when the
      original image does not completely
      cover the canvas.
    */

    ctx.fillStyle = background;
    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    /*
      Cover algorithm:
      image fills the passport canvas
      without distortion.
    */

    const baseScale = Math.max(
      width / image.width,
      height / image.height
    );

    const finalScale =
      baseScale * Number(zoom);

    const drawWidth =
      image.width * finalScale;

    const drawHeight =
      image.height * finalScale;

    /*
      Position sliders work relative
      to canvas dimensions.
    */

    const offsetX =
      (Number(positionX) / 100) *
      width;

    const offsetY =
      (Number(positionY) / 100) *
      height;

    const x =
      (width - drawWidth) / 2 +
      offsetX;

    const y =
      (height - drawHeight) / 2 +
      offsetY;

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    /*
      Very light guide.
      This is preview guidance only.
    */

    ctx.save();

    ctx.strokeStyle =
      "rgba(99, 91, 255, 0.35)";

    ctx.lineWidth =
      Math.max(1, width / 400);

    ctx.setLineDash([
      width / 60,
      width / 80,
    ]);

    ctx.beginPath();

    ctx.ellipse(
      width / 2,
      height * 0.37,
      width * 0.22,
      height * 0.27,
      0,
      0,
      Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    drawPhoto();
  }, [
    image,
    preset,
    zoom,
    positionX,
    positionY,
    background,
    customWidth,
    customHeight,
  ]);

  const resetPosition = () => {
    setZoom(1);
    setPositionX(0);
    setPositionY(0);
  };

  const downloadPhoto = () => {
    if (!image || !canvasRef.current) {
      return;
    }

    /*
      We redraw without the guide so
      guide lines are never downloaded.
    */

    const canvas = canvasRef.current;

    const { width, height } =
      getOutputSize();

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    ctx.fillStyle = background;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    const baseScale = Math.max(
      width / image.width,
      height / image.height
    );

    const finalScale =
      baseScale * Number(zoom);

    const drawWidth =
      image.width * finalScale;

    const drawHeight =
      image.height * finalScale;

    const offsetX =
      (Number(positionX) / 100) *
      width;

    const offsetY =
      (Number(positionY) / 100) *
      height;

    const x =
      (width - drawWidth) / 2 +
      offsetX;

    const y =
      (height - drawHeight) / 2 +
      offsetY;

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "passport-photo.jpg";

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        /*
          Put guide back after download.
        */

        drawPhoto();
      },

      "image/jpeg",
      0.95
    );
  };

  const removePhoto = () => {
    setImage(null);
    setFileName("");

    setZoom(1);
    setPositionX(0);
    setPositionY(0);
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Passport Photo Maker Online"
  description="Create passport size photos online. Adjust photo size, position and dimensions and download your passport photo."
  keywords="passport photo maker, passport size photo, 35x45 photo, passport photo online"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          IMAGE TOOL
        </span>

        <h1>Passport Photo Maker</h1>

        <p>
          Create a passport-size photo directly
          from your phone or computer.
        </p>
      </div>

      <div className="calculator-card passport-tool-card">

        {/* STEP 1 */}

        <div className="simple-step">
          <div className="step-number">
            1
          </div>

          <div>
            <strong>
              Select your photo
            </strong>

            <span>
              Use a clear front-facing photo
            </span>
          </div>
        </div>

        {!image && (
          <label className="upload-area mt-3">
            {loading ? (
              <>
                <span className="spinner-border text-primary"></span>

                <strong className="mt-3">
                  Opening photo...
                </strong>
              </>
            ) : (
              <>
                <i className="bi bi-person-bounding-box"></i>

                <strong>
                  Choose Photo
                </strong>

                <span>
                  JPG, PNG or phone photo
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={handlePhoto}
            />
          </label>
        )}

        {image && (
          <>
            <div className="passport-selected-file">
              <i className="bi bi-image"></i>

              <span>{fileName}</span>

              <button
                type="button"
                onClick={removePhoto}
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
                  Choose photo size
                </strong>

                <span>
                  Select the size required by your form
                </span>
              </div>
            </div>

            <div className="passport-size-options">
              <button
                type="button"
                className={
                  preset === "india"
                    ? "passport-size-card active"
                    : "passport-size-card"
                }
                onClick={() =>
                  setPreset("india")
                }
              >
                <i className="bi bi-person-vcard"></i>

                <strong>
                  35 × 45 mm
                </strong>

                <span>
                  Common passport size
                </span>
              </button>

              <button
                type="button"
                className={
                  preset === "square"
                    ? "passport-size-card active"
                    : "passport-size-card"
                }
                onClick={() =>
                  setPreset("square")
                }
              >
                <i className="bi bi-square"></i>

                <strong>
                  2 × 2 inch
                </strong>

                <span>
                  Square photo
                </span>
              </button>

              <button
                type="button"
                className={
                  preset === "smallSquare"
                    ? "passport-size-card active"
                    : "passport-size-card"
                }
                onClick={() =>
                  setPreset("smallSquare")
                }
              >
                <i className="bi bi-square"></i>

                <strong>
                  35 × 35 mm
                </strong>

                <span>
                  Square format
                </span>
              </button>

              <button
                type="button"
                className={
                  preset === "custom"
                    ? "passport-size-card active"
                    : "passport-size-card"
                }
                onClick={() =>
                  setPreset("custom")
                }
              >
                <i className="bi bi-sliders"></i>

                <strong>
                  Custom
                </strong>

                <span>
                  Enter pixels
                </span>
              </button>
            </div>

            {preset === "custom" && (
              <div className="custom-passport-size">
                <div>
                  <label>
                    Width (px)
                  </label>

                  <input
                    type="number"
                    min="100"
                    className="form-control"
                    value={customWidth}
                    onChange={(e) =>
                      setCustomWidth(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>
                    Height (px)
                  </label>

                  <input
                    type="number"
                    min="100"
                    className="form-control"
                    value={customHeight}
                    onChange={(e) =>
                      setCustomHeight(
                        e.target.value
                      )
                    }
                  />
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
                  Adjust your photo
                </strong>

                <span>
                  Keep your face inside the guide
                </span>
              </div>
            </div>

            <div className="passport-editor">
              <div className="passport-preview">
                <canvas
                  ref={canvasRef}
                ></canvas>

                <div className="preview-label">
                  Preview
                </div>
              </div>

              <div className="photo-controls">
                <div className="control-row">
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
                    max="2.5"
                    step="0.01"
                    value={zoom}
                    onChange={(e) =>
                      setZoom(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                <div className="control-row">
                  <div className="control-heading">
                    <span>
                      <i className="bi bi-arrows"></i>
                      Left / Right
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={positionX}
                    onChange={(e) =>
                      setPositionX(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                <div className="control-row">
                  <div className="control-heading">
                    <span>
                      <i className="bi bi-arrows-vertical"></i>
                      Up / Down
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={positionY}
                    onChange={(e) =>
                      setPositionY(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  className="reset-photo-btn"
                  onClick={resetPosition}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                  Reset Position
                </button>
              </div>
            </div>

            <div className="passport-tip">
              <i className="bi bi-lightbulb-fill"></i>

              <span>
                Use the sliders until your face
                looks centered in the preview.
              </span>
            </div>

            {/* STEP 4 */}

            <div className="simple-step mt-4">
              <div className="step-number">
                4
              </div>

              <div>
                <strong>
                  Download photo
                </strong>

                <span>
                  The guide will not appear in your downloaded photo
                </span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn big-action-btn w-100 mt-3"
              onClick={downloadPhoto}
            >
              <i className="bi bi-download me-2"></i>
              Download Passport Photo
            </button>
          </>
        )}

        <div className="browser-processing">
          <i className="bi bi-shield-check"></i>

          <span>
            Your photo is processed on your device
          </span>
        </div>
      </div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>
          Passport Size Photo Maker Online
        </h2>

        <p>
          Create a passport-size photo from an
          existing image. Select a size, adjust
          the photo and download the result.
        </p>

        <h2>
          How to create a passport photo
        </h2>

        <p>
          Select your photo, choose the required
          dimensions, adjust the zoom and
          position, then download the finished
          image.
        </p>

        <h2>
          Does this tool remove the background?
        </h2>

        <p>
          This version crops and resizes your
          existing photo. It does not automatically
          remove or replace the background of the
          original image.
        </p>

        <h2>
          Important
        </h2>

        <p>
          Photo requirements can differ between
          passports, visas, examinations and
          government forms. Always check the
          official requirements for the document
          you are applying for.
        </p>
      </div>
    </div>
  );
}

export default PassportPhotoMaker;