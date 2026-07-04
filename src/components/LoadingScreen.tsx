export function LoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <div>{label}</div>
    </div>
  );
}
