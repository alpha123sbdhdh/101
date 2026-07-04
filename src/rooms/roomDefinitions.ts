import type { RoomType } from "./roomTypes";

/**
 * Every room type uses the same 5-slot skeleton (entry/wide, feature wall A,
 * feature wall B, ceiling, floor) so the same 3D room shell + face-mapping
 * logic works for every room type — only the prompt copy differs.
 */
export type TargetFace = "wallEntry" | "wallFeatureA" | "wallFeatureB" | "ceiling" | "floor";

export interface VantagePoint {
  id: string;
  promptTitle: string;
  promptSubtitle: string;
  targetFace: TargetFace;
  required: boolean;
}

export interface RoomDefinition {
  type: RoomType;
  vantagePoints: VantagePoint[];
}

function skeleton(
  type: RoomType,
  entry: [string, string],
  featureA: [string, string],
  featureB: [string, string],
): RoomDefinition {
  return {
    type,
    vantagePoints: [
      {
        id: "entry",
        promptTitle: entry[0],
        promptSubtitle: entry[1],
        targetFace: "wallEntry",
        required: true,
      },
      {
        id: "feature-a",
        promptTitle: featureA[0],
        promptSubtitle: featureA[1],
        targetFace: "wallFeatureA",
        required: true,
      },
      {
        id: "feature-b",
        promptTitle: featureB[0],
        promptSubtitle: featureB[1],
        targetFace: "wallFeatureB",
        required: false,
      },
      {
        id: "ceiling",
        promptTitle: "Ceiling",
        promptSubtitle: "Stand in the center of the room and point the camera straight up.",
        targetFace: "ceiling",
        required: false,
      },
      {
        id: "floor",
        promptTitle: "Floor",
        promptSubtitle: "Stand in the center of the room and point the camera straight down.",
        targetFace: "floor",
        required: false,
      },
    ],
  };
}

export const ROOM_DEFINITIONS: Record<RoomType, RoomDefinition> = {
  living_room: skeleton(
    "living_room",
    ["Wide shot from the doorway", "Stand in the entryway and capture the whole seating area."],
    ["Seating area wall", "Face the main sofa/seating wall straight on."],
    ["Window wall", "Turn to face the window or the brightest wall in the room."],
  ),
  dining_room: skeleton(
    "dining_room",
    ["Wide shot from the doorway", "Stand in the entryway and capture the whole table."],
    ["Table, short end", "Stand at one short end of the table facing down its length."],
    ["Feature wall", "Face the buffet, sideboard, or feature wall near the table."],
  ),
  kitchen: skeleton(
    "kitchen",
    ["Wide shot from the doorway", "Stand in the entryway and capture the whole kitchen."],
    ["Counter & cabinets", "Face the main counter and cabinet run straight on."],
    ["Sink & appliances", "Face the sink and major appliances (stove, fridge)."],
  ),
  bathroom: skeleton(
    "bathroom",
    ["Wide shot from the doorway", "Stand in the entryway and capture the whole bathroom."],
    ["Vanity & mirror", "Face the vanity and mirror straight on."],
    ["Tub / shower", "Face the tub or shower area."],
  ),
  bedroom: skeleton(
    "bedroom",
    ["Wide shot from the doorway", "Stand in the entryway and capture the whole room."],
    ["Bed wall", "Face the headboard / bed wall straight on."],
    ["Window or closet wall", "Turn to face the window or closet wall."],
  ),
};

export function getRoomDefinition(type: RoomType): RoomDefinition {
  return ROOM_DEFINITIONS[type];
}
