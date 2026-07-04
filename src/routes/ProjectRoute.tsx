import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useAddRoom,
  useProject,
  useProjectRooms,
  useRoomPhotos,
  useSignedPhotoUrl,
} from "../data/projectsQueries";
import { getRoomDefinition } from "../rooms/roomDefinitions";
import { ROOM_TYPES, roomIcon, roomLabel, type RoomType } from "../rooms/roomTypes";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageTransition } from "../components/PageTransition";
import type { Room } from "../data/types";

function RoomCard({ room }: { room: Room }) {
  const definition = getRoomDefinition(room.room_type);
  const { data: photos } = useRoomPhotos(room.id);
  const requiredCount = definition.vantagePoints.filter((v) => v.required).length;
  const capturedRequired = definition.vantagePoints.filter(
    (v) => v.required && photos?.some((p) => p.vantage_point_id === v.id),
  ).length;
  const total = definition.vantagePoints.length;
  const captured = photos?.length ?? 0;
  const firstPhoto = photos?.[0];
  const { data: thumbUrl } = useSignedPhotoUrl(firstPhoto?.storage_path);
  const canView = capturedRequired >= requiredCount && requiredCount > 0;

  return (
    <div className="card">
      {thumbUrl ? (
        <img className="room-card-thumb" src={thumbUrl} alt={roomLabel(room.room_type)} />
      ) : (
        <div className="room-card-thumb">{roomIcon(room.room_type)}</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>{roomLabel(room.room_type)}</div>
        <span className="badge">{captured}/{total} photos</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link className="btn btn-ghost" style={{ flex: 1 }} to={`/projects/${room.project_id}/rooms/${room.id}/capture`}>
          {captured > 0 ? "Add photos" : "Capture"}
        </Link>
        <Link
          className={"btn " + (canView ? "btn-primary" : "btn-ghost")}
          style={{ flex: 1, pointerEvents: canView ? "auto" : "none", opacity: canView ? 1 : 0.5 }}
          to={`/projects/${room.project_id}/rooms/${room.id}`}
        >
          View 3D
        </Link>
      </div>
    </div>
  );
}

export function ProjectRoute() {
  const { projectId } = useParams();
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: rooms, isLoading: roomsLoading } = useProjectRooms(projectId);
  const addRoom = useAddRoom(projectId as string);
  const [showPicker, setShowPicker] = useState(false);

  const existingTypes = new Set(rooms?.map((r) => r.room_type));

  async function handleAddRoom(type: RoomType) {
    setShowPicker(false);
    await addRoom.mutateAsync(type);
  }

  if (projectLoading || roomsLoading) return <LoadingScreen />;

  return (
    <PageTransition>
      <h1 className="page-heading">{project?.name}</h1>
      <p className="page-sub">{project?.address || "Add rooms and capture each one to build a 3D walkthrough."}</p>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {rooms?.map((room, i) => (
          <motion.div key={room.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <RoomCard room={room} />
          </motion.div>
        ))}
      </div>

      {!showPicker ? (
        <button className="btn btn-primary" onClick={() => setShowPicker(true)}>
          + Add room
        </button>
      ) : (
        <div className="card" style={{ maxWidth: 420 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Choose a room type</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ROOM_TYPES.map((rt) => (
              <button
                key={rt.type}
                className="btn btn-ghost"
                style={{ justifyContent: "flex-start" }}
                disabled={existingTypes.has(rt.type)}
                onClick={() => handleAddRoom(rt.type)}
              >
                {rt.icon} {rt.label} {existingTypes.has(rt.type) ? "(added)" : ""}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => setShowPicker(false)}>
            Cancel
          </button>
        </div>
      )}
    </PageTransition>
  );
}
