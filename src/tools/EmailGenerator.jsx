import { useState } from "react";
import SEO from "../components/SEO";

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState("Professional");
  const [sender, setSender] = useState("");
  const [email, setEmail] = useState("");

  const generateEmail = () => {
    if (!purpose.trim()) {
      alert("Please enter the purpose of the email.");
      return;
    }

    const greeting = recipient.trim()
      ? `Dear ${recipient.trim()},`
      : "Dear Sir/Madam,";

    let opening = "I am writing regarding";

    if (tone === "Formal")
      opening = "I am writing to formally address";

    if (tone === "Friendly")
      opening = "I hope you are doing well. I am writing regarding";

    if (tone === "Request")
      opening = "I would like to kindly request your assistance regarding";

    const body = `${greeting}

${opening} ${purpose.trim()}.

${
  details.trim()
    ? details.trim()
    : "I would appreciate your assistance with this matter."
}

Kindly review the above and let me know if any additional information is required.

Thank you for your time and assistance.

Best regards,
${sender.trim() || "Your Name"}`;

    setEmail(body);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    alert("Email copied.");
  };

  return (
    <>
      <SEO
        title="Professional Email Generator - Write Emails Online Free"
        description="Create clear professional emails for requests, follow-ups, complaints and business communication with this free email generator."
        keywords="professional email generator, email writer, business email generator, formal email generator, write professional email"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              WRITING TOOL
            </span>

            <h1>Professional Email Generator</h1>

            <p>
              Enter a few details and create a clean
              professional email.
            </p>
          </div>

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Recipient Name
                  </label>

                  <input
                    className="form-control"
                    placeholder="Optional"
                    value={recipient}
                    onChange={(e) =>
                      setRecipient(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Tone
                  </label>

                  <select
                    className="form-select"
                    value={tone}
                    onChange={(e) =>
                      setTone(e.target.value)
                    }
                  >
                    <option>Professional</option>
                    <option>Formal</option>
                    <option>Friendly</option>
                    <option>Request</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label fw-semibold">
                  What is the email about?
                </label>

                <input
                  className="form-control"
                  placeholder="Example: delayed order delivery"
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value)
                  }
                />
              </div>

              <div className="mt-3">
                <label className="form-label fw-semibold">
                  Important Details
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Write the important information that should appear in the email..."
                  value={details}
                  onChange={(e) =>
                    setDetails(e.target.value)
                  }
                />
              </div>

              <div className="mt-3">
                <label className="form-label fw-semibold">
                  Your Name
                </label>

                <input
                  className="form-control"
                  placeholder="Optional"
                  value={sender}
                  onChange={(e) =>
                    setSender(e.target.value)
                  }
                />
              </div>

              <button
                className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                onClick={generateEmail}
              >
                <i className="bi bi-envelope me-2"></i>
                Generate Email
              </button>

              {email && (
                <div className="mt-4">
                  <label className="form-label fw-semibold">
                    Your Email
                  </label>

                  <textarea
                    className="form-control bg-light"
                    rows="14"
                    readOnly
                    value={email}
                  />

                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={copyEmail}
                  >
                    <i className="bi bi-copy me-2"></i>
                    Copy Email
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="seo-content">
            <h2>Free Professional Email Generator</h2>
            <p>
              Create professional emails for business
              communication, requests, follow-ups,
              complaints and other everyday situations.
            </p>

            <h2>How to generate a professional email?</h2>
            <p>
              Enter the email purpose, important details,
              recipient and preferred tone. The tool
              creates a structured email that you can copy
              and edit before sending.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailGenerator;