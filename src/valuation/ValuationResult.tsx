import { motion } from "framer-motion";
import type { ValuationResponse } from "./useValuation";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ValuationResult({ result }: { result: ValuationResponse }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="card valuation-hero">
        <p className="muted" style={{ marginBottom: 6 }}>{result.address}</p>
        <div className="valuation-amount">{currency.format(result.estimate)}</div>
        <p className="muted" style={{ marginTop: 8 }}>
          Estimated range {currency.format(result.rangeLow)} – {currency.format(result.rangeHigh)}
        </p>
        <span className="badge" style={{ marginTop: 12 }}>
          {result.confidence} confidence · mock estimate
        </span>
      </div>

      <h3 style={{ marginTop: 28, marginBottom: 4 }}>Comparable properties</h3>
      <p className="muted" style={{ marginTop: 0 }}>Illustrative only, not real listings.</p>
      <div className="comparables">
        {result.comparables.map((c) => (
          <div key={c.address} className="card comparable-row">
            <div>
              <div>{c.address}</div>
              <div className="muted">
                {c.beds} bd · {c.baths} ba · {c.sqft.toLocaleString()} sqft · {c.distanceMiles} mi away
              </div>
            </div>
            <div style={{ fontWeight: 700 }}>{currency.format(c.price)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
