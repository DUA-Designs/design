import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── 7-day mock history — in production replace with real data ────────────────
const HISTORY = [
  { day: "Mon", sys: 122, dia: 82 },
  { day: "Tue", sys: 118, dia: 78 },
  { day: "Wed", sys: 135, dia: 88 },
  { day: "Thu", sys: 125, dia: 80 },
  { day: "Fri", sys: 119, dia: 76 },
  { day: "Sat", sys: 128, dia: 84 },
  { day: "Sun", sys: 120, dia: 80 },
];

// ─── Mood options — visual emoji, no numeric scale ────────────────────────────
const MOODS = [
  { emoji: "😴", label: "Tired",    value: "tired"    },
  { emoji: "😔", label: "Low",      value: "low"      },
  { emoji: "😐", label: "Okay",     value: "okay"     },
  { emoji: "🙂", label: "Good",     value: "good"     },
  { emoji: "😄", label: "Great",    value: "great"    },
];

// ─── Viridis BP status — same logic as BPCard ─────────────────────────────────
function getBPColor(sys: number, dia: number): string {
  if (sys < 120 && dia < 80)  return "#5ec962";
  if (sys <= 129 && dia < 80) return "#21918c";
  if (sys <= 139 || dia <= 89) return "#3b528b";
  return "#440154";
}

function getBPLabel(sys: number, dia: number): string {
  if (sys < 120 && dia < 80)  return "Normal";
  if (sys <= 129 && dia < 80) return "Elevated";
  if (sys <= 139 || dia <= 89) return "Stage 1";
  return "Stage 2";
}

// ─── Chart bar height — normalize to 60px max ────────────────────────────────
const MAX_SYS = Math.max(...HISTORY.map(d => d.sys));
const MIN_SYS = Math.min(...HISTORY.map(d => d.sys));

function barHeight(sys: number): number {
  const range = MAX_SYS - MIN_SYS || 1;
  return 20 + ((sys - MIN_SYS) / range) * 44;
}

