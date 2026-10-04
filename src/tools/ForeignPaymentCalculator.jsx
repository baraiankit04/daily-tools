import { useMemo, useState } from "react";
import SEO from "../components/SEO";

const currencies = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

function ForeignPaymentCalculator() {
  const [currency, setCurrency] = useState("GBP");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [bankRate, setBankRate] = useState("");
  const [bankCharges, setBankCharges] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [showResult, setShowResult] = useState(false);

  const selectedCurrency =
    currencies.find((item) => item.code === currency) ||
    currencies[0];

  const result = useMemo(() => {
    const invoice = Number(invoiceAmount) || 0;
    const received = Number(receivedAmount) || 0;
    const rate = Number(bankRate) || 0;
    const bankCharge = Number(bankCharges) || 0;
    const otherCharge = Number(otherCharges) || 0;

    const outstanding = invoice - received;
    const grossINR = received * rate;
    const totalCharges = bankCharge + otherCharge;
    const netINR = grossINR - totalCharges;

    let status = "";
    let statusClass = "";

    if (received === 0) {
      status = "Not Paid";
      statusClass = "danger";
    } else if (outstanding > 0) {
      status = "Partially Paid";
      statusClass = "warning";
    } else if (outstanding < 0) {
      status = "Excess Payment";
      statusClass = "info";
    } else {
      status = "Fully Paid";
      statusClass = "success";
    }

    return {
      invoice,
      received,
      rate,
      outstanding,
      grossINR,
      bankCharge,
      otherCharge,
      totalCharges,
      netINR,
      status,
      statusClass,
    };
  }, [
    invoiceAmount,
    receivedAmount,
    bankRate,
    bankCharges,
    otherCharges,
  ]);

  const formatForeign = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount || 0));
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const calculatePayment = () => {
    if (!invoiceAmount || Number(invoiceAmount) <= 0) {
      alert("Please enter invoice amount.");
      return;
    }

    if (!receivedAmount || Number(receivedAmount) < 0) {
      alert("Please enter payment received.");
      return;
    }

    if (!bankRate || Number(bankRate) <= 0) {
      alert("Please enter bank exchange rate.");
      return;
    }

    setShowResult(true);

    setTimeout(() => {
      document
        .getElementById("foreign-payment-result")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const resetCalculator = () => {
    setCurrency("GBP");
    setInvoiceAmount("");
    setReceivedAmount("");
    setBankRate("");
    setBankCharges("");
    setOtherCharges("");
    setShowResult(false);
  };

  return (
    <>
      <SEO
        title="Foreign Payment Calculator"
        description="Calculate foreign payment conversion, bank charges, net INR received and outstanding invoice amount."
        keywords="foreign payment calculator, export payment calculator, GBP to INR payment, bank exchange rate calculator"
      />

      <div className="tool-page simple-foreign-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              CURRENCY TOOL
            </span>

            <h1>Foreign Payment Calculator</h1>

            <p>
              Find out how much INR you actually receive
              after converting your foreign payment and
              deducting bank charges.
            </p>
          </div>

          <div className="calculator-card simple-foreign-card">
            {/* STEP 1 */}

            <div className="simple-foreign-step">
              <div className="simple-step-number">1</div>

              <div>
                <strong>Select Currency</strong>
                <span>
                  Choose the currency in which payment was
                  received.
                </span>
              </div>
            </div>

            <label className="form-label">
              Foreign Currency
            </label>

            <select
              className="form-select simple-foreign-input"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setShowResult(false);
              }}
            >
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.symbol} {item.code} - {item.name}
                </option>
              ))}
            </select>

            <div className="simple-foreign-divider"></div>

            {/* STEP 2 */}

            <div className="simple-foreign-step">
              <div className="simple-step-number">2</div>

              <div>
                <strong>Enter Payment Details</strong>
                <span>
                  Enter invoice amount and the payment you
                  actually received.
                </span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Invoice Amount
                </label>

                <div className="simple-money-input">
                  <span>{selectedCurrency.symbol}</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5000"
                    value={invoiceAmount}
                    onChange={(e) => {
                      setInvoiceAmount(e.target.value);
                      setShowResult(false);
                    }}
                  />
                </div>

                <small>
                  Total amount of your invoice.
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Payment Received
                </label>

                <div className="simple-money-input">
                  <span>{selectedCurrency.symbol}</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="5000"
                    value={receivedAmount}
                    onChange={(e) => {
                      setReceivedAmount(e.target.value);
                      setShowResult(false);
                    }}
                  />
                </div>

                <small>
                  Foreign amount actually received from
                  customer.
                </small>
              </div>
            </div>

            <div className="simple-foreign-divider"></div>

            {/* STEP 3 */}

            <div className="simple-foreign-step">
              <div className="simple-step-number">3</div>

              <div>
                <strong>Enter Bank Rate</strong>
                <span>
                  Enter the INR exchange rate used by your
                  bank.
                </span>
              </div>
            </div>

            <label className="form-label">
              1 {currency} = How Many INR?
            </label>

            <div className="simple-rate-input">
              <span>1 {currency}</span>

              <i className="bi bi-arrow-right"></i>

              <span>₹</span>

              <input
                type="number"
                min="0"
                step="0.0001"
                placeholder="118.20"
                value={bankRate}
                onChange={(e) => {
                  setBankRate(e.target.value);
                  setShowResult(false);
                }}
              />
            </div>

            <small className="simple-help-text">
              Example: If your bank converted £1 at ₹118.20,
              enter 118.20.
            </small>

            <div className="simple-foreign-divider"></div>

            {/* STEP 4 */}

            <div className="simple-foreign-step">
              <div className="simple-step-number">4</div>

              <div>
                <strong>Enter Charges</strong>
                <span>
                  Add any charges deducted from your INR
                  payment.
                </span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Bank Charges
                </label>

                <div className="simple-money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={bankCharges}
                    onChange={(e) => {
                      setBankCharges(e.target.value);
                      setShowResult(false);
                    }}
                  />
                </div>

                <small>
                  Leave blank if there are no bank charges.
                </small>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Other Charges
                </label>

                <div className="simple-money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={otherCharges}
                    onChange={(e) => {
                      setOtherCharges(e.target.value);
                      setShowResult(false);
                    }}
                  />
                </div>

                <small>
                  Tax or any other deduction.
                </small>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn simple-foreign-button"
              onClick={calculatePayment}
            >
              <i className="bi bi-calculator"></i>
              Calculate Payment
            </button>
          </div>

          {/* RESULT */}

          {showResult && (
            <div
              className="simple-payment-result"
              id="foreign-payment-result"
            >
              <div className="simple-result-top">
                <div>
                  <span className="section-eyebrow">
                    PAYMENT SUMMARY
                  </span>

                  <h2>Your Payment Result</h2>
                </div>

                <span
                  className={`simple-payment-status ${result.statusClass}`}
                >
                  {result.status === "Fully Paid" && (
                    <i className="bi bi-check-circle-fill"></i>
                  )}

                  {result.status === "Partially Paid" && (
                    <i className="bi bi-exclamation-circle-fill"></i>
                  )}

                  {result.status === "Excess Payment" && (
                    <i className="bi bi-info-circle-fill"></i>
                  )}

                  {result.status === "Not Paid" && (
                    <i className="bi bi-x-circle-fill"></i>
                  )}

                  {result.status}
                </span>
              </div>

              {/* FOREIGN PAYMENT */}

              <div className="simple-summary-section">
                <h3>Invoice & Payment</h3>

                <div className="simple-summary-row">
                  <span>Invoice Amount</span>

                  <strong>
                    {selectedCurrency.symbol}
                    {formatForeign(result.invoice)}{" "}
                    {currency}
                  </strong>
                </div>

                <div className="simple-summary-row">
                  <span>Payment Received</span>

                  <strong>
                    {selectedCurrency.symbol}
                    {formatForeign(result.received)}{" "}
                    {currency}
                  </strong>
                </div>

                <div className="simple-summary-row">
                  <span>
                    {result.outstanding < 0
                      ? "Extra Payment"
                      : "Outstanding"}
                  </span>

                  <strong
                    className={
                      result.outstanding > 0
                        ? "simple-red"
                        : result.outstanding < 0
                        ? "simple-blue"
                        : "simple-green"
                    }
                  >
                    {selectedCurrency.symbol}
                    {formatForeign(result.outstanding)}{" "}
                    {currency}
                  </strong>
                </div>
              </div>

              {/* CALCULATION */}

              <div className="simple-calculation-box">
                <span>Conversion</span>

                <strong>
                  {selectedCurrency.symbol}
                  {formatForeign(result.received)}
                  {" × "}
                  ₹{result.rate.toFixed(4)}
                </strong>

                <i className="bi bi-arrow-down"></i>

                <h3>{formatINR(result.grossINR)}</h3>

                <small>
                  Amount before charges
                </small>
              </div>

              {/* INR DETAILS */}

              <div className="simple-summary-section">
                <h3>INR Settlement</h3>

                <div className="simple-summary-row">
                  <span>Gross Amount</span>

                  <strong>
                    {formatINR(result.grossINR)}
                  </strong>
                </div>

                <div className="simple-summary-row">
                  <span>Bank Charges</span>

                  <strong>
                    - {formatINR(result.bankCharge)}
                  </strong>
                </div>

                <div className="simple-summary-row">
                  <span>Other Charges</span>

                  <strong>
                    - {formatINR(result.otherCharge)}
                  </strong>
                </div>

                <div className="simple-summary-row">
                  <span>Total Charges</span>

                  <strong className="simple-red">
                    - {formatINR(result.totalCharges)}
                  </strong>
                </div>
              </div>

              {/* FINAL AMOUNT */}

              <div className="simple-final-amount">
                <span>YOU RECEIVED</span>

                <strong>
                  {formatINR(result.netINR)}
                </strong>

                <small>
                  After deducting all entered charges
                </small>
              </div>

              <div className="simple-result-buttons">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer"></i>
                  Print / Save PDF
                </button>

                <button
                  type="button"
                  className="simple-new-btn"
                  onClick={resetCalculator}
                >
                  New Calculation
                </button>
              </div>

              <div className="simple-payment-note">
                <i className="bi bi-info-circle"></i>

                <span>
                  This is a calculation tool. Always verify
                  the final settlement and charges with your
                  bank statement or remittance advice.
                </span>
              </div>
            </div>
          )}

          {/* INFO */}

          <div className="seo-content">
            <h2>
              How to calculate a foreign payment?
            </h2>

            <p>
              Select the foreign currency, enter your
              invoice amount, payment received and the
              exchange rate used by your bank. If your bank
              deducted any charges, enter those amounts and
              click Calculate Payment.
            </p>

            <h2>
              What does outstanding mean?
            </h2>

            <p>
              Outstanding is the amount of the invoice that
              has not yet been received. For example, if
              your invoice is £5,000 and you receive
              £4,000, the outstanding amount is £1,000.
            </p>

            <h2>
              What is net INR received?
            </h2>

            <p>
              Net INR received is the foreign payment
              converted using your entered bank exchange
              rate, minus the bank and other charges you
              enter.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForeignPaymentCalculator;