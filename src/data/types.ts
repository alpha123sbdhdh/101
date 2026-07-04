import type { RoomType } from "../rooms/roomTypes";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface Room {
  id: string;
  project_id: string;
  room_type: RoomType;
  created_at: string;
}

export interface Photo {
  id: string;
  room_id: string;
  vantage_point_id: string;
  storage_path: string;
  created_at: string;
}
