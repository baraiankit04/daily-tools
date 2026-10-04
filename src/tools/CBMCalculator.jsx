import { useState } from "react";
import SEO from "../components/SEO";
function CBMCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [qty, setQty] = useState(1);

  const cbm =
    (Number(length || 0) *
      Number(width || 0) *
      Number(height || 0) *
      Number(qty || 0)) /
    1000000;

  return (
    <div className="container tool-page">
  <SEO
  title="CBM Calculator - Calculate Shipment Volume"
  description="Calculate CBM and shipment volume from carton length, width, height and quantity."
  keywords="cbm calculator, shipment cbm, carton volume calculator, cubic meter calculator"
/>
      <div className="tool-page-heading text-center">
        <h1>CBM Calculator</h1>
        <p>
          Calculate shipment volume from carton
          dimensions.
        </p>
      </div>

      <div className="calculator-card">
        <div className="row g-3">
          <div className="col-4">
            <label>Length cm</label>
            <input
              className="form-control"
              type="number"
              value={length}
              onChange={(e) =>
                setLength(e.target.value)
              }
            />
          </div>

          <div className="col-4">
            <label>Width cm</label>
            <input
              className="form-control"
              type="number"
              value={width}
              onChange={(e) =>
                setWidth(e.target.value)
              }
            />
          </div>

          <div className="col-4">
            <label>Height cm</label>
            <input
              className="form-control"
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(e.target.value)
              }
            />
          </div>
        </div>

        <label className="mt-3">
          Number of Cartons
        </label>

        <input
          className="form-control"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <div className="result-box">
          <small>TOTAL CBM</small>
          <strong>{cbm.toFixed(4)} m³</strong>
        </div>
      </div>
    </div>
  );
}

export default CBMCalculator;