import { useState } from "react";
import SEO from "../components/SEO";
function UnitConverter() {
  const [value, setValue] = useState("");
  const [type, setType] = useState("kg-lb");

  const number = Number(value || 0);

  const conversions = {
    "kg-lb": {
      result: number * 2.20462,
      from: "Kilograms",
      to: "Pounds",
    },

    "lb-kg": {
      result: number / 2.20462,
      from: "Pounds",
      to: "Kilograms",
    },

    "cm-inch": {
      result: number / 2.54,
      from: "Centimeters",
      to: "Inches",
    },

    "inch-cm": {
      result: number * 2.54,
      from: "Inches",
      to: "Centimeters",
    },

    "km-mile": {
      result: number * 0.621371,
      from: "Kilometers",
      to: "Miles",
    },

    "mile-km": {
      result: number / 0.621371,
      from: "Miles",
      to: "Kilometers",
    },
  };

  const current = conversions[type];

  return (
    <div className="container tool-page">
        <SEO
  title="Unit Converter Online"
  description="Convert common units of length, weight and measurement quickly using our free unit converter."
  keywords="unit converter, measurement converter, length converter, weight converter"
/>
      <div className="tool-page-heading text-center">
        <h1>Unit Converter</h1>
        <p>
          Convert common weight, length and distance
          units.
        </p>
      </div>

      <div className="calculator-card">
        <label>Conversion</label>

        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="kg-lb">
            KG → Pounds
          </option>

          <option value="lb-kg">
            Pounds → KG
          </option>

          <option value="cm-inch">
            CM → Inches
          </option>

          <option value="inch-cm">
            Inches → CM
          </option>

          <option value="km-mile">
            KM → Miles
          </option>

          <option value="mile-km">
            Miles → KM
          </option>
        </select>

        <label className="mt-3">
          {current.from}
        </label>

        <input
          className="form-control"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {value && (
          <div className="result-box">
            <small>{current.to.toUpperCase()}</small>

            <strong>
              {current.result.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 4,
                }
              )}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitConverter;