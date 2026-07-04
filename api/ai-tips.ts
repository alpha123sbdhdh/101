import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getTips, type RoomType } from "./_lib/tipsProvider";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { roomType, photoCount } = req.body ?? {};
  if (typeof roomType !== "string") {
    res.status(400).json({ error: "roomType is required" });
    return;
  }

  const tips = await getTips(roomType as RoomType, Number(photoCount) || 0);
  res.status(200).json({ roomType, tips, source: "stub" });
}
