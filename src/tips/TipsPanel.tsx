import { motion } from "framer-motion";
import { useTips } from "./useTips";
import type { RoomType } from "../rooms/roomTypes";
import { LoadingScreen } from "../components/LoadingScreen";

export function TipsPanel({ roomType, photoCount }: { roomType: RoomType; photoCount: number }) {
  const { data, isLoading, isError } = useTips(roomType, photoCount);

  if (isLoading) return <LoadingScreen label="Getting tips…" />;
  if (isError || !data) return <p className="error-text">Couldn't load tips right now.</p>;

  return (
    <div className="tips-list">
      {data.tips.map((tip, i) => (
        <motion.div
          key={tip.id}
          className="card tip-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
        >
          <span className="tip-emoji">💡</span>
          <span>{tip.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
