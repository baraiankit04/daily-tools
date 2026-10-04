import { useState } from "react";
import SEO from "../components/SEO";
function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const saved =
    (Number(price || 0) *
      Number(discount || 0)) /
    100;

  const finalPrice =
    Number(price || 0) - saved;

  return (
    <div className="container tool-page">
        <SEO
  title="Discount Calculator Online"
  description="Calculate discount amount, savings and final price instantly using our free discount calculator."
  keywords="discount calculator, sale price calculator, calculate discount"
/>
      <div className="tool-page-heading text-center">
        <h1>Discount Calculator</h1>
        <p>
          Calculate sale price and your total savings.
        </p>
      </div>

      <div className="calculator-card">
        <label>Original Price</label>

        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="₹1000"
        />

        <label className="mt-3">
          Discount (%)
        </label>

        <input
          type="number"
          className="form-control"
          value={discount}
          onChange={(e) =>
            setDiscount(e.target.value)
          }
          placeholder="20"
        />

        {price && discount && (
          <div className="result-details">
            <div>
              <span>You Save</span>
              <strong>
                ₹{saved.toLocaleString()}
              </strong>
            </div>

            <div className="total-result">
              <span>Final Price</span>
              <strong>
                ₹{finalPrice.toLocaleString()}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscountCalculator;