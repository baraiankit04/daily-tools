import { useMemo, useState } from "react";
import SEO from "../components/SEO";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
  { code: "AED", symbol: "د.إ" },
];

function FreightCalculator() {
  const [shipmentType, setShipmentType] = useState("air");
  const [currency, setCurrency] = useState("INR");

  const [actualWeight, setActualWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [packages, setPackages] = useState("1");

  const [freightRate, setFreightRate] = useState("");
  const [handlingCharges, setHandlingCharges] = useState("");
  const [documentationCharges, setDocumentationCharges] =
    useState("");
  const [otherCharges, setOtherCharges] = useState("");

  const [showResult, setShowResult] = useState(false);

  const selectedCurrency =
    currencies.find((item) => item.code === currency) ||
    currencies[0];

  const result = useMemo(() => {
    const actual = Number(actualWeight) || 0;
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    const pcs = Number(packages) || 1;

    const rate = Number(freightRate) || 0;
    const handling = Number(handlingCharges) || 0;
    const documentation = Number(documentationCharges) || 0;
    const other = Number(otherCharges) || 0;

    // Standard air-freight dimensional divisor used here: 6000
    const volumetricWeight =
      shipmentType === "air" && l > 0 && w > 0 && h > 0
        ? (l * w * h * pcs) / 6000
        : 0;

    const chargeableWeight =
      shipmentType === "air"
        ? Math.max(actual, volumetricWeight)
        : actual;

    const baseFreight = chargeableWeight * rate;

    const additionalCharges =
      handling + documentation + other;

    const totalFreight =
      baseFreight + additionalCharges;

    const freightPerKg =
      actual > 0 ? totalFreight / actual : 0;

    return {
      actual,
      volumetricWeight,
      chargeableWeight,
      rate,
      handling,
      documentation,
      other,
      baseFreight,
      additionalCharges,
      totalFreight,
      freightPerKg,
    };
  }, [
    shipmentType,
    actualWeight,
    length,
    width,
    height,
    packages,
    freightRate,
    handlingCharges,
    documentationCharges,
    otherCharges,
  ]);

  const formatNumber = (value, decimals = 2) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value || 0);
  };

  const formatMoney = (value) => {
    return `${selectedCurrency.symbol}${new Intl.NumberFormat(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value || 0)}`;
  };

  const calculateFreight = () => {
    if (!actualWeight || Number(actualWeight) <= 0) {
      alert("Please enter actual shipment weight.");
      return;
    }

    if (!freightRate || Number(freightRate) <= 0) {
      alert("Please enter freight rate.");
      return;
    }

    setShowResult(true);

    setTimeout(() => {
      document
        .getElementById("freight-result")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const resetCalculator = () => {
    setShipmentType("air");
    setCurrency("INR");
    setActualWeight("");
    setLength("");
    setWidth("");
    setHeight("");
    setPackages("1");
    setFreightRate("");
    setHandlingCharges("");
    setDocumentationCharges("");
    setOtherCharges("");
    setShowResult(false);
  };

  return (
    <>
      <SEO
        title="Freight Calculator - Air & Sea Freight Cost"
        description="Calculate air and sea freight cost, chargeable weight, volumetric weight, freight rate and additional shipment charges."
        keywords="freight calculator, air freight calculator, volumetric weight calculator, chargeable weight calculator, shipping cost calculator"
      />

      <div className="tool-page freight-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              BUSINESS TOOL
            </span>

            <h1>Freight Calculator</h1>

            <p>
              Calculate freight cost, chargeable weight and
              total shipment charges quickly.
            </p>
          </div>

          <div className="calculator-card freight-card">
            {/* SHIPMENT TYPE */}

            <div className="freight-step">
              <div className="freight-step-number">1</div>

              <div>
                <strong>Shipment Type</strong>
                <span>
                  Select how your shipment is moving.
                </span>
              </div>
            </div>

            <div className="freight-type-grid">
              <button
                type="button"
                className={
                  shipmentType === "air" ? "active" : ""
                }
                onClick={() => {
                  setShipmentType("air");
                  setShowResult(false);
                }}
              >
                <i className="bi bi-airplane"></i>

                <span>
                  <strong>Air Freight</strong>
                  <small>By Air</small>
                </span>
              </button>

              <button
                type="button"
                className={
                  shipmentType === "sea" ? "active" : ""
                }
                onClick={() => {
                  setShipmentType("sea");
                  setShowResult(false);
                }}
              >
                <i className="bi bi-water"></i>

                <span>
                  <strong>Sea Freight</strong>
                  <small>By Sea</small>
                </span>
              </button>
            </div>

            <div className="freight-divider"></div>

            {/* WEIGHT */}

            <div className="freight-step">
              <div className="freight-step-number">2</div>

              <div>
                <strong>Shipment Weight</strong>
                <span>
                  Enter the actual weight of the shipment.
                </span>
              </div>
            </div>

            <label className="form-label">
              Actual Weight
            </label>

            <div className="freight-input-unit">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="1200"
                value={actualWeight}
                onChange={(e) => {
                  setActualWeight(e.target.value);
                  setShowResult(false);
                }}
              />

              <span>KG</span>
            </div>

            {/* AIR DIMENSIONS */}

            {shipmentType === "air" && (
              <div className="freight-volume-section">
                <div className="freight-optional-title">
                  <div>
                    <strong>
                      Package Dimensions
                    </strong>

                    <span>Optional</span>
                  </div>

                  <small>
                    Used to calculate volumetric weight
                  </small>
                </div>

                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <label className="form-label">
                      Length
                    </label>

                    <div className="freight-input-unit">
                      <input
                        type="number"
                        min="0"
                        placeholder="60"
                        value={length}
                        onChange={(e) => {
                          setLength(e.target.value);
                          setShowResult(false);
                        }}
                      />

                      <span>CM</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <label className="form-label">
                      Width
                    </label>

                    <div className="freight-input-unit">
                      <input
                        type="number"
                        min="0"
                        placeholder="40"
                        value={width}
                        onChange={(e) => {
                          setWidth(e.target.value);
                          setShowResult(false);
                        }}
                      />

                      <span>CM</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <label className="form-label">
                      Height
                    </label>

                    <div className="freight-input-unit">
                      <input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                          setShowResult(false);
                        }}
                      />

                      <span>CM</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <label className="form-label">
                      Packages
                    </label>

                    <div className="freight-input-unit">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        value={packages}
                        onChange={(e) => {
                          setPackages(e.target.value);
                          setShowResult(false);
                        }}
                      />

                      <span>PCS</span>
                    </div>
                  </div>
                </div>

                <div className="freight-formula-info">
                  <i className="bi bi-info-circle"></i>

                  <span>
                    Volumetric Weight = Length × Width ×
                    Height × Packages ÷ 6000. The higher of
                    actual or volumetric weight is used as
                    chargeable weight.
                  </span>
                </div>
              </div>
            )}

            <div className="freight-divider"></div>

            {/* RATE */}

            <div className="freight-step">
              <div className="freight-step-number">3</div>

              <div>
                <strong>Freight Rate</strong>

                <span>
                  Enter the rate charged per KG.
                </span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">
                  Currency
                </label>

                <select
                  className="form-select freight-select"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setShowResult(false);
                  }}
                >
                  {currencies.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.symbol} {item.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-8">
                <label className="form-label">
                  Freight Rate Per KG
                </label>

                <div className="freight-rate-input">
                  <span>
                    {selectedCurrency.symbol}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="85"
                    value={freightRate}
                    onChange={(e) => {
                      setFreightRate(e.target.value);
                      setShowResult(false);
                    }}
                  />

                  <span>/ KG</span>
                </div>
              </div>
            </div>

            <div className="freight-divider"></div>

            {/* OTHER CHARGES */}

            <div className="freight-step">
              <div className="freight-step-number">4</div>

              <div>
                <strong>Additional Charges</strong>

                <span>
                  Optional charges added to the freight.
                </span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">
                  Handling
                </label>

                <div className="freight-money-input">
                  <span>
                    {selectedCurrency.symbol}
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="2000"
                    value={handlingCharges}
                    onChange={(e) => {
                      setHandlingCharges(e.target.value);
                      setShowResult(false);
                    }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Documentation
                </label>

                <div className="freight-money-input">
                  <span>
                    {selectedCurrency.symbol}
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={documentationCharges}
                    onChange={(e) => {
                      setDocumentationCharges(
                        e.target.value
                      );
                      setShowResult(false);
                    }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Other Charges
                </label>

                <div className="freight-money-input">
                  <span>
                    {selectedCurrency.symbol}
                  </span>

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
              </div>
            </div>

            <button
              type="button"
              className="primary-btn freight-calculate-btn"
              onClick={calculateFreight}
            >
              <i className="bi bi-calculator"></i>
              Calculate Freight
            </button>
          </div>

          {/* RESULT */}

          {showResult && (
            <div
              className="freight-result"
              id="freight-result"
            >
              <div className="freight-result-header">
                <div>
                  <span className="section-eyebrow">
                    FREIGHT SUMMARY
                  </span>

                  <h2>Your Freight Cost</h2>
                </div>

                <div className="freight-result-mode">
                  <i
                    className={
                      shipmentType === "air"
                        ? "bi bi-airplane"
                        : "bi bi-water"
                    }
                  ></i>

                  {shipmentType === "air"
                    ? "Air Freight"
                    : "Sea Freight"}
                </div>
              </div>

              <div className="freight-result-grid">
                <div>
                  <span>Actual Weight</span>
                  <strong>
                    {formatNumber(result.actual)} KG
                  </strong>
                </div>

                {shipmentType === "air" && (
                  <>
                    <div>
                      <span>Volumetric Weight</span>
                      <strong>
                        {formatNumber(
                          result.volumetricWeight
                        )}{" "}
                        KG
                      </strong>
                    </div>

                    <div className="highlight">
                      <span>Chargeable Weight</span>
                      <strong>
                        {formatNumber(
                          result.chargeableWeight
                        )}{" "}
                        KG
                      </strong>
                    </div>
                  </>
                )}

                <div>
                  <span>Freight Rate</span>
                  <strong>
                    {formatMoney(result.rate)} / KG
                  </strong>
                </div>
              </div>

              <div className="freight-cost-details">
                <h3>Cost Breakdown</h3>

                <div>
                  <span>Base Freight</span>
                  <strong>
                    {formatMoney(result.baseFreight)}
                  </strong>
                </div>

                <div>
                  <span>Handling Charges</span>
                  <strong>
                    {formatMoney(result.handling)}
                  </strong>
                </div>

                <div>
                  <span>
                    Documentation Charges
                  </span>

                  <strong>
                    {formatMoney(
                      result.documentation
                    )}
                  </strong>
                </div>

                <div>
                  <span>Other Charges</span>

                  <strong>
                    {formatMoney(result.other)}
                  </strong>
                </div>
              </div>

              <div className="freight-total-box">
                <span>TOTAL FREIGHT</span>

                <strong>
                  {formatMoney(result.totalFreight)}
                </strong>

                <small>
                  Approx.{" "}
                  {formatMoney(result.freightPerKg)} per
                  actual KG
                </small>
              </div>

              <div className="freight-result-actions">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer"></i>
                  Print / Save PDF
                </button>

                <button
                  type="button"
                  className="freight-reset-btn"
                  onClick={resetCalculator}
                >
                  New Calculation
                </button>
              </div>

              <div className="freight-note">
                <i className="bi bi-info-circle"></i>

                <span>
                  Freight calculations are estimates.
                  Airlines, shipping lines and freight
                  forwarders may use different chargeable
                  weight rules, minimum charges or
                  dimensional factors.
                </span>
              </div>
            </div>
          )}

          {/* SEO CONTENT */}

          <div className="seo-content">
            <h2>How is freight calculated?</h2>

            <p>
              Freight cost can be estimated by multiplying
              the chargeable shipment weight by the freight
              rate and then adding handling,
              documentation and other charges.
            </p>

            <h2>
              What is chargeable weight in air freight?
            </h2>

            <p>
              Air freight can be charged using actual
              weight or volumetric weight. This calculator
              compares both values and uses the higher
              value as the chargeable weight.
            </p>

            <h2>What is volumetric weight?</h2>

            <p>
              Volumetric weight estimates how much space a
              shipment occupies. This calculator uses
              length × width × height × number of packages
              divided by 6000 for its air-freight
              estimate.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FreightCalculator;