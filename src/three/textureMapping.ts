import * as THREE from "three";
import type { TargetFace } from "../rooms/roomDefinitions";

export const ROOM_DIMENSIONS = { width: 6, height: 3, depth: 6 };

export const FALLBACK_WALL_COLOR = "#232c42";
export const FALLBACK_FLOOR_COLOR = "#1b2233";
export const FALLBACK_CEILING_COLOR = "#242c40";

export interface FaceGeometry {
  face: TargetFace | "wallSide";
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

const { width: W, height: H, depth: D } = ROOM_DIMENSIONS;

/**
 * The five vantage points map onto a simple box room: the entry wall (with a
 * doorway cutout) sits opposite the back wall, one side wall is the second
 * "feature" photo, floor/ceiling are their own planes, and the remaining side
 * wall has no captured photo so it always renders a neutral fallback.
 */
export const FACE_GEOMETRIES: Record<TargetFace | "wallSide", FaceGeometry> = {
  wallFeatureA: {
    face: "wallFeatureA",
    width: W,
    height: H,
    position: [0, H / 2, -D / 2],
    rotation: [0, 0, 0],
  },
  wallEntry: {
    face: "wallEntry",
    width: W,
    height: H,
    position: [0, H / 2, D / 2],
    rotation: [0, Math.PI, 0],
  },
  wallFeatureB: {
    face: "wallFeatureB",
    width: D,
    height: H,
    position: [-W / 2, H / 2, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  wallSide: {
    face: "wallSide",
    width: D,
    height: H,
    position: [W / 2, H / 2, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  floor: {
    face: "floor",
    width: W,
    height: D,
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  ceiling: {
    face: "ceiling",
    width: W,
    height: D,
    position: [0, H, 0],
    rotation: [Math.PI / 2, 0, 0],
  },
};

/** "Cover" fit (like CSS object-fit: cover): crop the texture to fill the
 * plane without distorting the photo's aspect ratio. */
export function applyCoverFit(texture: THREE.Texture, imgWidth: number, imgHeight: number, planeWidth: number, planeHeight: number) {
  const imageAspect = imgWidth / imgHeight;
  const planeAspect = planeWidth / planeHeight;

  texture.center.set(0.5, 0.5);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  if (imageAspect > planeAspect) {
    const repeatX = planeAspect / imageAspect;
    texture.repeat.set(repeatX, 1);
    texture.offset.set((1 - repeatX) / 2, 0);
  } else {
    const repeatY = imageAspect / planeAspect;
    texture.repeat.set(1, repeatY);
    texture.offset.set(0, (1 - repeatY) / 2);
  }
  texture.needsUpdate = true;
}
