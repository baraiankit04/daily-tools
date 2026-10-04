import { useState } from "react";
import { jsPDF } from "jspdf";
import SEO from "../components/SEO";
function JpgToPdf() {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [loading, setLoading] = useState(false);

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const selected = prev.find((item) => item.id === id);

      if (selected) {
        URL.revokeObjectURL(selected.url);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });

    setImages([]);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= newImages.length
    ) {
      return;
    }

    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    setImages(newImages);
  };

  const readImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          resolve({
            data: event.target.result,
            width: img.width,
            height: img.height,
            type:
              file.type === "image/png"
                ? "PNG"
                : "JPEG",
          });
        };

        img.onerror = reject;
        img.src = event.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createPdf = async () => {
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setLoading(true);

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
        compress: true,
      });

      for (let i = 0; i < images.length; i++) {
        const image = await readImage(
          images[i].file
        );

        if (i > 0) {
          pdf.addPage(pageSize, orientation);
        }

        const pageWidth =
          pdf.internal.pageSize.getWidth();

        const pageHeight =
          pdf.internal.pageSize.getHeight();

        const margin = 10;

        const availableWidth =
          pageWidth - margin * 2;

        const availableHeight =
          pageHeight - margin * 2;

        const imageRatio =
          image.width / image.height;

        const pageRatio =
          availableWidth / availableHeight;

        let finalWidth;
        let finalHeight;

        if (imageRatio > pageRatio) {
          finalWidth = availableWidth;
          finalHeight =
            availableWidth / imageRatio;
        } else {
          finalHeight = availableHeight;
          finalWidth =
            availableHeight * imageRatio;
        }

        const x =
          (pageWidth - finalWidth) / 2;

        const y =
          (pageHeight - finalHeight) / 2;

        pdf.addImage(
          image.data,
          image.type,
          x,
          y,
          finalWidth,
          finalHeight,
          undefined,
          "MEDIUM"
        );
      }

      pdf.save("images-to-pdf.pdf");
    } catch (error) {
      console.error(error);
      alert(
        "PDF could not be created. Please try again with JPG or PNG images."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container tool-page">
      <SEO
  title="JPG to PDF Converter Online"
  description="Convert JPG, PNG and WebP images to PDF online. Combine multiple images into one PDF and download instantly."
  keywords="jpg to pdf, image to pdf, png to pdf, convert image to pdf"
/>
      <div className="tool-page-heading text-center">
        <span className="small-heading">
          PDF TOOL
        </span>

        <h1>JPG to PDF Converter</h1>

        <p>
          Convert one or multiple JPG, PNG or WEBP
          images into a PDF directly in your browser.
        </p>
      </div>

      <div className="calculator-card pdf-tool-card">
        <label className="upload-area">
          <i className="bi bi-images"></i>

          <strong>Select Images</strong>

          <span>
            Select one or multiple images
          </span>

          <input
            hidden
            multiple
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImages}
          />
        </label>

        {images.length > 0 && (
          <>
            <div className="selected-files-header">
              <div>
                <strong>
                  {images.length}{" "}
                  {images.length === 1
                    ? "Image"
                    : "Images"}
                </strong>

                <span>
                  Images will appear in this order
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
              {images.map((item, index) => (
                <div
                  className="pdf-image-item"
                  key={item.id}
                >
                  <div className="image-number">
                    {index + 1}
                  </div>

                  <img
                    src={item.url}
                    alt={`Selected ${index + 1}`}
                  />

                  <div className="pdf-image-info">
                    <strong>
                      {item.file.name}
                    </strong>

                    <span>
                      {(
                        item.file.size /
                        1024
                      ).toFixed(1)}{" "}
                      KB
                    </span>
                  </div>

                  <div className="image-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveImage(index, -1)
                      }
                      title="Move up"
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        images.length - 1
                      }
                      onClick={() =>
                        moveImage(index, 1)
                      }
                      title="Move down"
                    >
                      <i className="bi bi-arrow-down"></i>
                    </button>

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        removeImage(item.id)
                      }
                      title="Remove"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pdf-settings">
              <div>
                <label>Page Size</label>

                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) =>
                    setPageSize(e.target.value)
                  }
                >
                  <option value="a4">
                    A4
                  </option>

                  <option value="a3">
                    A3
                  </option>

                  <option value="letter">
                    Letter
                  </option>
                </select>
              </div>

              <div>
                <label>Orientation</label>

                <select
                  className="form-select"
                  value={orientation}
                  onChange={(e) =>
                    setOrientation(
                      e.target.value
                    )
                  }
                >
                  <option value="portrait">
                    Portrait
                  </option>

                  <option value="landscape">
                    Landscape
                  </option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn w-100 mt-4"
              onClick={createPdf}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-pdf me-2"></i>
                  Convert to PDF
                </>
              )}
            </button>

            <div className="browser-processing">
              <i className="bi bi-shield-check"></i>

              <span>
                Images are processed directly
                in your browser.
              </span>
            </div>
          </>
        )}
      </div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>
          Convert JPG Images to PDF Online
        </h2>

        <p>
          Select one or multiple images, arrange
          their order and convert them into a
          single PDF document. You can choose
          A4, A3 or Letter page size.
        </p>

        <h2>
          Multiple Images to One PDF
        </h2>

        <p>
          You can add multiple images and move
          them up or down before creating the
          final PDF.
        </p>

        <h2>Is this JPG to PDF tool free?</h2>

        <p>
          Yes. The converter works directly in
          your browser and does not require an
          account.
        </p>
      </div>
    </div>
  );
}

export default JpgToPdf;