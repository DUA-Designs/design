import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Minus, CheckCircle2, Zap } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Activity tiles — real daily life activities, not gym-only ───────────────
// Viridis colors assigned by intensity level (light → vigorous)
// This is sequential data encoding — intensity maps to the scale
const ACTIVITIES = [
  { key: "walking",   label: "Walking",   navajo: "Naashnish",    emoji: "🚶", color: "#3b528b", intensity: "Light"    },
  { key: "housework", label: "Housework", navajo: "Hooghan",      emoji: "🏠", color: "#3b528b", intensity: "Light"    },
  { key: "gardening", label: "Gardening", navajo: "Nahalzhish",   emoji: "🌱", color: "#21918c", intensity: "Moderate" },
  { key: "farming",   label: "Farm Work", navajo: "Dá'ák'eh",     emoji: "🌾", color: "#21918c", intensity: "Moderate" },
  { key: "running",   label: "Running",   navajo: "Naaltsoos",    emoji: "🏃", color: "#1a5c1a", intensity: "Vigorous" },
  { key: "swimming",  label: "Swimming",  navajo: "Tó naashnish", emoji: "🏊", color: "#1a5c1a", intensity: "Vigorous" },
  { key: "cycling",   label: "Cycling",   navajo: "Dziil",        emoji: "🚴", color: "#1a5c1a", intensity: "Vigorous" },
  { key: "dancing",   label: "Dancing",   navajo: "Nda',",        emoji: "💃", color: "#1a7571", intensity: "Moderate" },
  { key: "stretching",label: "Stretching",navajo: "Naalnish",     emoji: "🧘", color: "#440154", intensity: "Gentle"   },
  { key: "other",     label: "Other",     navajo: "Łaʼ",          emoji: "⚡", color: "#440154", intensity: "Any"      },
];

// ─── Motivational notes — connect movement directly to BP ────────────────────
const MOVEMENT_NOTES = [
  {
    note: "Even 20 minutes of walking today can lower your blood pressure for the next 12 hours.",
    navajo: "Naashnish bee jáádí hózhó nahasdlíí'.",
  },
  {
    note: "Housework and farm work count just as much as a gym session. Movement is movement.",
    navajo: "Hooghan dóó dá'ák'eh — hózhó naanish.",
  },
  {
    note: "Regular movement helps your heart pump more efficiently, gradually lowering your resting BP.",
    navajo: "Jáádí bee hózhó nahasdlíí' — nizhóní.",
  },
  {
    note: "Dancing with family is one of the most joyful ways to keep your heart healthy.",
    navajo: "Nda' dóó k'é — jáádí bee hózhó.",
  },
  {
    note: "Gentle stretching in the morning activates your circulation and sets a healthy tone for the day.",
    navajo: "Abíní naalnish — hózhó nahasdlíí'.",
  },
];

// ─── Duration presets — quick tap options ────────────────────────────────────
const DURATION_PRESETS = [15, 20, 30, 45, 60];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── XP earned based on duration and intensity ───────────────────────────────
function calcXP(activities: string[], minutes: number): number {
  if (!activities.length || !minutes) return 0;
  const hasVigorous = activities.some(a =>
    ACTIVITIES.find(act => act.key === a)?.intensity === "Vigorous"
  );
  const base = hasVigorous ? 2 : 1;
  return Math.min(Math.round((minutes / 10) * base) * 10, 100);
}

