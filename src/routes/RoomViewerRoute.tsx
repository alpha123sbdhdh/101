import { lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoom, useRoomPhotos, usePhotosByFace } from "../data/projectsQueries";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageTransition } from "../components/PageTransition";
import { RoomSceneLoadingFallback } from "../three/loadingFallback";
import { TipsPanel } from "../tips/TipsPanel";
import { roomLabel } from "../rooms/roomTypes";

const RoomScene = lazy(() => import("../three/RoomScene"));

export function RoomViewerRoute() {
  const { projectId, roomId } = useParams();
  const { data: room, isLoading: roomLoading } = useRoom(roomId);
  const { data: photos, isLoading: photosLoading } = useRoomPhotos(roomId);
  const photosByFace = usePhotosByFace(room, photos);
  const [tab, setTab] = useState<"3d" | "tips">("3d");

  if (roomLoading || photosLoading || !room) return <LoadingScreen />;

  return (
    <PageTransition>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 className="page-heading" style={{ marginBottom: 0 }}>{roomLabel(room.room_type)}</h1>
        <Link className="btn btn-ghost" to={`/projects/${projectId}`}>
          Back
        </Link>
      </div>

      <div className="tabs">
        <button className={"tab" + (tab === "3d" ? " active" : "")} onClick={() => setTab("3d")}>
          3D View
        </button>
        <button className={"tab" + (tab === "tips" ? " active" : "")} onClick={() => setTab("tips")}>
          AI Tips
        </button>
      </div>

      {tab === "3d" ? (
        <div className="room-3d-wrap">
          <Suspense fallback={<RoomSceneLoadingFallback />}>
            <RoomScene photosByFace={photosByFace} />
          </Suspense>
        </div>
      ) : (
        <TipsPanel roomType={room.room_type} photoCount={photos?.length ?? 0} />
      )}

      <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
        Drag to look around · scroll or pinch to zoom
      </p>
    </PageTransition>
  );
}
