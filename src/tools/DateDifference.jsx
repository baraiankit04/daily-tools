import { useState } from "react";
import SEO from "../components/SEO";
function DateDifference() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  let days = null;

  if (start && end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);

    days = Math.round(
      (endDate - startDate) / 86400000
    );
  }

  return (
    <div className="container tool-page">
        <SEO
  title="Date Difference Calculator"
  description="Calculate the number of days and time difference between two dates online."
  keywords="date difference calculator, days between dates, date calculator"
/>
      <div className="tool-page-heading text-center">
        <h1>Date Difference Calculator</h1>
        <p>
          Calculate the number of days between two dates.
        </p>
      </div>

      <div className="calculator-card">
        <label>Start Date</label>
        <input
          type="date"
          className="form-control"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label className="mt-3">End Date</label>
        <input
          type="date"
          className="form-control"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        {days !== null && (
          <div className="result-box">
            <small>DIFFERENCE</small>
            <strong>{Math.abs(days)} Days</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateDifference;