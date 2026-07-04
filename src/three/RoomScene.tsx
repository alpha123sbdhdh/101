import { Canvas } from "@react-three/fiber";
import { RoomShell } from "./RoomShell";
import { CameraRig } from "./CameraRig";
import { ROOM_DIMENSIONS } from "./textureMapping";
import type { TargetFace } from "../rooms/roomDefinitions";

export default function RoomScene({
  photosByFace,
}: {
  photosByFace: Partial<Record<TargetFace, string>>;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        position: [0, ROOM_DIMENSIONS.height * 0.6, ROOM_DIMENSIONS.depth * 0.28],
        fov: 60,
      }}
    >
      <color attach="background" args={["#05070c"]} />
      <hemisphereLight intensity={0.9} groundColor="#111827" />
      <directionalLight position={[3, 5, 2]} intensity={0.6} />
      <RoomShell photosByFace={photosByFace} />
      <CameraRig />
    </Canvas>
  );
}
