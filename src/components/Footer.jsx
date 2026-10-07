import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dt-footer">
      <div className="container">
        <div className="dt-footer-grid">

          {/* BRAND */}
          <div className="dt-footer-brand">
            <Link to="/" className="dt-footer-logo">
              <div>
                <i className="bi bi-grid-fill"></i>
              </div>

              <span>
                Daily<span>Tools</span>
              </span>
            </Link>

            <p>
              Free online tools for images, PDFs,
              calculations, finance, business, text
              and everyday work.
            </p>

            <div className="dt-footer-note">
              <i className="bi bi-shield-check"></i>

              <span>
                Many file-based tools process your
                files directly in your browser.
              </span>
            </div>
          </div>

          {/* TOOLS */}
          <div className="dt-footer-column">
            <h3>Popular Tools</h3>

            <Link to="/image-compressor">
              Image Compressor
            </Link>

            <Link to="/jpg-to-pdf">
              JPG to PDF
            </Link>

            <Link to="/signature-resizer">
              Signature Resizer
            </Link>

            <Link to="/gst-calculator">
              GST Calculator
            </Link>

            <Link to="/emi-calculator">
              EMI Calculator
            </Link>

            <Link to="/tools">
              View All Tools
            </Link>
          </div>

          {/* COMPANY */}
          <div className="dt-footer-column">
            <h3>DailyTools</h3>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/tools">
              All Tools
            </Link>
          </div>

          {/* LEGAL */}
          <div className="dt-footer-column">
            <h3>Legal</h3>

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms of Use
            </Link>
          </div>
        </div>

        <div className="dt-footer-bottom">
          <span>
            © {year} DailyTools. All rights reserved.
          </span>

          <span>
            Free online tools for everyday work.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;