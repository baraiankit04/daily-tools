import { useState } from "react";
import SEO from "../components/SEO";

function SIPCalculator() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  const calculateSIP = () => {
    const p = Number(monthly);
    const annualRate = Number(rate);
    const time = Number(years);

    if (p <= 0 || annualRate <= 0 || time <= 0) {
      alert("Please enter valid values.");
      return;
    }

    const months = time * 12;
    const monthlyRate = annualRate / 12 / 100;

    const futureValue =
      p *
      (((Math.pow(1 + monthlyRate, months) - 1) /
        monthlyRate) *
        (1 + monthlyRate));

    const invested = p * months;
    const returns = futureValue - invested;

    setResult({
      invested,
      returns,
      total: futureValue,
    });
  };

  const reset = () => {
    setMonthly("");
    setRate("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <SEO
        title="SIP Calculator - Calculate SIP Returns Online"
        description="Free SIP calculator to estimate mutual fund SIP returns, total investment and wealth gained from monthly investments."
        keywords="SIP calculator, mutual fund SIP calculator, SIP return calculator, monthly SIP calculator, investment calculator"
      />

      <div className="tool-page">
        <div className="container">

          {/* HEADING */}

          <div className="tool-page-heading">
            <span className="section-eyebrow">
              INVESTMENT CALCULATOR
            </span>

            <h1>SIP Calculator</h1>

            <p>
              Calculate how your monthly SIP investment
              could grow over time.
            </p>
          </div>

          {/* CARD */}

          <div
            className="card border-0 shadow-sm mx-auto rounded-4"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">

              {/* MONTHLY INVESTMENT */}

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Monthly Investment
                </label>

                <div className="input-group input-group-lg">
                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Example: 5000"
                    min="0"
                    value={monthly}
                    onChange={(e) => {
                      setMonthly(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>

                <div className="form-text">
                  Amount you plan to invest every month.
                </div>
              </div>

              {/* RETURN + YEARS */}

              <div className="row g-3 mb-4">

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Expected Return
                  </label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Example: 12"
                      min="0"
                      step="0.1"
                      value={rate}
                      onChange={(e) => {
                        setRate(e.target.value);
                        setResult(null);
                      }}
                    />

                    <span className="input-group-text">
                      % / year
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Investment Period
                  </label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Example: 10"
                      min="1"
                      value={years}
                      onChange={(e) => {
                        setYears(e.target.value);
                        setResult(null);
                      }}
                    />

                    <span className="input-group-text">
                      Years
                    </span>
                  </div>
                </div>

              </div>

              {/* QUICK VALUES */}

              <div className="mb-4">
                <small className="d-block text-secondary mb-2 fw-semibold">
                  Quick monthly amount
                </small>

                <div className="d-flex flex-wrap gap-2">
                  {[1000, 2000, 5000, 10000, 25000].map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        className="btn btn-light btn-sm border rounded-pill px-3"
                        onClick={() => {
                          setMonthly(String(value));
                          setResult(null);
                        }}
                      >
                        ₹{formatMoney(value)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* BUTTON */}

              <button
                type="button"
                className="btn btn-primary w-100 py-3 fw-semibold rounded-3"
                onClick={calculateSIP}
              >
                <i className="bi bi-calculator me-2"></i>
                Calculate SIP
              </button>

              {/* RESULT */}

              {result && (
                <div className="mt-4">

                  <div className="bg-light rounded-4 p-3 p-md-4">

                    <p className="text-secondary small mb-1">
                      Estimated Future Value
                    </p>

                    <h2 className="fw-bold mb-4 text-primary">
                      ₹{formatMoney(result.total)}
                    </h2>

                    <div className="row g-3">

                      <div className="col-6">
                        <div className="bg-white border rounded-3 p-3 h-100">
                          <small className="text-secondary d-block mb-1">
                            Total Invested
                          </small>

                          <strong>
                            ₹{formatMoney(result.invested)}
                          </strong>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="bg-white border rounded-3 p-3 h-100">
                          <small className="text-secondary d-block mb-1">
                            Estimated Returns
                          </small>

                          <strong>
                            ₹{formatMoney(result.returns)}
                          </strong>
                        </div>
                      </div>

                    </div>

                    <hr />

                    <div className="d-flex justify-content-between small">
                      <span className="text-secondary">
                        Investment
                      </span>

                      <strong>
                        ₹{formatMoney(Number(monthly))}/month
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between small mt-2">
                      <span className="text-secondary">
                        Expected Return
                      </span>

                      <strong>{rate}% p.a.</strong>
                    </div>

                    <div className="d-flex justify-content-between small mt-2">
                      <span className="text-secondary">
                        Period
                      </span>

                      <strong>{years} years</strong>
                    </div>

                  </div>

                  <div
                    className="alert alert-light border mt-3 mb-0 small"
                    role="alert"
                  >
                    <i className="bi bi-info-circle me-2 text-primary"></i>

                    This is an estimate. Actual mutual fund
                    returns are market-linked and are not
                    guaranteed.
                  </div>

                </div>
              )}

              {/* RESET */}

              {(monthly || rate || years) && (
                <button
                  type="button"
                  className="btn btn-link text-secondary text-decoration-none w-100 mt-2"
                  onClick={reset}
                >
                  Reset Calculator
                </button>
              )}

            </div>
          </div>

          {/* SEO CONTENT */}

          <div className="seo-content">
            <h2>Free SIP Calculator</h2>

            <p>
              This SIP calculator helps you estimate the
              future value of monthly investments based on
              your investment amount, expected annual
              return and investment period.
            </p>

            <h2>What is SIP?</h2>

            <p>
              SIP stands for Systematic Investment Plan.
              It is a method of investing a fixed amount
              regularly, commonly every month, in a mutual
              fund.
            </p>

            <h2>How to use the SIP Calculator?</h2>

            <p>
              Enter your monthly investment amount,
              expected annual rate of return and investment
              period. The calculator will estimate your
              total invested amount, potential returns and
              future value.
            </p>

            <h2>How are SIP returns calculated?</h2>

            <p>
              SIP calculations use the monthly investment,
              monthly rate of return and total number of
              installments to estimate the future value of
              regular investments.
            </p>

            <h2>Are SIP returns guaranteed?</h2>

            <p>
              No. Mutual fund investments are subject to
              market risks and actual returns can be higher
              or lower than the estimate shown by this
              calculator.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default SIPCalculator;