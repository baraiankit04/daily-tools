import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dt-footer">
      <div className="container">
        <div className="dt-footer-grid">
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
              Simple, fast and free online tools for
              images, PDFs, calculations, business
              and everyday work.
            </p>

            <div className="dt-footer-note">
              <i className="bi bi-shield-check"></i>
              <span>
                Many tools process files directly
                in your browser.
              </span>
            </div>
          </div>

          <div className="dt-footer-column">
            <h3>Tools</h3>

            <Link to="/tools">All Tools</Link>
            <Link to="/image-compressor">
              Image Compressor
            </Link>
            <Link to="/pdf-compressor">
              PDF Compressor
            </Link>
            <Link to="/gst-calculator">
              GST Calculator
            </Link>
            <Link to="/emi-calculator">
              EMI Calculator
            </Link>
          </div>

          <div className="dt-footer-column">
            <h3>Company</h3>

            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

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
            Built for simple everyday work.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;