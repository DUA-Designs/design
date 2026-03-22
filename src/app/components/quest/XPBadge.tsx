import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface XPBadgeProps {
  xp: number;
  showAnimation?: boolean;
}

export function XPBadge({ xp, showAnimation = false }: XPBadgeProps) {
  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : false}
      animate={showAnimation ? { scale: 1, opacity: 1 } : {}}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.35rem",
        padding: "0.4rem 0.875rem",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
        boxShadow: "0 4px 14px rgba(253,231,37,0.38)",
      }}
    >
      <Sparkles size={15} style={{ color: "#3b0a52" }} />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem", fontWeight: 800,
        color: "#3b0a52", letterSpacing: "0.02em",
      }}>
        {xp.toLocaleString()} XP
      </span>
    </motion.div>
  );
}
