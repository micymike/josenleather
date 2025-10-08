import React from "react";
import { motion } from "framer-motion";

/**
 * 🔥 Premium Leather Loader
 * - Rotating leather belt/strap with stitching
 * - Elegant metallic buckle accent
 * - Smooth, sophisticated animation
 * - Minimal and refined aesthetic
 */

const ImpressiveLeatherLoader: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center relative overflow-hidden rounded-2xl"
      style={{
        width: 280,
        height: 280,
        background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
      }}
    >
      {/* Outer ring - leather texture */}
      <motion.div
        className="absolute"
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: "12px solid #8b6f47",
          borderTop: "12px solid #a0826d",
          boxShadow: "0 0 20px rgba(139, 111, 71, 0.3), inset 0 0 10px rgba(0,0,0,0.5)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Stitching dots */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = Math.cos(angle) * 86;
        const y = Math.sin(angle) * 86;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#d4a574",
              left: "50%",
              top: "50%",
              marginLeft: x - 2,
              marginTop: y - 2,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Center buckle/emblem */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: 60,
          height: 60,
          borderRadius: "8px",
          background: "linear-gradient(145deg, #c9a961, #a68b4a)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)",
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "4px",
            border: "3px solid #2a2a2a",
            background: "transparent",
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.div
        className="absolute bottom-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="text-sm font-semibold tracking-widest mb-1"
          style={{
            color: "#d4a574",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          CRAFTING
        </div>
        <motion.div
          className="flex gap-1 justify-center"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#8b6f47",
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Subtle ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "radial-gradient(circle at center, rgba(212, 165, 116, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ImpressiveLeatherLoader;