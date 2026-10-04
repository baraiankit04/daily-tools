import SEO from "../components/SEO";

function Terms() {
  return (
    <div className="simple-content-page">
      <SEO
        title="Terms of Use"
        description="Read the terms and conditions for using DailyTools online utilities."
      />

      <div className="container">
        <div className="simple-page-header">
          <span className="section-eyebrow">
            LEGAL
          </span>

          <h1>Terms of Use</h1>

          <p>
            Please read these terms before using
            DailyTools.
          </p>
        </div>

        <div className="simple-page-content legal-content">
          <h2>Use of the Website</h2>

          <p>
            DailyTools provides online utilities for
            general informational and productivity
            purposes. You are responsible for how
            you use the tools and their results.
          </p>

          <h2>No Guarantee of Accuracy</h2>

          <p>
            We aim to make our tools useful and
            accurate, but we cannot guarantee that
            every calculation, conversion or file
            result will be suitable for every
            purpose.
          </p>

          <h2>Important Documents</h2>

          <p>
            Before submitting generated or modified
            files to a government agency, employer,
            financial institution or other
            organization, verify that the output
            meets that organization's current
            requirements.
          </p>

          <h2>Availability</h2>

          <p>
            Tools may be changed, improved,
            temporarily unavailable or discontinued
            without notice.
          </p>

          <h2>Acceptable Use</h2>

          <p>
            You may not misuse the website in a way
            that damages the service, interferes
            with other users or violates applicable
            law.
          </p>

          <h2>Changes to These Terms</h2>

          <p>
            These terms may be updated as the
            website and its services evolve.
          </p>

          <p className="legal-update">
            Last updated: October 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;