import { useRef } from "react";
import type { VantagePoint } from "../rooms/roomDefinitions";

interface Props {
  vantagePoint: VantagePoint;
  photoUrl: string | null;
  uploading: boolean;
  onCapture: (file: File) => void;
  onRetake: () => void;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}

export function CaptureStep({
  vantagePoint,
  photoUrl,
  uploading,
  onCapture,
  onRetake,
  onNext,
  onSkip,
  isLast,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
    e.target.value = "";
  }

  return (
    <div className="capture-shell">
      <div>
        <h2 className="page-heading" style={{ fontSize: 22 }}>
          {vantagePoint.promptTitle}
        </h2>
        <p className="page-sub" style={{ marginBottom: 0 }}>
          {vantagePoint.promptSubtitle}
        </p>
      </div>

      <div className="capture-photo-frame">
        {photoUrl ? (
          <img src={photoUrl} alt={vantagePoint.promptTitle} />
        ) : uploading ? (
          <div className="spinner" />
        ) : (
          <span style={{ fontSize: 40, opacity: 0.4 }}>📷</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {!photoUrl ? (
        <button
          className="capture-icon-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Capture photo"
        >
          📸
        </button>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onRetake} disabled={uploading}>
            Retake
          </button>
          <button className="btn btn-primary" onClick={onNext} disabled={uploading}>
            {isLast ? "Finish room" : "Next"}
          </button>
        </div>
      )}

      {!photoUrl && (
        <button className="link-inline" style={{ background: "none", border: "none" }} onClick={onSkip}>
          Skip this angle
        </button>
      )}
    </div>
  );
}
