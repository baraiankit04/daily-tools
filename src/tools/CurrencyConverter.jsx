import { useEffect, useState } from "react";
import SEO from "../components/SEO";

const currencies = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("GBP");
  const [to, setTo] = useState("INR");
  const [rate, setRate] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = (code) =>
    currencies.find((item) => item.code === code);

  useEffect(() => {
    const controller = new AbortController();

    const getRate = async () => {
      setError("");

      if (from === to) {
        setRate(1);
        setDate("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `https://api.frankfurter.dev/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Rate unavailable");
        }

        const data = await response.json();

        setRate(Number(data.rate));
        setDate(data.date || "");
      } catch (err) {
        if (err.name !== "AbortError") {
          setRate(null);
          setError("Unable to load exchange rate. Try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    getRate();

    return () => controller.abort();
  }, [from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const converted =
    rate && Number(amount) >= 0
      ? Number(amount || 0) * rate
      : null;

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(value);

  const formatRate = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 4,
    }).format(value);

  return (
    <>
      <SEO
        title="Currency Converter"
        description="Convert GBP, USD, EUR, AED, INR and other currencies using the latest available exchange rates."
        keywords="currency converter, GBP to INR, USD to INR, EUR to INR, currency calculator"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              CURRENCY TOOL
            </span>

            <h1>Currency Converter</h1>

            <p>
              Enter an amount and instantly convert it to
              another currency.
            </p>
          </div>

          <div className="simple-currency-card">

            <div className="simple-currency-field">
              <label>Amount</label>

              <div className="simple-amount-box">
                <span>{currency(from)?.symbol}</span>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="simple-currency-grid">

              <div>
                <label>From</label>

                <select
                  value={from}
                  onChange={(e) =>
                    setFrom(e.target.value)
                  }
                >
                  {currencies.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="simple-swap-btn"
                onClick={swap}
                aria-label="Swap currencies"
              >
                <i className="bi bi-arrow-left-right"></i>
              </button>

              <div>
                <label>To</label>

                <select
                  value={to}
                  onChange={(e) =>
                    setTo(e.target.value)
                  }
                >
                  {currencies.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="simple-currency-result">

              {loading ? (
                <div className="simple-rate-loading">
                  <span className="spinner-border spinner-border-sm"></span>
                  Getting latest rate...
                </div>
              ) : error ? (
                <div className="simple-rate-error">
                  <i className="bi bi-exclamation-circle"></i>
                  {error}
                </div>
              ) : (
                <>
                  <p>
                    {currency(from)?.symbol}
                    {formatAmount(Number(amount || 0))}{" "}
                    {from} equals
                  </p>

                  <h2>
                    {currency(to)?.symbol}
                    {formatAmount(converted || 0)}
                    <span>{to}</span>
                  </h2>

                  <div className="simple-rate">
                    1 {from} ={" "}
                    {currency(to)?.symbol}
                    {formatRate(rate)} {to}
                  </div>

                  {date && (
                    <small>
                      Reference rate updated {date}
                    </small>
                  )}
                </>
              )}

            </div>

            <div className="simple-currency-note">
              <i className="bi bi-info-circle"></i>
              Bank or card rates may differ from this
              reference rate.
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CurrencyConverter;