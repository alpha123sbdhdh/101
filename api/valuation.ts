import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getValuation } from "./_lib/valuationProvider";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { address } = req.body ?? {};
  if (typeof address !== "string" || !address.trim()) {
    res.status(400).json({ error: "address is required" });
    return;
  }

  const result = await getValuation(address);
  res.status(200).json(result);
}
