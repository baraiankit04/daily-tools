import { useState } from "react";
import SEO from "../components/SEO";

function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);

  const gst = amount ? (Number(amount) * Number(rate)) / 100 : 0;
  const total = Number(amount || 0) + gst;

  return (
    <div className="container tool-page">
      <SEO
        title="GST Calculator - Calculate Goods and Services Tax Online"
        description="Calculate GST amount and total price instantly. Free online GST calculator for India."
        keywords="gst calculator, calculate gst, gst online, india gst calculator"
      />
      <div className="tool-page-heading text-center">
        <h1>GST Calculator</h1>
        <p>Calculate GST amount and total price instantly.</p>
      </div>

      <div className="calculator-card">
        <label>Amount (₹)</label>

        <input
          type="number"
          className="form-control"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="mt-3">GST Rate</label>

        <select
          className="form-select"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        >
          <option value="0">0%</option>
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
        </select>

        {amount && (
          <div className="result-details">
            <div>
              <span>Original Amount</span>
              <strong>₹{Number(amount).toLocaleString()}</strong>
            </div>

            <div>
              <span>GST ({rate}%)</span>
              <strong>₹{gst.toLocaleString()}</strong>
            </div>

            <div className="total-result">
              <span>Total Amount</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="seo-content">
        <h2>Free GST Calculator</h2>
        <p>
          Use this GST calculator to quickly calculate GST on any amount.
          Select the applicable GST rate and the calculator will show the
          tax amount and final total.
        </p>

        <h2>Supported GST rates</h2>
        <p>
          The calculator currently supports commonly used GST rates including
          0%, 5%, 12%, 18% and 28%.
        </p>
      </div>
    </div>
  );
}

export default GSTCalculator;