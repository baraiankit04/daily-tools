import { useState } from "react";
import QRCode from "qrcode";
import SEO from "../components/SEO";

function QRCodeGenerator() {
  const [type, setType] = useState("text");
  const [value, setValue] = useState("");
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    if (!value.trim()) {
      alert("Please enter something first.");
      return;
    }

    let finalValue = value.trim();

    if (type === "whatsapp") {
      const number = finalValue.replace(/\D/g, "");
      finalValue = `https://wa.me/${number}`;
    }

    if (type === "email") {
      finalValue = `mailto:${finalValue}`;
    }

    if (
      type === "url" &&
      !/^https?:\/\//i.test(finalValue)
    ) {
      finalValue = `https://${finalValue}`;
    }

    try {
      const dataUrl = await QRCode.toDataURL(finalValue, {
        width: 700,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQr(dataUrl);
    } catch {
      alert("Unable to generate QR code.");
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = "dailytools-qr-code.png";
    link.click();
  };

  const placeholders = {
    text: "Enter text",
    url: "example.com",
    whatsapp: "919876543210",
    email: "example@email.com",
  };

  return (
    <>
      <SEO
        title="Free QR Code Generator - Create QR Code Online"
        description="Create and download QR codes for websites, text, WhatsApp numbers and email addresses for free."
        keywords="QR code generator, free QR generator, WhatsApp QR code, URL QR code, create QR code online"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              QR TOOL
            </span>

            <h1>QR Code Generator</h1>

            <p>
              Create a QR code in seconds and download it
              as an image.
            </p>
          </div>

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">
              <label className="form-label fw-semibold">
                QR Code Type
              </label>

              <div className="row g-2 mb-4">
                {[
                  ["text", "Text", "bi-fonts"],
                  ["url", "Website", "bi-link-45deg"],
                  ["whatsapp", "WhatsApp", "bi-whatsapp"],
                  ["email", "Email", "bi-envelope"],
                ].map(([key, label, icon]) => (
                  <div className="col-6 col-md-3" key={key}>
                    <button
                      type="button"
                      className={`btn w-100 ${
                        type === key
                          ? "btn-primary"
                          : "btn-light border"
                      }`}
                      onClick={() => {
                        setType(key);
                        setValue("");
                        setQr("");
                      }}
                    >
                      <i className={`bi ${icon} me-1`}></i>
                      {label}
                    </button>
                  </div>
                ))}
              </div>

              <label className="form-label fw-semibold">
                {type === "whatsapp"
                  ? "WhatsApp Number"
                  : type === "url"
                  ? "Website URL"
                  : type === "email"
                  ? "Email Address"
                  : "Text"}
              </label>

              <input
                type={
                  type === "email" ? "email" : "text"
                }
                className="form-control form-control-lg"
                placeholder={placeholders[type]}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setQr("");
                }}
              />

              {type === "whatsapp" && (
                <div className="form-text">
                  Include country code. Example:
                  919876543210
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                onClick={generateQR}
              >
                <i className="bi bi-qr-code me-2"></i>
                Generate QR Code
              </button>

              {qr && (
                <div className="text-center mt-4">
                  <div className="border rounded-4 p-3 bg-light">
                    <img
                      src={qr}
                      alt="Generated QR Code"
                      className="img-fluid"
                      style={{ maxWidth: "260px" }}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-success w-100 mt-3 py-2 fw-semibold"
                    onClick={downloadQR}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download QR Code
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="seo-content">
            <h2>Free QR Code Generator</h2>
            <p>
              Create QR codes for text, websites,
              WhatsApp numbers and email addresses. The
              generated QR code can be downloaded as an
              image.
            </p>

            <h2>How to create a QR code?</h2>
            <p>
              Select the QR type, enter your information
              and click Generate QR Code. You can then
              download the generated QR image.
            </p>

            <h2>Can I create a WhatsApp QR code?</h2>
            <p>
              Yes. Select WhatsApp and enter the phone
              number with its country code.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default QRCodeGenerator;
