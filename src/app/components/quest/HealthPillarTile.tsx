import { motion } from "motion/react";
import { LucideIcon, Lock } from "lucide-react";

interface HealthPillarTileProps {
  icon: LucideIcon;
  title: string;
  titleNavajo: string;
  progress: number;
  color: string;
  level?: number;
  locked?: boolean;
  onClick?: () => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// For yellow tiles — use dark text to maintain WCAG contrast
function getTextColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#3b0a52" : hexColor;
}

export function HealthPillarTile({
  icon: Icon,
  title,
  titleNavajo,
  progress,
  color,
  level = 1,
  locked = false,
  onClick,
}: HealthPillarTileProps) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (progress / 100) * circumference;
  const displayColor = locked ? "rgba(59,82,139,0.25)" : color;
  const progressTextColor = getTextColor(color);

  return (
    <motion.button
      whileHover={locked ? {} : { scale: 1.05, y: -4 }}
      whileTap={locked ? {} : { scale: 0.96 }}
      onClick={locked ? undefined : onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem 0.875rem 1rem",
        borderRadius: "1.5rem",
        background: locked
          ? "rgba(255,255,255,0.60)"
          : `linear-gradient(160deg, ${hexToRgba(color, 0.13)} 0%, rgba(255,255,255,0.96) 55%)`,
        border: locked
          ? "1.5px solid rgba(59,82,139,0.10)"
          : `1.5px solid ${hexToRgba(color, 0.28)}`,
        boxShadow: locked
          ? "none"
          : `0 6px 20px ${hexToRgba(color, 0.18)}, 0 2px 6px rgba(0,0,0,0.04)`,
        cursor: locked ? "default" : "pointer",
        width: "100%",
        overflow: "hidden",
        opacity: locked ? 0.6 : 1,
      }}
    >
      {/* Solid top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: locked ? "rgba(59,82,139,0.15)" : color,
        borderRadius: "1.5rem 1.5rem 0 0",
      }} />

      {/* Level badge — top left */}
      <div style={{
        position: "absolute", top: 10, left: 10,
        fontSize: "0.6rem", fontWeight: 800,
        color: locked ? "rgba(59,82,139,0.30)" : hexToRgba(color, 0.70),
        letterSpacing: "0.04em",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        LVL {level}
      </div>

      {/* Decorative circle — bottom right atmosphere */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: -18, right: -18,
        width: 70, height: 70, borderRadius: "50%",
        background: hexToRgba(color, 0.07),
        pointerEvents: "none",
      }} />

      {/* Progress ring */}
      <div style={{ position: "relative", marginBottom: "0.65rem", marginTop: "0.25rem" }}>
        <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="34" cy="34" r="28"
            stroke={hexToRgba(color, 0.14)} strokeWidth="5" fill="none"
          />
          <circle cx="34" cy="34" r="28"
            stroke={displayColor} strokeWidth="5" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={locked ? circumference : offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {locked
            ? <Lock size={22} style={{ color: "rgba(59,82,139,0.30)" }} />
            : <Icon size={24} strokeWidth={2} style={{ color }} />
          }
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.85rem", fontWeight: 800,
        color: "var(--color-title)",
        marginBottom: "0.1rem",
      }}>
        {title}
      </h3>

      {/* Navajo name */}
      <p style={{
        fontSize: "0.65rem", fontStyle: "italic",
        color: "var(--color-subtitle)",
        marginBottom: "0.45rem",
      }}>
        {titleNavajo}
      </p>

      {/* Progress % — uses contrast-safe color for yellow */}
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.4rem", fontWeight: 900,
        color: locked ? "rgba(59,82,139,0.25)" : progressTextColor,
        lineHeight: 1,
      }}>
        {locked ? "—" : `${progress}%`}
      </span>
    </motion.button>
  );
}
