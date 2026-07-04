export function CaptureProgress({
  total,
  currentIndex,
  doneFlags,
}: {
  total: number;
  currentIndex: number;
  doneFlags: boolean[];
}) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "progress-dot" +
            (i === currentIndex ? " active" : "") +
            (doneFlags[i] ? " done" : "")
          }
        />
      ))}
    </div>
  );
}
