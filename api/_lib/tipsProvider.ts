export type RoomType = "living_room" | "dining_room" | "kitchen" | "bathroom" | "bedroom";

export interface Tip {
  id: string;
  text: string;
}

const TIP_BANK: Record<RoomType, Tip[]> = {
  living_room: [
    { id: "living-declutter", text: "Clear surfaces of loose items — a tidy coffee table reads as more spacious in photos." },
    { id: "living-throw-pillows", text: "Add 2-3 matching throw pillows to make the sofa feel intentional and inviting." },
    { id: "living-lighting", text: "Turn on all lamps and open curtains fully before shooting — layered light beats one overhead fixture." },
    { id: "living-rearrange", text: "Angle seating slightly toward a focal point (TV, fireplace, window) instead of straight against the wall." },
    { id: "living-plants", text: "A single large plant in an empty corner adds life without cluttering the room." },
    { id: "living-cords", text: "Tuck away visible cords and remotes — small details like this stand out in photos more than in person." },
    { id: "living-angles", text: "Shoot from a corner rather than the center of the room to capture more depth." },
  ],
  dining_room: [
    { id: "dining-centerpiece", text: "A simple centerpiece (bowl of fruit, low candles) makes the table feel styled, not staged." },
    { id: "dining-chairs", text: "Push chairs in evenly and make sure they all match or complement each other." },
    { id: "dining-declutter", text: "Clear mail, keys, or everyday clutter off the table before photographing." },
    { id: "dining-lighting", text: "If there's a pendant light or chandelier, make sure it's on — it's often the room's best feature." },
    { id: "dining-mirror", text: "A mirror on the feature wall can make a small dining room feel noticeably larger." },
  ],
  kitchen: [
    { id: "kitchen-counters", text: "Clear countertops of small appliances — buyers respond strongly to open counter space." },
    { id: "kitchen-lighting", text: "Use warm-white bulbs (2700K-3000K) so the kitchen feels inviting rather than clinical." },
    { id: "kitchen-fridge", text: "Remove magnets, photos, and notes from the fridge door for a cleaner look." },
    { id: "kitchen-towels", text: "Fresh, matching dish towels and a full soap dispenser are small touches that photograph well." },
    { id: "kitchen-angles", text: "Capture the counter run and the sink/appliance wall separately — a single wide shot often loses detail." },
    { id: "kitchen-cabinets", text: "Close all cabinet and drawer doors before shooting." },
  ],
  bathroom: [
    { id: "bath-counters", text: "Clear the vanity of toiletries except one or two neatly arranged items." },
    { id: "bath-towels", text: "Hang fresh, matching towels — this is one of the highest-impact, lowest-effort staging moves." },
    { id: "bath-mirror", text: "Clean the mirror thoroughly; smudges are very noticeable in photos." },
    { id: "bath-lighting", text: "Turn on vanity lights and open any window coverings for brighter, more flattering light." },
    { id: "bath-shower", text: "Remove excess bottles from the tub/shower edge and add a single neutral shower curtain if needed." },
  ],
  bedroom: [
    { id: "bed-made", text: "A crisply made bed with matching linens is the single biggest lever for a bedroom photo." },
    { id: "bed-nightstands", text: "Keep nightstands to a lamp and one or two small items — clear the rest." },
    { id: "bed-closet", text: "If the closet is visible, straighten hanging clothes or keep the door closed." },
    { id: "bed-lighting", text: "Open curtains fully during the day to maximize natural light." },
    { id: "bed-personal", text: "Put away personal photos and very personal items so buyers can picture themselves in the space." },
  ],
};

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * SWAP POINT FOR REAL PROVIDER: replace this function's body with a call to
 * a real vision model (e.g. Claude, given the room's actual photos) that
 * returns generated tips through the same { id, text }[] shape. Nothing
 * upstream (the route handler or the frontend `useTips` hook) needs to change.
 */
export async function getTips(roomType: RoomType, photoCount: number): Promise<Tip[]> {
  const bank = TIP_BANK[roomType] ?? [];
  const seed = roomType.length + photoCount * 7;
  const shuffled = seededShuffle(bank, seed);
  const picked = shuffled.slice(0, Math.min(4, shuffled.length));

  if (photoCount < 3) {
    picked.unshift({
      id: "capture-more-angles",
      text: "Capture a couple more angles of this room — more vantage points make for a richer 3D walkthrough.",
    });
  }

  return picked.slice(0, 4);
}
