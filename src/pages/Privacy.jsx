import SEO from "../components/SEO";

function Privacy() {
  return (
    <div className="simple-content-page">
      <SEO
        title="Privacy Policy"
        description="Read the DailyTools privacy policy and learn how browser-based tools, website analytics and advertising may work."
      />

      <div className="container">
        <div className="simple-page-header">
          <span className="section-eyebrow">
            LEGAL
          </span>

          <h1>Privacy Policy</h1>

          <p>
            This policy explains how information
            may be handled when you use DailyTools.
          </p>
        </div>

        <div className="simple-page-content legal-content">
          <h2>Browser-Based Processing</h2>

          <p>
            Many DailyTools utilities process files
            directly in your browser. For tools that
            operate entirely in the browser, the
            selected files do not need to be uploaded
            to our server for processing.
          </p>

          <h2>Information We May Collect</h2>

          <p>
            Like many websites, DailyTools may
            collect limited technical information
            such as browser type, device type,
            referring pages and general website
            usage data when analytics services are
            enabled.
          </p>

          <h2>Cookies</h2>

          <p>
            DailyTools may use cookies or similar
            technologies for website functionality,
            analytics and advertising where
            applicable.
          </p>

          <h2>Advertising</h2>

          <p>
            DailyTools may display advertisements.
            Advertising providers may use cookies or
            similar technologies according to their
            own policies and applicable consent
            requirements.
          </p>

          <h2>Third-Party Services</h2>

          <p>
            The website may use third-party services
            for hosting, analytics, advertising or
            other website functionality. Those
            services may process information
            according to their own privacy policies.
          </p>

          <h2>Changes to This Policy</h2>

          <p>
            This privacy policy may be updated as
            DailyTools changes or new services are
            introduced.
          </p>

          <p className="legal-update">
            Last updated: October 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;