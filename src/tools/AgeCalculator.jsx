import { useState } from "react";
import SEO from "../components/SEO";
function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    if (!dob) return;

    const birth = new Date(dob);
    const today = new Date();

    if (birth > today) {
      setAge(null);
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const previousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="container tool-page">
        <SEO
  title="Age Calculator - Calculate Exact Age"
  description="Calculate your exact age in years, months and days from your date of birth."
  keywords="age calculator, calculate age, date of birth calculator"
/>
      <div className="tool-page-heading text-center">
        <h1>Age Calculator</h1>
        <p>Find your age in years, months and days.</p>
      </div>

      <div className="calculator-card">
        <label>Date of Birth</label>

        <input
          type="date"
          className="form-control"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <button
          className="primary-btn w-100 mt-4"
          onClick={calculateAge}
        >
          Calculate Age
        </button>

        {age && (
          <div className="age-results">
            <div>
              <strong>{age.years}</strong>
              <span>Years</span>
            </div>

            <div>
              <strong>{age.months}</strong>
              <span>Months</span>
            </div>

            <div>
              <strong>{age.days}</strong>
              <span>Days</span>
            </div>
          </div>
        )}
      </div>

      <div className="seo-content">
        <h2>Online Age Calculator</h2>
        <p>
          Enter your date of birth to calculate your approximate current age
          in years, months and days.
        </p>
      </div>
    </div>
  );
}

export default AgeCalculator;