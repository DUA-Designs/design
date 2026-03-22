import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Flame, Sparkles } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Mock streak data — replace with real persistence layer ──────────────────
const CURRENT_STREAK = 6;
const BEST_STREAK    = 14;

// ─── Gentle tips shown when user taps No — never shaming ─────────────────────
const GENTLE_TIPS = [
  {
    tip: "Try keeping your medication next to something you already do daily — like your morning coffee or toothbrush.",
    navajo: "Azeeʼ bee naanish.",
  },
  {
    tip: "Setting a phone alarm at the same time each day can make it feel like a natural part of your routine.",
    navajo: "Bee naaki yiską́.",
  },
  {
    tip: "One missed day doesn't define your journey. Tomorrow is a fresh start.",
    navajo: "Yiskąą doo nitsékees da.",
  },
  {
    tip: "Letting a family member know your medication time can create a gentle shared reminder.",
    navajo: "Hakʼéí bee bóhólníih.",
  },
];

// ─── Flame visual — grows with streak ────────────────────────────────────────
function StreakFlame({ streak }: { streak: number }) {
  // Color scales with streak length through Viridis
  const flameColor = streak >= 14 ? "#fde725"
    : streak >= 7  ? "#5ec962"
    : streak >= 3  ? "#21918c"
    : "#3b528b";

  const flameSize = Math.min(48 + streak * 3, 88);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      {/* Flame stack — multiple flames for visual richness */}
      <div style={{ position: "relative", width: flameSize + 24, height: flameSize + 24, display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Outer glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle, ${flameColor}40 0%, transparent 70%)`,
          }}
        />

        {/* Secondary smaller flames */}
        {streak >= 3 && (
          <motion.div
            animate={{ y: [0, -4, 0], scale: [0.9, 1, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ position: "absolute", bottom: 8, left: "25%" }}
          >
            <Flame size={flameSize * 0.55} style={{ color: `${flameColor}80` }} fill={`${flameColor}50`} />
          </motion.div>
        )}

        {/* Main flame */}
        <motion.div
          animate={{ y: [0, -5, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Flame
            size={flameSize}
            style={{ color: flameColor, filter: `drop-shadow(0 4px 12px ${flameColor}60)` }}
            fill={flameColor}
          />
          {/* Streak number inside flame area */}
          <div style={{
            position: "absolute",
            top: "42%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Playfair Display', serif",
            fontSize: flameSize > 60 ? "1.4rem" : "1.1rem",
            fontWeight: 900,
            color: streak >= 14 ? "#3b0a52" : "#ffffff",
            textShadow: streak >= 14 ? "none" : "0 1px 3px rgba(0,0,0,0.30)",
            lineHeight: 1,
            pointerEvents: "none",
          }}>
            {streak}
          </div>
        </motion.div>
      </div>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.78rem", fontWeight: 700,
        color: flameColor,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        {streak} day streak
      </p>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function MedicationScreen() {
  const navigate = useNavigate();

  const [answer,     setAnswer]     = useState<"yes" | "no" | null>(null);
  const [tipIndex]                  = useState(() => Math.floor(Math.random() * GENTLE_TIPS.length));
  const tip                         = GENTLE_TIPS[tipIndex];

  const newStreak = answer === "yes" ? CURRENT_STREAK + 1 : CURRENT_STREAK;

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
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <button
              onClick={() => navigate("/home")}
              style={{ padding: "0.5rem", background: "rgba(59,82,139,0.07)", border: "none", borderRadius: "0.75rem", cursor: "pointer", display: "flex" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--color-title)" }} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-title)", lineHeight: 1.15, marginBottom: "0.1rem" }}>
                Medication
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                Azeeʼ — Daily check-in
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Streak card ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.5rem",
              padding: "1.75rem 1.5rem",
              boxShadow: "0 8px 28px rgba(59,82,139,0.08)",
              marginBottom: "1.25rem",
              textAlign: "center",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Viridis bar */}
            <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 1.5rem 1.5rem" }} />

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Your Streak
            </p>

            <StreakFlame streak={answer === "yes" ? newStreak : CURRENT_STREAK} />

            {/* Best streak */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              marginTop: "1rem",
              padding: "0.35rem 1rem", borderRadius: "9999px",
              background: "rgba(59,82,139,0.06)",
              border: "1px solid rgba(59,82,139,0.12)",
            }}>
              <Sparkles size={13} style={{ color: "var(--color-subtitle)" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-subtitle)" }}>
                Best: {BEST_STREAK} days
              </span>
            </div>
          </motion.div>

          {/* ── Main question card ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.5rem",
              padding: "1.75rem 1.5rem",
              boxShadow: "0 8px 28px rgba(59,82,139,0.08)",
              marginBottom: "1.25rem",
            }}
          >
            {/* Question */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
                fontWeight: 700,
                color: "var(--color-title)",
                lineHeight: 1.3,
                marginBottom: "0.4rem",
              }}>
                Did you take your medication today?
              </h2>
              <p style={{ fontSize: "0.82rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                Díí jį' azeeʼ ndíníltsoosí?
              </p>
            </div>

            {/* Yes / No buttons */}
            <AnimatePresence mode="wait">
              {answer === null && (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}
                >
                  {/* YES */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAnswer("yes")}
                    style={{
                      padding: "1.4rem 1rem",
                      borderRadius: "1.25rem",
                      background: "linear-gradient(135deg, rgba(94,201,98,0.12) 0%, rgba(33,145,140,0.08) 100%)",
                      border: "2px solid rgba(94,201,98,0.40)",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "0.5rem",
                      boxShadow: "0 4px 16px rgba(94,201,98,0.12)",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>✅</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#1a6b1a" }}>
                      Yes
                    </span>
                    <span style={{ fontSize: "0.7rem", fontStyle: "italic", color: "#1a7571" }}>
                      Aoo'
                    </span>
                  </motion.button>

                  {/* NO — same visual weight, no judgment */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAnswer("no")}
                    style={{
                      padding: "1.4rem 1rem",
                      borderRadius: "1.25rem",
                      background: "rgba(255,255,255,0.80)",
                      border: "2px solid rgba(59,82,139,0.20)",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>💙</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-title)" }}>
                      Not yet
                    </span>
                    <span style={{ fontSize: "0.7rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                      Dooda
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* ── YES response — streak grows ── */}
              {answer === "yes" && (
                <motion.div
                  key="yes-response"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 16 }}
                  style={{
                    textAlign: "center",
                    padding: "1.25rem",
                    borderRadius: "1.25rem",
                    background: "linear-gradient(135deg, rgba(94,201,98,0.10) 0%, rgba(33,145,140,0.07) 100%)",
                    border: "1.5px solid rgba(94,201,98,0.35)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 10 }}
                    style={{ fontSize: "2.5rem", marginBottom: "0.6rem" }}
                  >
                    🎉
                  </motion.div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a6b1a", marginBottom: "0.25rem" }}>
                    Yá'át'ééh!
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#1a7571", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Streak extended to {newStreak} days — keep protecting it!
                  </p>
                  <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                    Nizhóní — You're doing beautifully.
                  </p>
                </motion.div>
              )}

              {/* ── NO response — gentle, no judgment ── */}
              {answer === "no" && (
                <motion.div
                  key="no-response"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 16 }}
                  style={{
                    textAlign: "center",
                    padding: "1.25rem",
                    borderRadius: "1.25rem",
                    background: "rgba(59,82,139,0.05)",
                    border: "1.5px solid rgba(59,82,139,0.15)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>💙</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "0.5rem" }}>
                    That's okay — no judgment here.
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-body)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                    {tip.tip}
                  </p>
                  <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                    {tip.navajo}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset — try again */}
            {answer !== null && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setAnswer(null)}
                style={{
                  display: "block", width: "100%",
                  marginTop: "1rem", padding: "0.7rem",
                  background: "none", border: "none",
                  fontSize: "0.78rem", fontWeight: 600,
                  color: "var(--color-placeholder)",
                  cursor: "pointer", textAlign: "center",
                }}
              >
                ← Change my answer
              </motion.button>
            )}
          </motion.div>

          {/* ── Weekly mini-grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.12)",
              borderRadius: "1.5rem",
              padding: "1.25rem 1.4rem",
              boxShadow: "0 4px 16px rgba(59,82,139,0.06)",
            }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.875rem" }}>
              This week
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.35rem" }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                // Mock data — last 6 days taken, today pending
                const taken  = i < 6;
                const isToday = i === 6;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                    <div style={{
                      width: "100%", aspectRatio: "1",
                      borderRadius: "0.6rem",
                      background: taken
                        ? "#5ec962"
                        : isToday
                          ? answer === "yes" ? "#5ec962" : "rgba(59,82,139,0.10)"
                          : "rgba(59,82,139,0.08)",
                      border: isToday ? "2px solid rgba(59,82,139,0.25)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.3s",
                    }}>
                      {taken && <span style={{ fontSize: "0.55rem", color: "white" }}>✓</span>}
                      {isToday && answer === "yes" && <span style={{ fontSize: "0.55rem", color: "white" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--color-placeholder)" }}>{day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}