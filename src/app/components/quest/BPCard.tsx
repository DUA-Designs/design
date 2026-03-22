import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";

interface BPCardProps {
  systolic: number;
  diastolic: number;
  trend?: "up" | "down" | "stable";
  timestamp?: string;
}

// ─── AHA-correct BP status boundaries ────────────────────────────────────────
// Normal:   systolic < 120  AND diastolic < 80
// Elevated: systolic 120-129 AND diastolic < 80
// Stage 1:  systolic 130-139 OR  diastolic 80-89
// Stage 2:  systolic >= 140  OR  diastolic >= 90
// Mapped to Viridis in correct severity order: green → teal → blue → purple
function getBPStatus(sys: number, dia: number) {
  if (sys < 120 && dia < 80) return {
    label: "Normal", navajo: "Hózhó",
    accent: "#5ec962", bg: "rgba(94,201,98,0.10)",
    cardBg: "linear-gradient(135deg, rgba(94,201,98,0.09) 0%, rgba(255,255,255,0.95) 100%)",
    border: "rgba(94,201,98,0.35)", text: "#1a6b1a",
  };
  if (sys <= 129 && dia < 80) return {
    label: "Elevated", navajo: "Nitsąąs",
    accent: "#21918c", bg: "rgba(33,145,140,0.10)",
    cardBg: "linear-gradient(135deg, rgba(33,145,140,0.09) 0%, rgba(255,255,255,0.95) 100%)",
    border: "rgba(33,145,140,0.35)", text: "#1a7571",
  };
  if (sys <= 139 || (dia >= 80 && dia <= 89)) return {
    label: "Stage 1", navajo: "Háálá",
    accent: "#3b528b", bg: "rgba(59,82,139,0.10)",
    cardBg: "linear-gradient(135deg, rgba(59,82,139,0.08) 0%, rgba(255,255,255,0.95) 100%)",
    border: "rgba(59,82,139,0.35)", text: "#3b528b",
  };
  return {
    label: "Stage 2", navajo: "Nahwiilbįįhí",
    accent: "#440154", bg: "rgba(68,1,84,0.10)",
    cardBg: "linear-gradient(135deg, rgba(68,1,84,0.08) 0%, rgba(255,255,255,0.95) 100%)",
    border: "rgba(68,1,84,0.30)", text: "#440154",
  };
}

export function BPCard({ systolic, diastolic, trend = "stable", timestamp }: BPCardProps) {
  const s = getBPStatus(systolic, diastolic);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      style={{
        background: s.cardBg,
        border: `1px solid ${s.border}`,
        borderLeft: `5px solid ${s.accent}`,
        borderRadius: "1.5rem",
        padding: "1.4rem 1.5rem",
        boxShadow: `0 8px 28px ${s.bg}, 0 2px 8px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ padding: "0.5rem", borderRadius: "0.75rem", background: s.bg, flexShrink: 0 }}>
            <Heart size={18} style={{ color: s.accent, fill: s.accent }} />
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-title)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Blood Pressure
            </p>
            {/* <p style={{ fontSize: "0.7rem", color: "var(--color-subtitle)", fontStyle: "italic" }}>
              Díí dził yishłééh
            </p> */}
          </div>
        </div>
        <div style={{
          padding: "0.25rem 0.8rem", borderRadius: "9999px",
          background: s.bg, border: `1.5px solid ${s.border}`,
          fontSize: "0.72rem", fontWeight: 700, color: s.text,
        }}>
          {s.label}
          {/* · {s.navajo} */}
        </div>
      </div>

      {/* Huge BP numbers */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem", marginBottom: "0.65rem" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 12vw, 4rem)", fontWeight: 900, color: s.accent, lineHeight: 1 }}>
          {systolic}
        </span>
        <span style={{ fontSize: "1.8rem", fontWeight: 300, color: "var(--color-placeholder)", margin: "0 0.15rem" }}>/</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 12vw, 4rem)", fontWeight: 900, color: s.accent, lineHeight: 1 }}>
          {diastolic}
        </span>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-placeholder)", marginLeft: "0.5rem", alignSelf: "flex-end", paddingBottom: "0.5rem" }}>
          mmHg
        </span>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <TrendIcon size={13} style={{ color: s.accent }} />
          <span style={{ fontSize: "0.75rem", color: "var(--color-placeholder)", fontWeight: 500 }}>{timestamp}</span>
        </div>
      )}
    </motion.div>
  );
}