export function ExerciseLogScreen() {
  const navigate   = useNavigate();
  const noteIndex  = useState(() => Math.floor(Math.random() * MOVEMENT_NOTES.length))[0];
  const note       = MOVEMENT_NOTES[noteIndex];

  const [selected,  setSelected]  = useState<string[]>([]);
  const [duration,  setDuration]  = useState<number>(30);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);

  const hasActivity = selected.length > 0;
  const xpEarned    = calcXP(selected, duration);

  const toggleActivity = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const adjustDuration = (delta: number) => {
    setDuration(prev => Math.min(Math.max(prev + delta, 5), 180));
  };

  const handleSave = async () => {
    if (!hasActivity) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          marginBottom: "1.25rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(33,145,140,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <button
                onClick={() => navigate("/home")}
                style={{ padding: "0.5rem", background: "rgba(59,82,139,0.07)", border: "none", borderRadius: "0.75rem", cursor: "pointer", display: "flex" }}
              >
                <ArrowLeft size={20} style={{ color: "var(--color-title)" }} />
              </button>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-title)", lineHeight: 1.15, marginBottom: "0.1rem" }}>
                  Movement Log
                </h1>
                <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                  Na'ashch'ąąd — What did you do today?
                </p>
              </div>
            </div>

            {/* XP preview badge */}
            {hasActivity && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.4rem 0.875rem", borderRadius: "9999px",
                  background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                  boxShadow: "0 3px 12px rgba(253,231,37,0.32)",
                }}
              >
                <Zap size={13} style={{ color: "#3b0a52" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 800, color: "#3b0a52" }}>
                  +{xpEarned} XP
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Activity tiles — large, tappable, no typing ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.38 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.875rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)" }}>
                What did you do?
              </h2>
              <span style={{ fontSize: "0.7rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                Select all that apply
              </span>
            </div>

            {/* 2-column tile grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {ACTIVITIES.map((activity, i) => {
                const isSelected = selected.includes(activity.key);
                return (
                  <motion.button
                    key={activity.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.28 }}
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleActivity(activity.key)}
                    style={{
                      position: "relative",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "0.4rem",
                      padding: "1.1rem 0.75rem",
                      borderRadius: "1.25rem",
                      background: isSelected
                        ? `linear-gradient(160deg, ${hexToRgba(activity.color, 0.14)} 0%, rgba(255,255,255,0.96) 60%)`
                        : "rgba(255,255,255,0.88)",
                      border: isSelected
                        ? `2px solid ${hexToRgba(activity.color, 0.55)}`
                        : "1.5px solid rgba(59,82,139,0.13)",
                      boxShadow: isSelected
                        ? `0 6px 18px ${hexToRgba(activity.color, 0.18)}`
                        : "0 3px 10px rgba(59,82,139,0.06)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top color accent strip */}
                    {isSelected && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 3,
                        background: activity.color, borderRadius: "1.25rem 1.25rem 0 0",
                      }} />
                    )}

                    {/* Check mark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10 }}
                        style={{ position: "absolute", top: "0.6rem", right: "0.6rem" }}
                      >
                        <CheckCircle2 size={14} style={{ color: activity.color }} />
                      </motion.div>
                    )}

                    <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{activity.emoji}</span>

                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem", fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? activity.color : "var(--color-title)",
                      transition: "color 0.2s",
                    }}>
                      {activity.label}
                    </span>

                    <span style={{
                      fontSize: "0.62rem", fontStyle: "italic",
                      color: isSelected ? hexToRgba(activity.color, 0.80) : "var(--color-placeholder)",
                      transition: "color 0.2s",
                    }}>
                      {activity.navajo}
                    </span>

                    {/* Intensity pill */}
                    <span style={{
                      fontSize: "0.56rem", fontWeight: 700,
                      padding: "0.15rem 0.45rem", borderRadius: "9999px",
                      background: hexToRgba(activity.color, isSelected ? 0.15 : 0.08),
                      color: activity.color,
                      letterSpacing: "0.03em",
                    }}>
                      {activity.intensity}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Duration — simple, no stopwatch ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.35rem",
              padding: "1.4rem 1.5rem",
              boxShadow: "0 4px 18px rgba(59,82,139,0.07)",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "1.1rem" }}>
              How long?
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, fontStyle: "italic", color: "var(--color-subtitle)", marginLeft: "0.5rem" }}>
                Díí — minutes
              </span>
            </h2>

            {/* Duration stepper */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", marginBottom: "1.1rem" }}>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                onClick={() => adjustDuration(-5)}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(59,82,139,0.08)",
                  border: "1.5px solid rgba(59,82,139,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Minus size={18} style={{ color: "var(--color-title)" }} />
              </motion.button>

              <div style={{ textAlign: "center" }}>
                <motion.span
                  key={duration}
                  initial={{ scale: 0.85, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3rem", fontWeight: 900,
                    color: "var(--color-title)", lineHeight: 1,
                    display: "block",
                  }}
                >
                  {duration}
                </motion.span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-placeholder)" }}>
                  minutes
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                onClick={() => adjustDuration(5)}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(59,82,139,0.08)",
                  border: "1.5px solid rgba(59,82,139,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Plus size={18} style={{ color: "var(--color-title)" }} />
              </motion.button>
            </div>

            {/* Quick preset pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {DURATION_PRESETS.map(mins => {
                const isActive = duration === mins;
                return (
                  <motion.button
                    key={mins}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setDuration(mins)}
                    style={{
                      padding: "0.3rem 0.875rem", borderRadius: "9999px",
                      background: isActive ? "rgba(26,117,113,0.10)" : "rgba(59,82,139,0.05)",
                      border: isActive ? "1.5px solid rgba(26,117,113,0.40)" : "1.5px solid rgba(59,82,139,0.12)",
                      fontSize: "0.78rem", fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#1a7571" : "var(--color-placeholder)",
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    {mins} min
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Save button ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.75rem", padding: "1.1rem",
                    borderRadius: "1.35rem",
                    background: "linear-gradient(135deg, rgba(253,231,37,0.12) 0%, rgba(94,201,98,0.10) 100%)",
                    border: "1.5px solid rgba(253,231,37,0.40)",
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: "#5ec962" }} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1a6b1a" }}>
                      Movement logged! +{xpEarned} XP 🎉
                    </p>
                    <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "#1a7571" }}>
                      Nizhóní — Your heart thanks you.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="save"
                  whileHover={hasActivity ? { y: -2, boxShadow: "0 10px 30px rgba(253,231,37,0.45)" } : {}}
                  whileTap={hasActivity ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={!hasActivity || saving}
                  style={{
                    width: "100%", padding: "1.1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem", fontWeight: 800,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: hasActivity ? "#3b0a52" : "rgba(59,82,139,0.30)",
                    background: hasActivity
                      ? "linear-gradient(135deg, #fde725 0%, #5ec962 100%)"
                      : "rgba(59,82,139,0.06)",
                    border: hasActivity ? "none" : "1.5px solid rgba(59,82,139,0.12)",
                    borderRadius: "1.35rem",
                    cursor: hasActivity ? "pointer" : "not-allowed",
                    boxShadow: hasActivity ? "0 6px 22px rgba(253,231,37,0.28)" : "none",
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
                      <Zap size={16} style={{ color: "#3b0a52" }} />
                      Log Movement
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Motivational note — connects movement to BP ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(59,82,139,0.12)",
              borderRadius: "1.35rem",
              padding: "1.1rem 1.25rem",
              boxShadow: "0 3px 14px rgba(59,82,139,0.06)",
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(59,82,139,0.12) 0%, rgba(33,145,140,0.10) 100%)",
              border: "1px solid rgba(59,82,139,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={16} style={{ color: "#3b528b" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-title)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Movement & Your Heart
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--color-body)", lineHeight: 1.65, marginBottom: "0.3rem" }}>
                {note.note}
              </p>
              <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                {note.navajo}
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}