export type RoomType = "living_room" | "dining_room" | "kitchen" | "bathroom" | "bedroom";

export interface RoomTypeMeta {
  type: RoomType;
  label: string;
  icon: string;
}

export const ROOM_TYPES: RoomTypeMeta[] = [
  { type: "living_room", label: "Living Room", icon: "\u{1F6CB}️" },
  { type: "dining_room", label: "Dining Room", icon: "\u{1F37D}️" },
  { type: "kitchen", label: "Kitchen", icon: "\u{1F373}" },
  { type: "bathroom", label: "Bathroom", icon: "\u{1F6C1}" },
  { type: "bedroom", label: "Bedroom", icon: "\u{1F6CF}️" },
];

export function roomLabel(type: RoomType): string {
  return ROOM_TYPES.find((r) => r.type === type)?.label ?? type;
}

export function roomIcon(type: RoomType): string {
  return ROOM_TYPES.find((r) => r.type === type)?.icon ?? "\u{1F3E0}";
}
