import { useQuery } from "@tanstack/react-query";
import type { RoomType } from "../rooms/roomTypes";

export interface Tip {
  id: string;
  text: string;
}

interface TipsResponse {
  roomType: RoomType;
  tips: Tip[];
  source: string;
}

export function useTips(roomType: RoomType | undefined, photoCount: number) {
  return useQuery({
    queryKey: ["ai-tips", roomType, photoCount],
    enabled: !!roomType,
    queryFn: async (): Promise<TipsResponse> => {
      const res = await fetch("/api/ai-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomType, photoCount }),
      });
      if (!res.ok) throw new Error("Failed to fetch tips");
      return res.json();
    },
  });
}
