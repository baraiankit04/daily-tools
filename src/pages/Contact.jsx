import SEO from "../components/SEO";

function Contact() {
  const contactEmail = "ankitchaurasiya583@gmail.com";

  return (
    <div className="simple-content-page">
      <SEO
        title="Contact Us"
        description="Contact DailyTools for support, feedback, bug reports and suggestions for free online tools."
      />

      <div className="container">
        <div className="simple-page-header">
          <span className="section-eyebrow">
            CONTACT
          </span>

          <h1>Contact DailyTools</h1>

          <p>
            Need help, found a problem or have an idea
            for a useful new tool? Get in touch with us.
          </p>
        </div>

        <div className="contact-options">
          <div className="contact-option-card">
            <div>
              <i className="bi bi-bug"></i>
            </div>

            <h2>Report a Problem</h2>

            <p>
              If a tool is not working correctly,
              email us with the tool name, the issue
              you experienced and your device or
              browser if relevant.
            </p>
          </div>

          <div className="contact-option-card">
            <div>
              <i className="bi bi-lightbulb"></i>
            </div>

            <h2>Suggest a Tool</h2>

            <p>
              Have an idea for a useful image, PDF,
              calculator, business or everyday tool?
              We welcome suggestions for improving
              DailyTools.
            </p>
          </div>

          <div className="contact-option-card">
            <div>
              <i className="bi bi-chat-dots"></i>
            </div>

            <h2>General Feedback</h2>

            <p>
              Share feedback about our tools, design
              or usability. Your suggestions can help
              us make DailyTools more useful.
            </p>
          </div>
        </div>

        <div className="contact-email-box">
          <i className="bi bi-envelope"></i>

          <div>
            <span>Contact Email</span>

            <strong>
              <a
                href={`mailto:${contactEmail}`}
                className="text-decoration-none"
              >
                {contactEmail}
              </a>
            </strong>

            <small>
              For support, feedback, bug reports and
              tool suggestions.
            </small>
          </div>
        </div>

        <div className="mt-5 text-center">
          <h2 className="h5 fw-bold">
            Before contacting us
          </h2>

          <p className="text-muted mx-auto mb-0">
            Please include enough information about
            your question or issue so we can understand
            it clearly. Never send passwords, payment
            details or other sensitive information by
            email.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;