export function BPLogScreen() {
  const navigate = useNavigate();

  const [systolic,  setSystolic]  = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [mood,      setMood]      = useState<string | null>(null);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);

  const sys = parseInt(systolic)  || 0;
  const dia = parseInt(diastolic) || 0;
  const hasReading = sys > 0 && dia > 0;
  const bpColor    = hasReading ? getBPColor(sys, dia)  : "#3b528b";
  const bpLabel    = hasReading ? getBPLabel(sys, dia)  : null;

  const handleSave = async () => {
    if (!hasReading) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg-gradient)",
      backgroundColor: "var(--color-bg)",
      fontFamily: "'DM Sans', sans-serif",
      paddingBottom: "6rem",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(20px) saturate(1.3)",
          WebkitBackdropFilter: "blur(20px) saturate(1.3)",
          borderBottom: "1px solid rgba(33,145,140,0.13)",
          borderRadius: "0 0 1.75rem 1.75rem",
          padding: "3rem 1.4rem 1.2rem",
          boxShadow: "0 4px 20px rgba(59,82,139,0.07)",
          marginBottom: "1.5rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <button
              onClick={() => navigate("/home")}
              style={{ padding: "0.5rem", background: "rgba(59,82,139,0.07)", border: "none", borderRadius: "0.75rem", cursor: "pointer", display: "flex" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--color-title)" }} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-title)", lineHeight: 1.15, marginBottom: "0.1rem" }}>
                BP Journal
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                Jáádí bee haz'ą́ — Today's entry
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Journal entry card ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${bpColor}30`,
              borderLeft: `5px solid ${bpColor}`,
              borderRadius: "1.5rem",
              padding: "1.75rem 1.5rem",
              boxShadow: `0 8px 28px ${bpColor}15, 0 2px 8px rgba(0,0,0,0.04)`,
              marginBottom: "1.25rem",
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}
          >
            {/* Date stamp — journal feel */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
              {bpLabel && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    fontSize: "0.72rem", fontWeight: 700,
                    color: bpColor,
                    background: `${bpColor}15`,
                    border: `1.5px solid ${bpColor}40`,
                    padding: "0.2rem 0.7rem", borderRadius: "9999px",
                  }}
                >
                  {bpLabel}
                </motion.span>
              )}
            </div>

            {/* ── Big number inputs ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>

              {/* Systolic */}
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Systolic
                </p>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="120"
                  value={systolic}
                  onChange={e => setSystolic(e.target.value)}
                  min={60} max={250}
                  style={{
                    width: "100%",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.4rem, 8vw, 3rem)",
                    fontWeight: 900,
                    color: bpColor,
                    textAlign: "center",
                    background: `${bpColor}08`,
                    border: `2px solid ${bpColor}30`,
                    borderRadius: "1rem",
                    padding: "0.75rem 0.5rem",
                    outline: "none",
                    transition: "border-color 0.3s, background 0.3s, color 0.3s",
                    // Remove number input arrows
                    MozAppearance: "textfield",
                  }}
                  onFocus={e => { e.target.style.borderColor = bpColor; e.target.style.boxShadow = `0 0 0 3px ${bpColor}20`; }}
                  onBlur={e  => { e.target.style.borderColor = `${bpColor}30`; e.target.style.boxShadow = "none"; }}
                />
                <p style={{ fontSize: "0.7rem", color: "var(--color-placeholder)", marginTop: "0.3rem" }}>mmHg</p>
              </div>

              {/* Divider */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", paddingTop: "1.2rem" }}>
                <Heart size={16} style={{ color: bpColor, transition: "color 0.4s" }} fill={bpColor} />
                <span style={{ fontSize: "1.8rem", fontWeight: 300, color: "var(--color-placeholder)", lineHeight: 1 }}>/</span>
              </div>

              {/* Diastolic */}
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Diastolic
                </p>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="80"
                  value={diastolic}
                  onChange={e => setDiastolic(e.target.value)}
                  min={40} max={160}
                  style={{
                    width: "100%",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.4rem, 8vw, 3rem)",
                    fontWeight: 900,
                    color: bpColor,
                    textAlign: "center",
                    background: `${bpColor}08`,
                    border: `2px solid ${bpColor}30`,
                    borderRadius: "1rem",
                    padding: "0.75rem 0.5rem",
                    outline: "none",
                    transition: "border-color 0.3s, background 0.3s, color 0.3s",
                    MozAppearance: "textfield",
                  }}
                  onFocus={e => { e.target.style.borderColor = bpColor; e.target.style.boxShadow = `0 0 0 3px ${bpColor}20`; }}
                  onBlur={e  => { e.target.style.borderColor = `${bpColor}30`; e.target.style.boxShadow = "none"; }}
                />
                <p style={{ fontSize: "0.7rem", color: "var(--color-placeholder)", marginTop: "0.3rem" }}>mmHg</p>
              </div>
            </div>

            {/* ── Mood check — emoji, no numbers ── */}
            <div style={{ marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "0.75rem", letterSpacing: "0.02em" }}>
                How are you feeling?
                <span style={{ fontStyle: "italic", fontWeight: 500, color: "var(--color-subtitle)", marginLeft: "0.4rem" }}>
                  Háálá lá nízin?
                </span>
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem" }}>
                {MOODS.map((m) => {
                  const isSelected = mood === m.value;
                  return (
                    <motion.button
                      key={m.value}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setMood(m.value)}
                      style={{
                        flex: 1,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "0.25rem",
                        padding: "0.6rem 0.25rem",
                        borderRadius: "1rem",
                        background: isSelected ? `${bpColor}12` : "rgba(59,82,139,0.04)",
                        border: isSelected ? `1.5px solid ${bpColor}50` : "1.5px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{m.emoji}</span>
                      <span style={{
                        fontSize: "0.6rem", fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? bpColor : "var(--color-placeholder)",
                        transition: "color 0.2s",
                      }}>
                        {m.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Save button — rewarding, celebratory ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.88, opacity: 0 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.75rem",
                    padding: "1.1rem",
                    borderRadius: "1.35rem",
                    background: "linear-gradient(135deg, rgba(94,201,98,0.15) 0%, rgba(33,145,140,0.12) 100%)",
                    border: "1.5px solid rgba(94,201,98,0.40)",
                  }}
                >
                  <CheckCircle2 size={22} style={{ color: "#5ec962" }} />
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#1a6b1a" }}>
                      Saved! Yá'át'ééh! 🎉
                    </p>
                    <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#1a7571" }}>
                      Nídiilnish — Well done, keep it up!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="save"
                  whileHover={hasReading ? { y: -2, boxShadow: "0 10px 32px rgba(253,231,37,0.50), 0 4px 12px rgba(0,0,0,0.07)" } : {}}
                  whileTap={hasReading ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={!hasReading || saving}
                  style={{
                    width: "100%", padding: "1.1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem", fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: hasReading ? "#3b0a52" : "rgba(59,82,139,0.35)",
                    background: hasReading
                      ? "linear-gradient(135deg, #fde725 0%, #5ec962 100%)"
                      : "rgba(59,82,139,0.06)",
                    border: hasReading ? "none" : "1.5px solid rgba(59,82,139,0.12)",
                    borderRadius: "1.35rem",
                    cursor: hasReading ? "pointer" : "not-allowed",
                    boxShadow: hasReading ? "0 6px 24px rgba(253,231,37,0.35)" : "none",
                    transition: "all 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  }}
                >
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid #3b0a52", borderTopColor: "transparent" }}
                    />
                  ) : (
                    <>
                      <Heart size={18} fill="#3b0a52" style={{ color: "#3b0a52" }} />
                      Log Reading
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── 7-day chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.5rem",
              padding: "1.4rem 1.25rem 1.1rem",
              boxShadow: "0 4px 18px rgba(59,82,139,0.07)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-title)" }}>
                7-Day History
              </h3>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-subtitle)", fontStyle: "italic" }}>
                Naakits'áadah yiskąąjį'
              </span>
            </div>

            {/* Bar chart — Viridis colored by BP status */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "0.35rem", height: 80, marginBottom: "0.5rem" }}>
              {HISTORY.map((entry, i) => {
                const color = getBPColor(entry.sys, entry.dia);
                const height = barHeight(entry.sys);
                const isToday = i === HISTORY.length - 1;
                return (
                  <div key={entry.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                    {/* Systolic value above bar */}
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, color, opacity: isToday ? 1 : 0.85 }}>
                      {entry.sys}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: "backOut" }}
                      style={{
                        width: "100%",
                        borderRadius: "0.4rem 0.4rem 0.25rem 0.25rem",
                        background: isToday
                          ? `linear-gradient(to top, ${color}ee, ${color}bb)`
                          : color,
                        opacity: isToday ? 1 : 0.62,
                        border: isToday ? `2px solid ${color}` : "none",
                        boxShadow: isToday ? `0 4px 12px ${color}50` : "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Day labels */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.35rem" }}>
              {HISTORY.map((entry, i) => {
                const isToday = i === HISTORY.length - 1;
                return (
                  <div key={entry.day} style={{ flex: 1, textAlign: "center" }}>
                    <span style={{
                      fontSize: "0.62rem", fontWeight: isToday ? 700 : 500,
                      color: isToday ? "var(--color-title)" : "var(--color-placeholder)",
                    }}>
                      {isToday ? "Now" : entry.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: "flex", justifyContent: "center", gap: "1rem",
              marginTop: "0.875rem", paddingTop: "0.875rem",
              borderTop: "1px solid rgba(59,82,139,0.08)",
              flexWrap: "wrap",
            }}>
              {[
                { label: "Normal",   color: "#5ec962" },
                { label: "Elevated", color: "#21918c" },
                { label: "Stage 1",  color: "#3b528b" },
                { label: "Stage 2",  color: "#440154" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: "0.62rem", fontWeight: 500, color: "var(--color-placeholder)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}