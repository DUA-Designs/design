import { useState } from "react";
import { Heart, Utensils, Footprints, Users, Pill, Gamepad2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { HealthPillarTile } from "../components/quest/HealthPillarTile";
import { BPCard } from "../components/quest/BPCard";
import { DailyTaskCard } from "../components/quest/DailyTaskCard";
import { BottomNav } from "../components/quest/BottomNav";
import { XPBadge } from "../components/quest/XPBadge";
import { CelebrationModal } from "../components/quest/CelebrationModal";

// ─── Health pillars ───────────────────────────────────────────────────────────
// Colors assigned by Viridis scale in health priority order.
// #5ec962 lime removed from text/label use — only safe as decorative fill.
// #fde725 yellow removed from tile color — fails contrast on light bg.
const HEALTH_PILLARS = [
  { icon: Heart,      title: "Heart",    titleNavajo: "Jáádí",        progress: 75, color: "#440154", path: "/bp-log",       level: 3 },
  { icon: Utensils,   title: "Plate",    titleNavajo: "Ch'iyáán",     progress: 60, color: "#3b528b", path: "/diet-log",     level: 2 },
  { icon: Footprints, title: "Movement", titleNavajo: "Na'ashch'ąąd", progress: 45, color: "#21918c", path: "/exercise-log", level: 2 },
  { icon: Users,      title: "Family",   titleNavajo: "Hakʼéí",       progress: 80, color: "#1a5c1a", path: "/family",       level: 4 },
  { icon: Pill,       title: "Medicine", titleNavajo: "Azeeʼ",        progress: 90, color: "#1a7571", path: "/medication",   level: 5 },
  { icon: Gamepad2,   title: "Games",    titleNavajo: "Naanish",      progress: 50, color: "#355e3b", path: "/games",        level: 1 },
];

// ─── Family strip mock data ───────────────────────────────────────────────────
const FAMILY_MEMBERS = [
  { name: "Dad",   initials: "DL", systolic: 118, diastolic: 76 },
  { name: "Mom",   initials: "ML", systolic: 132, diastolic: 84 },
  { name: "Grams", initials: "GR", systolic: 145, diastolic: 92 },
];

function getFamilyBPColor(sys: number, dia: number): string {
  if (sys < 120 && dia < 80)   return "#1a5c1a"; // Normal  — dark green
  if (sys <= 129 && dia < 80)  return "#21918c"; // Elevated — teal
  if (sys <= 139 || dia <= 89) return "#3b528b"; // Stage 1  — blue
  return "#440154";                               // Stage 2  — purple
}

export function HomeScreen() {
  const navigate = useNavigate();
  const [taskCompleted,   setTaskCompleted]   = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTaskToggle = () => {
    if (!taskCompleted) {
      setTaskCompleted(true);
      setShowCelebration(true);
    } else {
      setTaskCompleted(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg-gradient)",
      backgroundColor: "var(--color-bg)",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Mobile-width container */}
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: "6rem" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            borderBottom: "1px solid rgba(33,145,140,0.13)",
            borderRadius: "0 0 1.75rem 1.75rem",
            padding: "3rem 1.4rem 1.2rem",
            boxShadow: "0 4px 20px rgba(59,82,139,0.07)",
            position: "relative", overflow: "hidden",
            marginBottom: "1.25rem",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", top: -50, right: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.13) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: -20, left: -40, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.45rem, 5vw, 1.85rem)",
                fontWeight: 900, color: "var(--color-title)",
                marginBottom: "0.18rem", lineHeight: 1.15,
              }}>
                Yá'át'ééh, Sarah!
              </h1>
              <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--color-subtitle)", fontStyle: "italic" }}>
                Ready for today's quest?
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <XPBadge xp={1250} />
            </motion.div>
          </div>
        </motion.div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── 1. BP Card — "How is my BP today?" ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ marginBottom: "1.1rem" }}>
            <BPCard systolic={120} diastolic={80} trend="stable" timestamp="Today at 8:00 AM" />
          </motion.div>

          {/* ── 2. Daily Task — "What should I do today?" ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }} style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)" }}>
                Today's Quest
              </h2>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-subtitle)", fontStyle: "italic" }}>Nídiilnish</span>
            </div>
            <DailyTaskCard
              task="Log your blood pressure"
              taskNavajo="Nídiilnish jáádí bee haz'ą́"
              completed={taskCompleted}
              onToggle={handleTaskToggle}
            />
          </motion.div>

          {/* ── 3. Family Circle strip — "How is my family doing?" ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.4 }} style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)" }}>
                Family Circle
              </h2>
              <button
                onClick={() => navigate("/family")}
                style={{ display: "flex", alignItems: "center", gap: "0.15rem", fontSize: "0.7rem", fontWeight: 600, color: "var(--color-subtitle)", fontStyle: "italic", background: "none", border: "none", cursor: "pointer" }}
              >
                Hakʼéí <ChevronRight size={12} />
              </button>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.15)", borderRadius: "1.35rem",
              padding: "1rem 1.25rem",
              boxShadow: "0 4px 18px rgba(59,82,139,0.07)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              {FAMILY_MEMBERS.map((member) => {
                const bpColor = getFamilyBPColor(member.systolic, member.diastolic);
                return (
                  <button key={member.name} onClick={() => navigate("/family")}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", padding: "0.4rem" }}
                  >
                    <div style={{ position: "relative" }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${bpColor}22 0%, ${bpColor}11 100%)`,
                        border: `2.5px solid ${bpColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 800,
                        color: bpColor,
                      }}>
                        {member.initials}
                      </div>
                      <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderRadius: "50%", background: bpColor, border: "2px solid white" }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-title)" }}>{member.name}</span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: bpColor }}>{member.systolic}/{member.diastolic}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── 4. Health Pillars grid ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.875rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)" }}>
                Health Pillars
              </h2>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-subtitle)", fontStyle: "italic" }}>Hózhó Nahasdlíí'</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              {HEALTH_PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.38 + i * 0.07, duration: 0.3 }}
                >
                  <HealthPillarTile
                    icon={pillar.icon}
                    title={pillar.title}
                    titleNavajo={pillar.titleNavajo}
                    progress={pillar.progress}
                    color={pillar.color}
                    level={pillar.level}
                    onClick={() => navigate(pillar.path)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        message="Great Job!"
        navajoMessage="Yéego!"
        xpGained={50}
      />
    </div>
  );
}