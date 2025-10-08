import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ✨ UltimateLeatherLoader
 * - Golden spiral with glowing "stitches"
 * - Subtle shimmer background
 * - Breathing rotation and shine
 * - Evokes luxury, precision, and craftsmanship
 */

const spiralPoints = (turns = 3, points = 120, scale = 30, centerX = 120, centerY = 120) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const spiral = [];
  for (let i = 0; i < points; i++) {
    const theta = (turns * 2 * Math.PI * i) / points;
    const r = scale * Math.pow(phi, theta / (2 * Math.PI));
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);
    spiral.push({ x, y });
  }
  return spiral;
};

const points = spiralPoints();

const ImpressiveLeatherLoader: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p + 1) % points.length);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  const mainColor = "#b87333";
  const accentColor = "#ffb300";
  const shadowColor = "#7c4a02";

  return (
    <div
      className="flex flex-col items-center justify-center relative overflow-hidden rounded-3xl"
      style={{
        width: 260,
        height: 260,
        background: "linear-gradient(140deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)",
        boxShadow: "0 12px 40px rgba(124,74,2,0.2)",
      }}
    >
      {/* shimmer layer */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.5) 50%, transparent 80%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* rotating spiral */}
      <motion.svg
        width={240}
        height={240}
        viewBox="0 0 240 240"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <polyline
          fill="none"
          stroke={mainColor}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          filter="url(#shadow)"
          style={{ opacity: 0.8 }}
        />
        {points.slice(0, progress + 1).map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.2 + 1.2 * Math.sin(i / 3)}
            fill={i % 2 === 0 ? accentColor : mainColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.015,
              ease: "easeInOut",
            }}
            style={{
              filter: i % 5 === 0 ? "drop-shadow(0 1px 2px #b87333aa)" : undefined,
            }}
          />
        ))}
        <ellipse cx={120} cy={90} rx={60} ry={18} fill="#fff" opacity={0.12} />
        <defs>
          <filter id="shadow" x="0" y="0" width="240" height="240">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={shadowColor} floodOpacity="0.18" />
          </filter>
        </defs>
      </motion.svg>

      {/* title */}
      <AnimatePresence>
        <motion.div
          key="title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-3 text-lg font-bold tracking-wide text-center"
          style={{
            color: mainColor,
            textShadow: "0 1px 0 #fff, 0 2px 6px #b8733340",
          }}
        >
          Crafting your masterpiece...
        </motion.div>
      </AnimatePresence>

      {/* tagline */}
      <motion.div
        className="text-xs text-center font-mono mt-1"
        style={{ color: "#7c4a02cc" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        (Guided by the Golden Ratio)
      </motion.div>
    </div>
  );
};

export default ImpressiveLeatherLoader;
