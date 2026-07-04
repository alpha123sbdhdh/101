import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoom, useRoomPhotos, useSignedPhotoUrl } from "../data/projectsQueries";
import { usePhotoUpload, useReplacePhoto } from "../capture/usePhotoUpload";
import { getRoomDefinition } from "../rooms/roomDefinitions";
import { CaptureStep } from "../capture/CaptureStep";
import { CaptureProgress } from "../capture/CaptureProgress";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageTransition } from "../components/PageTransition";
import { roomLabel } from "../rooms/roomTypes";

export function CaptureRoute() {
  const { projectId, roomId } = useParams();
  const navigate = useNavigate();
  const { data: room, isLoading: roomLoading } = useRoom(roomId);
  const { data: photos, isLoading: photosLoading } = useRoomPhotos(roomId);
  const upload = usePhotoUpload();
  const replace = useReplacePhoto();
  const [index, setIndex] = useState(0);

  const definition = useMemo(() => (room ? getRoomDefinition(room.room_type) : null), [room]);

  const currentVantagePoint = definition?.vantagePoints[index];
  const existingPhoto = photos?.find((p) => p.vantage_point_id === currentVantagePoint?.id);
  const { data: existingUrl } = useSignedPhotoUrl(existingPhoto?.storage_path);

  if (roomLoading || photosLoading || !definition || !currentVantagePoint) return <LoadingScreen />;

  const doneFlags = definition.vantagePoints.map((vp) => photos?.some((p) => p.vantage_point_id === vp.id) ?? false);
  const isLast = index === definition.vantagePoints.length - 1;

  function goNext() {
    if (isLast) {
      navigate(`/projects/${projectId}/rooms/${roomId}`);
    } else {
      setIndex((i) => i + 1);
    }
  }

  async function handleCapture(file: File) {
    if (!roomId || !currentVantagePoint) return;
    if (existingPhoto) {
      await replace.mutateAsync({ photoId: existingPhoto.id, roomId });
    }
    await upload.mutateAsync({ roomId, vantagePointId: currentVantagePoint.id, file });
  }

  async function handleRetake() {
    if (!roomId || !existingPhoto) return;
    await replace.mutateAsync({ photoId: existingPhoto.id, roomId });
  }

  return (
    <PageTransition>
      <p className="muted" style={{ textAlign: "center", marginBottom: 4 }}>
        {room ? roomLabel(room.room_type) : ""}
      </p>
      <CaptureProgress total={definition.vantagePoints.length} currentIndex={index} doneFlags={doneFlags} />
      <CaptureStep
        vantagePoint={currentVantagePoint}
        photoUrl={existingUrl ?? null}
        uploading={upload.isPending || replace.isPending}
        onCapture={handleCapture}
        onRetake={handleRetake}
        onNext={goNext}
        onSkip={goNext}
        isLast={isLast}
      />
    </PageTransition>
  );
}
