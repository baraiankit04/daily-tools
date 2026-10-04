import SEO from "../components/SEO";

function Contact() {
  return (
    <div className="simple-content-page">
      <SEO
        title="Contact DailyTools"
        description="Contact DailyTools for feedback, questions, bug reports and suggestions for new online tools."
      />

      <div className="container">
        <div className="simple-page-header">
          <span className="section-eyebrow">
            CONTACT
          </span>

          <h1>Contact Us</h1>

          <p>
            Found a problem or have an idea for a
            useful tool? We'd like to hear from you.
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
              tell us which tool you were using and
              what happened.
            </p>
          </div>

          <div className="contact-option-card">
            <div>
              <i className="bi bi-lightbulb"></i>
            </div>

            <h2>Suggest a Tool</h2>

            <p>
              Have an idea for a useful calculator,
              image, PDF or everyday utility? Send
              us your suggestion.
            </p>
          </div>

          <div className="contact-option-card">
            <div>
              <i className="bi bi-chat-dots"></i>
            </div>

            <h2>General Feedback</h2>

            <p>
              Feedback about design, usability and
              existing tools helps us improve
              DailyTools.
            </p>
          </div>
        </div>

        <div className="contact-email-box">
          <i className="bi bi-envelope"></i>

          <div>
            <span>Contact Email</span>

            <strong>
              Add your official DailyTools email here
            </strong>

            <small>
              Before launching the website, replace
              this with your final contact email.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;