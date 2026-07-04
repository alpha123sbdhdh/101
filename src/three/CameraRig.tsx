import { OrbitControls } from "@react-three/drei";
import { ROOM_DIMENSIONS } from "./textureMapping";

export function CameraRig() {
  return (
    <OrbitControls
      target={[0, ROOM_DIMENSIONS.height / 2, 0]}
      enablePan={false}
      minDistance={0.6}
      maxDistance={Math.min(ROOM_DIMENSIONS.width, ROOM_DIMENSIONS.depth) * 0.45}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI - 0.15}
      dampingFactor={0.12}
      enableDamping
      rotateSpeed={0.6}
    />
  );
}
