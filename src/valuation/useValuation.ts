import { useMutation } from "@tanstack/react-query";

export interface Comparable {
  address: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  distanceMiles: number;
}

export interface ValuationResponse {
  address: string;
  estimate: number;
  rangeLow: number;
  rangeHigh: number;
  confidence: "low" | "medium" | "high";
  comparables: Comparable[];
  source: string;
}

export function useValuation() {
  return useMutation({
    mutationFn: async (address: string): Promise<ValuationResponse> => {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error("Failed to get an estimate");
      return res.json();
    },
  });
}
