import { useState } from "react";

function PercentageCalculator() {
  const [percent, setPercent] = useState("");
  const [number, setNumber] = useState("");

  const result =
    percent !== "" && number !== ""
      ? (Number(percent) / 100) * Number(number)
      : null;

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate any percentage of a number instantly."
    >
      <label>Percentage (%)</label>
      <input
        type="number"
        className="form-control"
        placeholder="Example: 20"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
      />

      <label className="mt-3">Number</label>
      <input
        type="number"
        className="form-control"
        placeholder="Example: 500"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      {result !== null && (
        <div className="result-box">
          <small>RESULT</small>
          <strong>{result.toLocaleString()}</strong>
        </div>
      )}
    </ToolLayout>
  );
}

function ToolLayout({ title, description, children }) {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading text-center">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="calculator-card">{children}</div>

      <div className="ad-placeholder mt-4">
        <small>ADVERTISEMENT</small>
        <span>Ad Space</span>
      </div>

      <div className="seo-content">
        <h2>How to use {title}</h2>
        <p>
          Enter the required values in the fields above. The result is
          calculated instantly in your browser. This free online tool works
          on mobile phones, tablets and desktop computers.
        </p>

        <h2>Why use this tool?</h2>
        <p>
          DailyTools is designed to make common calculations simple and
          quick. No account or software installation is required.
        </p>
      </div>
    </div>
  );
}

export default PercentageCalculator;