import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import {
  FACE_GEOMETRIES,
  ROOM_DIMENSIONS,
  applyCoverFit,
  FALLBACK_CEILING_COLOR,
  FALLBACK_FLOOR_COLOR,
  FALLBACK_WALL_COLOR,
  type FaceGeometry,
} from "./textureMapping";
import type { TargetFace } from "../rooms/roomDefinitions";

type FaceKey = TargetFace | "wallSide";

function fallbackColorFor(face: FaceKey): string {
  if (face === "floor") return FALLBACK_FLOOR_COLOR;
  if (face === "ceiling") return FALLBACK_CEILING_COLOR;
  return FALLBACK_WALL_COLOR;
}

function TexturedPlane({ geometry, url }: { geometry: FaceGeometry; url: string }) {
  const texture = useTexture(url);

  useEffect(() => {
    const img = texture.image as HTMLImageElement | ImageBitmap | undefined;
    if (img && img.width && img.height) {
      applyCoverFit(texture, img.width, img.height, geometry.width, geometry.height);
    }
  }, [texture, geometry.width, geometry.height]);

  return (
    <mesh position={geometry.position} rotation={geometry.rotation}>
      <planeGeometry args={[geometry.width, geometry.height]} />
      <meshStandardMaterial map={texture} side={THREE.FrontSide} roughness={0.9} />
    </mesh>
  );
}

function FallbackPlane({ geometry, color }: { geometry: FaceGeometry; color: string }) {
  return (
    <mesh position={geometry.position} rotation={geometry.rotation}>
      <planeGeometry args={[geometry.width, geometry.height]} />
      <meshStandardMaterial color={color} side={THREE.FrontSide} roughness={1} />
    </mesh>
  );
}

function Face({ face, url }: { face: FaceKey; url?: string }) {
  const geometry = FACE_GEOMETRIES[face];
  const color = fallbackColorFor(face);

  if (!url) return <FallbackPlane geometry={geometry} color={color} />;

  return (
    <Suspense fallback={<FallbackPlane geometry={geometry} color={color} />}>
      <TexturedPlane geometry={geometry} url={url} />
    </Suspense>
  );
}

export function RoomShell({
  photosByFace,
}: {
  photosByFace: Partial<Record<TargetFace, string>>;
}) {
  return (
    <group>
      <Face face="wallFeatureA" url={photosByFace.wallFeatureA} />
      <Face face="wallEntry" url={photosByFace.wallEntry} />
      <Face face="wallFeatureB" url={photosByFace.wallFeatureB} />
      <Face face="wallSide" />
      <Face face="floor" url={photosByFace.floor} />
      <Face face="ceiling" url={photosByFace.ceiling} />

      {/* Doorway hint on the entry wall */}
      <mesh
        position={[0, ROOM_DIMENSIONS.height * 0.35, ROOM_DIMENSIONS.depth / 2 - 0.02]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[1.1, ROOM_DIMENSIONS.height * 0.7]} />
        <meshStandardMaterial color="#05070c" />
      </mesh>
    </group>
  );
}
