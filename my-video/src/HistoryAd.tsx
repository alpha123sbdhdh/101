import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

// ── helpers ──────────────────────────────────────────────────────────────────

function fadeIn(frame: number, start: number, duration = 20) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function slideUp(frame: number, start: number, duration = 25, px = 40) {
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return `translateY(${(1 - t) * px}px)`;
}

// ── colour palette ────────────────────────────────────────────────────────────

const GOLD = "#C9A84C";
const CREAM = "#F5EDD6";
const DARK = "#0D0D0D";
const RED = "#8B1A1A";

// ── Scene 1 : Dramatic Opener (0–120 frames) ─────────────────────────────────

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, from: 0.6, to: 1 });
  const logoOpacity = fadeIn(frame, 0, 25);
  const taglineOpacity = fadeIn(frame, 35, 20);
  const taglineTransform = slideUp(frame, 35, 25, 30);
  const subOpacity = fadeIn(frame, 55, 20);
  const subTransform = slideUp(frame, 55, 25, 20);

  // Animated ancient-map grid lines
  const gridOpacity = interpolate(frame, [0, 40], [0, 0.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, overflow: "hidden" }}>
      {/* Parchment texture overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid lines (old-map feel) */}
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i / 20) * 100}%`,
              top: 0,
              width: 1,
              height: "100%",
              background: GOLD,
            }}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(i / 12) * 100}%`,
              left: 0,
              width: "100%",
              height: 1,
              background: GOLD,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Horizontal rule */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          opacity: logoOpacity,
          transform: "translateY(-80px)",
        }}
      />

      {/* Logo / Brand */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          opacity: logoOpacity,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 52, lineHeight: 1 }}>🏛️</span>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 72,
              fontWeight: 700,
              color: GOLD,
              letterSpacing: 6,
              textShadow: `0 0 40px rgba(201,168,76,0.5)`,
            }}
          >
            HISTORIA
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 2,
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            marginTop: 8,
          }}
        />
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            color: GOLD,
            letterSpacing: 10,
            marginTop: 6,
            opacity: 0.7,
          }}
        >
          ARTIFICIAL INTELLIGENCE
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity,
          transform: taglineTransform,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 28,
            color: CREAM,
            letterSpacing: 3,
            margin: 0,
          }}
        >
          Every Question. Every Era. Every Answer.
        </p>
      </div>

      {/* Sub-copy */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOpacity,
          transform: subTransform,
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 16,
            color: "rgba(245,237,214,0.55)",
            letterSpacing: 4,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          The AI that knows all of history
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2 : Timeline Reveal (120–270 frames) ───────────────────────────────

const EVENTS = [
  { year: "3100 BC", label: "Rise of Ancient Egypt", icon: "𓂀" },
  { year: "490 BC", label: "Battle of Marathon", icon: "⚔️" },
  { year: "44 BC", label: "Fall of Julius Caesar", icon: "🏛️" },
  { year: "1066 AD", label: "Norman Conquest", icon: "🗡️" },
  { year: "1492 AD", label: "Columbus reaches America", icon: "🧭" },
  { year: "1945 AD", label: "End of World War II", icon: "🕊️" },
];

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const lineWidth = interpolate(frame, [10, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const headingOpacity = fadeIn(frame, 0, 20);
  const headingTransform = slideUp(frame, 0, 20, 20);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0D0D0D 0%, #1a1008 100%)`,
        padding: "60px 100px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          transform: headingTransform,
          marginBottom: 36,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            color: GOLD,
            letterSpacing: 6,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          6,000 years of history — at your fingertips
        </p>
      </div>

      {/* Timeline line */}
      <div
        style={{
          width: `${lineWidth}%`,
          height: 2,
          background: `linear-gradient(to right, ${GOLD}, ${RED})`,
          marginBottom: 40,
          boxShadow: `0 0 12px rgba(201,168,76,0.4)`,
        }}
      />

      {/* Events */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {EVENTS.map((ev, i) => {
          const delay = 20 + i * 12;
          const itemOpacity = fadeIn(frame, delay, 18);
          const itemTransform = slideUp(frame, delay, 20, 24);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: itemOpacity,
                transform: itemTransform,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: GOLD,
                  boxShadow: `0 0 8px ${GOLD}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 13,
                  color: GOLD,
                  minWidth: 90,
                  letterSpacing: 1,
                }}
              >
                {ev.year}
              </span>
              <span style={{ fontSize: 18 }}>{ev.icon}</span>
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 17,
                  color: CREAM,
                  opacity: 0.9,
                }}
              >
                {ev.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3 : Chat Demo (270–420 frames) ─────────────────────────────────────

const CHAT = [
  {
    role: "user" as const,
    text: "Why did the Roman Empire fall?",
    delay: 5,
  },
  {
    role: "ai" as const,
    text: "The Western Roman Empire collapsed in 476 AD due to a combination of military overstretch, economic troubles, political instability, the rise of Germanic kingdoms, and centuries of slow fragmentation...",
    delay: 30,
  },
  {
    role: "user" as const,
    text: "What could have saved it?",
    delay: 80,
  },
  {
    role: "ai" as const,
    text: "Historians debate this, but stronger border defenses, fiscal reform, and keeping the army loyal to Rome rather than to individual generals may have extended its life significantly.",
    delay: 105,
  },
];

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const headingOpacity = fadeIn(frame, 0, 20);

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a12",
        padding: "50px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top label */}
      <div style={{ opacity: headingOpacity, marginBottom: 28 }}>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 14,
            color: GOLD,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Ask Historia Anything
        </span>
      </div>

      {/* Chat bubbles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CHAT.map((msg, i) => {
          const opacity = fadeIn(frame, msg.delay, 16);
          const transform = slideUp(frame, msg.delay, 18, 16);
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                opacity,
                transform,
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    marginRight: 10,
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  🏛️
                </div>
              )}
              <div
                style={{
                  maxWidth: "68%",
                  padding: "12px 18px",
                  borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isUser
                    ? `linear-gradient(135deg, ${RED}, #6b1212)`
                    : "rgba(255,255,255,0.06)",
                  border: isUser ? "none" : `1px solid rgba(201,168,76,0.2)`,
                  fontFamily: "Arial, sans-serif",
                  fontSize: 15,
                  color: CREAM,
                  lineHeight: 1.55,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4 : Features (420–540 frames) ──────────────────────────────────────

const FEATURES = [
  { icon: "📜", title: "Primary Sources", body: "Access thousands of analysed historical documents" },
  { icon: "🌍", title: "Global Coverage", body: "Every civilisation, every continent, every century" },
  { icon: "🔍", title: "Deep Research", body: "Multi-step reasoning across interconnected events" },
  { icon: "🎓", title: "Scholar Mode", body: "Academic citations and historiographical debate" },
];

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const headingOpacity = fadeIn(frame, 5, 20);
  const headingTransform = slideUp(frame, 5, 20, 24);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0D0D0D 0%, #180808 100%)`,
        padding: "56px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ opacity: headingOpacity, transform: headingTransform, marginBottom: 40 }}>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 32,
            color: CREAM,
            margin: 0,
            fontWeight: 700,
          }}
        >
          Built for{" "}
          <span style={{ color: GOLD }}>historians</span>,{" "}
          <span style={{ color: GOLD }}>students</span>,{" "}
          and the{" "}
          <span style={{ color: GOLD }}>curious</span>.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {FEATURES.map((f, i) => {
          const delay = 25 + i * 15;
          const opacity = fadeIn(frame, delay, 18);
          const transform = slideUp(frame, delay, 20, 20);
          return (
            <div
              key={i}
              style={{
                opacity,
                transform,
                padding: "24px 28px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(201,168,76,0.18)`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 30 }}>{f.icon}</span>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 18,
                  color: GOLD,
                  fontWeight: 700,
                }}
              >
                {f.title}
              </span>
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 14,
                  color: "rgba(245,237,214,0.7)",
                  lineHeight: 1.5,
                }}
              >
                {f.body}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5 : CTA (540–660 frames) ───────────────────────────────────────────

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = interpolate(
    Math.sin((frame / fps) * 2 * Math.PI * 0.4),
    [-1, 1],
    [0.0, 0.12]
  );

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 70 }, from: 0.8, to: 1 });
  const logoOpacity = fadeIn(frame, 5, 20);
  const line1Opacity = fadeIn(frame, 25, 20);
  const line1Transform = slideUp(frame, 25, 22, 28);
  const line2Opacity = fadeIn(frame, 45, 20);
  const line2Transform = slideUp(frame, 45, 22, 28);
  const btnOpacity = fadeIn(frame, 68, 20);
  const btnScale = spring({ frame: Math.max(frame - 68, 0), fps, config: { damping: 14, stiffness: 90 }, from: 0.85, to: 1 });
  const urlOpacity = fadeIn(frame, 90, 20);

  return (
    <AbsoluteFill
      style={{
        background: DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,${bgPulse}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 60,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: 8,
            textShadow: `0 0 30px rgba(201,168,76,0.6)`,
          }}
        >
          HISTORIA AI
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: line1Opacity,
          transform: line1Transform,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 36,
            color: CREAM,
            margin: 0,
            fontWeight: 700,
          }}
        >
          Unlock the full story of humanity.
        </p>
      </div>

      {/* Sub-headline */}
      <div
        style={{
          opacity: line2Opacity,
          transform: line2Transform,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 18,
            color: "rgba(245,237,214,0.6)",
            margin: 0,
            letterSpacing: 2,
          }}
        >
          Start exploring — free for 14 days.
        </p>
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: btnOpacity,
          transform: `scale(${btnScale})`,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            padding: "16px 52px",
            borderRadius: 50,
            background: `linear-gradient(135deg, ${GOLD}, #a07830)`,
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: DARK,
            letterSpacing: 2,
            boxShadow: `0 4px 30px rgba(201,168,76,0.4)`,
          }}
        >
          TRY HISTORIA AI FREE →
        </div>
      </div>

      {/* URL */}
      <div style={{ opacity: urlOpacity }}>
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 14,
            color: "rgba(245,237,214,0.35)",
            letterSpacing: 3,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          historiaai.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ── Root composition ──────────────────────────────────────────────────────────

export const HistoryAdVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={120}>
        <Scene1 />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <Scene2 />
      </Sequence>
      <Sequence from={270} durationInFrames={150}>
        <Scene3 />
      </Sequence>
      <Sequence from={420} durationInFrames={120}>
        <Scene4 />
      </Sequence>
      <Sequence from={540} durationInFrames={120}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
