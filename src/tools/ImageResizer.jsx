import { useState } from "react";
import SEO from "../components/SEO";

function ImageResizer() {
  const [image, setImage] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState("");

  const selectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setImage(event.target.result);
        setResult("");
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const resize = () => {
    if (!image || !width || !height) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = Number(width);
      canvas.height = Number(height);

      canvas
        .getContext("2d")
        .drawImage(img, 0, 0, width, height);

      setResult(canvas.toDataURL("image/jpeg", 0.92));
    };

    img.src = image;
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Image Resizer - Resize Image Online"
  description="Resize JPG, PNG and WebP images online by custom width and height. Fast and free image resizing tool."
  keywords="image resizer, resize image online, resize photo, change image dimensions"
/>
      <div className="tool-page-heading text-center">
        <h1>Image Resizer</h1>
        <p>Resize an image to custom width and height.</p>
      </div>

      <div className="calculator-card">
        <label className="upload-area">
          <i className="bi bi-image"></i>
          <strong>Select Image</strong>
          <span>Choose an image from your device</span>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={selectImage}
          />
        </label>

        {image && (
          <>
            <img
              src={image}
              alt="Preview"
              className="img-fluid preview-image"
            />

            <div className="row g-3">
              <div className="col-6">
                <label>Width (px)</label>
                <input
                  className="form-control"
                  type="number"
                  value={width}
                  onChange={(e) =>
                    setWidth(e.target.value)
                  }
                />
              </div>

              <div className="col-6">
                <label>Height (px)</label>
                <input
                  className="form-control"
                  type="number"
                  value={height}
                  onChange={(e) =>
                    setHeight(e.target.value)
                  }
                />
              </div>
            </div>

            <button
              className="primary-btn w-100 mt-4"
              onClick={resize}
            >
              Resize Image
            </button>
          </>
        )}

        {result && (
          <div className="mt-4">
            <img
              src={result}
              alt="Resized"
              className="img-fluid preview-image"
            />

            <a
              href={result}
              download="resized-image.jpg"
              className="primary-btn d-block text-center text-decoration-none"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageResizer;