import { useState } from "react";
import SEO from "../components/SEO";
function ProfitMarginCalculator() {
  const [cost, setCost] = useState("");
  const [selling, setSelling] = useState("");

  const profit =
    Number(selling || 0) - Number(cost || 0);

  const margin =
    Number(selling) > 0
      ? (profit / Number(selling)) * 100
      : 0;

  const markup =
    Number(cost) > 0
      ? (profit / Number(cost)) * 100
      : 0;

  return (
    <div className="container tool-page">
        <SEO
  title="Profit Margin Calculator Online"
  description="Calculate profit, profit margin and markup from cost price and selling price."
  keywords="profit margin calculator, profit calculator, markup calculator"
/>
      <div className="tool-page-heading text-center">
        <h1>Profit Margin Calculator</h1>
        <p>
          Calculate profit, margin and markup.
        </p>
      </div>

      <div className="calculator-card">
        <label>Cost Price</label>

        <input
          className="form-control"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="₹500"
        />

        <label className="mt-3">
          Selling Price
        </label>

        <input
          className="form-control"
          type="number"
          value={selling}
          onChange={(e) =>
            setSelling(e.target.value)
          }
          placeholder="₹800"
        />

        {cost && selling && (
          <div className="result-details">
            <div>
              <span>Profit</span>
              <strong>
                ₹{profit.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Profit Margin</span>
              <strong>
                {margin.toFixed(2)}%
              </strong>
            </div>

            <div>
              <span>Markup</span>
              <strong>
                {markup.toFixed(2)}%
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfitMarginCalculator;