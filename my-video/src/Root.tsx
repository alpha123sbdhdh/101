import "./index.css";
import { Composition } from "remotion";
import { HistoryAdVideo } from "./HistoryAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HistoryAd"
        component={HistoryAdVideo}
        durationInFrames={660}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
