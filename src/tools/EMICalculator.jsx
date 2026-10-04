import { useState } from "react";
import SEO from "../components/SEO";
function EMICalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const principal = Number(amount || 0);
  const months = Number(years || 0) * 12;
  const monthlyRate =
    Number(rate || 0) / 12 / 100;

  let emi = 0;

  if (principal && months) {
    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const total = emi * months;
  const interest = total - principal;

  return (
    <div className="container tool-page">
        <SEO
  title="EMI Calculator - Calculate Loan EMI Online"
  description="Calculate monthly loan EMI, total interest and total payment using our free online EMI calculator."
  keywords="emi calculator, loan emi calculator, monthly emi, interest calculator"
/>
      <div className="tool-page-heading text-center">
        <h1>EMI Calculator</h1>
        <p>
          Calculate monthly loan EMI and interest.
        </p>
      </div>

      <div className="calculator-card">
        <label>Loan Amount</label>
        <input
          className="form-control"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹500000"
        />

        <label className="mt-3">
          Interest Rate (% per year)
        </label>

        <input
          className="form-control"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="8.5"
        />

        <label className="mt-3">
          Loan Tenure (Years)
        </label>

        <input
          className="form-control"
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="5"
        />

        {emi > 0 && (
          <div className="result-details">
            <div className="total-result">
              <span>Monthly EMI</span>
              <strong>
                ₹
                {Math.round(emi).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Total Interest</span>
              <strong>
                ₹
                {Math.round(
                  interest
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Total Payment</span>
              <strong>
                ₹
                {Math.round(total).toLocaleString()}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EMICalculator;