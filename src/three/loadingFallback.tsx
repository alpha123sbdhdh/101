export function RoomSceneLoadingFallback() {
  return (
    <div
      className="room-3d-wrap"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="spinner" />
    </div>
  );
}
