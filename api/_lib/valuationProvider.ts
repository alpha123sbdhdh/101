export interface Comparable {
  address: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  distanceMiles: number;
}

export interface ValuationResult {
  address: string;
  estimate: number;
  rangeLow: number;
  rangeHigh: number;
  confidence: "low" | "medium" | "high";
  comparables: Comparable[];
  source: string;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic pseudo-random generator seeded from a number, so the same
 * address always produces the same "random" sequence within this process. */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STREET_NAMES = ["Oak Ave", "Maple St", "Cedar Ln", "Elm St", "Park Pl", "River Rd", "Birch Ct"];

/**
 * SWAP POINT FOR REAL PROVIDER: replace this function's body with a call to
 * a real valuation API (Zillow Bridge partner API, RapidAPI Zillow, ATTOM,
 * Realtor.com, etc.) that resolves the given address to a real estimate,
 * keeping the same ValuationResult shape. No route/UI changes required.
 */
export async function getValuation(address: string): Promise<ValuationResult> {
  const seed = hashString(address.trim().toLowerCase());
  const rand = seededRandom(seed);

  const baseSqft = Math.round(1100 + rand() * 2400);
  const pricePerSqft = 180 + rand() * 220;
  const estimate = Math.round((baseSqft * pricePerSqft) / 1000) * 1000;
  const spread = 0.06 + rand() * 0.04;
  const rangeLow = Math.round((estimate * (1 - spread)) / 1000) * 1000;
  const rangeHigh = Math.round((estimate * (1 + spread)) / 1000) * 1000;

  const confidenceRoll = rand();
  const confidence: ValuationResult["confidence"] =
    confidenceRoll > 0.66 ? "high" : confidenceRoll > 0.33 ? "medium" : "low";

  const comparables: Comparable[] = Array.from({ length: 4 }).map((_, i) => {
    const priceVariance = 0.85 + rand() * 0.3;
    const streetNumber = 50 + Math.floor(rand() * 400);
    const street = STREET_NAMES[Math.floor(rand() * STREET_NAMES.length)];
    return {
      address: `${streetNumber} ${street}`,
      price: Math.round((estimate * priceVariance) / 500) * 500,
      sqft: Math.round(baseSqft * (0.85 + rand() * 0.3)),
      beds: 2 + Math.floor(rand() * 3),
      baths: 1 + Math.floor(rand() * 2) * 0.5 + 1,
      distanceMiles: Math.round((0.1 + rand() * 1.2) * 10) / 10,
    };
  });

  return {
    address,
    estimate,
    rangeLow,
    rangeHigh,
    confidence,
    comparables,
    source: "mock",
  };
}
