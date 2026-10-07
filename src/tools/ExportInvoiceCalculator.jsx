import { useState } from "react";
import SEO from "../components/SEO";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
  { code: "AED", symbol: "د.إ" },
  { code: "INR", symbol: "₹" },
];

function ExportInvoiceCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [freight, setFreight] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [result, setResult] = useState(null);

  const currentCurrency = currencies.find(
    (item) => item.code === currency
  );

  const num = (value) => Number(value) || 0;

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const calculateInvoice = () => {
    const qty = num(quantity);
    const unitRate = num(rate);

    if (qty <= 0 || unitRate <= 0) {
      alert("Please enter valid quantity and unit price.");
      return;
    }

    const productValue = qty * unitRate;
    const freightValue = num(freight);
    const otherValue = num(otherCharges);
    const discountValue = num(discount);

    const beforeDiscount =
      productValue + freightValue + otherValue;

    const finalValue = Math.max(
      0,
      beforeDiscount - discountValue
    );

    setResult({
      productValue,
      freight: freightValue,
      otherCharges: otherValue,
      discount: discountValue,
      finalValue,
    });
  };

  const resetCalculator = () => {
    setCurrency("USD");
    setQuantity("");
    setRate("");
    setFreight("");
    setOtherCharges("");
    setDiscount("");
    setResult(null);
  };

  return (
    <>
      <SEO
        title="Export Invoice Calculator - Calculate Export Invoice Value"
        description="Free export invoice calculator to calculate product value, freight, other charges, discount and final export invoice amount."
        keywords="export invoice calculator, commercial invoice calculator, export value calculator, freight invoice calculator, international invoice calculator"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              EXPORT BUSINESS TOOL
            </span>

            <h1>Export Invoice Calculator</h1>

            <p>
              Calculate your export invoice value including
              product amount, freight, additional charges
              and discount.
            </p>
          </div>

          <div className="export-invoice-card">

            {/* Currency */}

            <div className="export-field">
              <label>Invoice Currency</label>

              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setResult(null);
                }}
              >
                {currencies.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {item.code} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity + Rate */}

            <div className="export-two-fields">
              <div className="export-field">
                <label>Quantity</label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Example: 100"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setResult(null);
                  }}
                />
              </div>

              <div className="export-field">
                <label>Price Per Unit</label>

                <div className="export-money-input">
                  <span>{currentCurrency?.symbol}</span>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Example: 12.50"
                    value={rate}
                    onChange={(e) => {
                      setRate(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Charges */}

            <div className="export-two-fields">
              <div className="export-field">
                <label>Freight Charges</label>

                <div className="export-money-input">
                  <span>{currentCurrency?.symbol}</span>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={freight}
                    onChange={(e) => {
                      setFreight(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>
              </div>

              <div className="export-field">
                <label>Other Charges</label>

                <div className="export-money-input">
                  <span>{currentCurrency?.symbol}</span>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={otherCharges}
                    onChange={(e) => {
                      setOtherCharges(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Discount */}

            <div className="export-field">
              <label>Discount</label>

              <div className="export-money-input">
                <span>{currentCurrency?.symbol}</span>

                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e.target.value);
                    setResult(null);
                  }}
                />
              </div>

              <small>
                Leave blank if there is no discount.
              </small>
            </div>

            {/* Main button */}

            <button
              type="button"
              className="export-calculate-btn"
              onClick={calculateInvoice}
            >
              <i className="bi bi-calculator"></i>
              Calculate Invoice
            </button>

            {/* Result */}

            {result && (
              <div
                className="export-result"
                id="export-invoice-result"
              >
                <div className="export-result-title">
                  Invoice Summary
                </div>

                <div className="export-result-row">
                  <span>Product Value</span>

                  <strong>
                    {currentCurrency?.symbol}
                    {formatMoney(result.productValue)}
                  </strong>
                </div>

                <div className="export-result-row">
                  <span>Freight Charges</span>

                  <strong>
                    + {currentCurrency?.symbol}
                    {formatMoney(result.freight)}
                  </strong>
                </div>

                <div className="export-result-row">
                  <span>Other Charges</span>

                  <strong>
                    + {currentCurrency?.symbol}
                    {formatMoney(result.otherCharges)}
                  </strong>
                </div>

                <div className="export-result-row">
                  <span>Discount</span>

                  <strong>
                    - {currentCurrency?.symbol}
                    {formatMoney(result.discount)}
                  </strong>
                </div>

                <div className="export-final-value">
                  <span>Final Invoice Value</span>

                  <div>
                    <strong>
                      {currentCurrency?.symbol}
                      {formatMoney(result.finalValue)}
                    </strong>

                    <b>{currency}</b>
                  </div>
                </div>

                <button
                  type="button"
                  className="export-print-btn"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer"></i>
                  Print / Save PDF
                </button>
              </div>
            )}

            <button
              type="button"
              className="export-reset-btn"
              onClick={resetCalculator}
            >
              Reset
            </button>

          </div>

          {/* SEO CONTENT */}

          <div className="seo-content">
            <h2>Free Export Invoice Calculator</h2>

            <p>
              This export invoice calculator helps you
              calculate the total value of an international
              shipment by combining quantity, unit price,
              freight charges and other charges and then
              subtracting any discount.
            </p>

            <h2>How is export invoice value calculated?</h2>

            <p>
              First multiply the product quantity by the
              price per unit. Add freight and other
              applicable charges, then subtract any
              discount to calculate the final invoice
              value.
            </p>

            <h2>Export Invoice Formula</h2>

            <p>
              Final Invoice Value = (Quantity × Price Per
              Unit) + Freight Charges + Other Charges -
              Discount.
            </p>

            <h2>Who can use this calculator?</h2>

            <p>
              Exporters, importers, shipping teams, small
              businesses and international sellers can use
              this tool for quick commercial invoice value
              calculations.
            </p>

            <h2>Does this calculator calculate customs duty or tax?</h2>

            <p>
              No. This tool calculates the invoice value
              only. Customs duties, taxes and regulatory
              requirements can vary by country, shipment
              and transaction.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExportInvoiceCalculator;