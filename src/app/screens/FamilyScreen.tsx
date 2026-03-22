import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, Target, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Mock family data — replace with real backend data ───────────────────────
const FAMILY_MEMBERS = [
  {
    name: "Sarah",    role: "You",          initials: "SL",
    systolic: 120,    diastolic: 80,
    xp: 1250,         streak: 6,
    lastActive: "Today",    isYou: true,
  },
  {
    name: "Dad",      role: "Father",       initials: "DL",
    systolic: 118,    diastolic: 76,
    xp: 980,          streak: 9,
    lastActive: "Today",    isYou: false,
  },
  {
    name: "Mom",      role: "Mother",       initials: "ML",
    systolic: 132,    diastolic: 84,
    xp: 1100,         streak: 4,
    lastActive: "Today",    isYou: false,
  },
  {
    name: "Grams",    role: "Grandmother",  initials: "GR",
    systolic: 145,    diastolic: 92,
    xp: 760,          streak: 2,
    lastActive: "Yesterday", isYou: false,
  },
];

// ─── Shared family quest — one goal the whole family works toward ─────────────
const FAMILY_QUEST = {
  title:       "7-Day Circle of Health",
  titleNavajo: "Naakits'áadah — Hózhó Nahasdlíí'",
  description: "Every family member logs their BP for 7 days in a row.",
  progress:    5,
  total:       7,
  reward:      500,
  daysLeft:    2,
};

// ─── BP status — same logic throughout the app ────────────────────────────────
function getBPStatus(sys: number, dia: number) {
  if (sys < 120 && dia < 80)   return { label: "Normal",   navajo: "Hózhó",         color: "#5ec962", text: "#1a5c1a" };
  if (sys <= 129 && dia < 80)  return { label: "Elevated", navajo: "Nitsąąs",       color: "#21918c", text: "#1a7571" };
  if (sys <= 139 || dia <= 89) return { label: "Stage 1",  navajo: "Háálá",         color: "#3b528b", text: "#3b528b" };
  return                               { label: "Stage 2",  navajo: "Nahwiilbįįhí",  color: "#440154", text: "#440154" };
}

function getTrendIcon(trend: "up" | "down" | "stable") {
  if (trend === "up")   return TrendingUp;
  if (trend === "down") return TrendingDown;
  return Minus;
}

// ─── Sorted leaderboard — by XP but framed around encouragement ──────────────
const LEADERBOARD = [...FAMILY_MEMBERS]
  .sort((a, b) => b.xp - a.xp)
  .map((m, i) => ({ ...m, rank: i + 1 }));

// ─── Rank medal colors — Viridis sequential ──────────────────────────────────
function getRankColor(rank: number): string {
  if (rank === 1) return "#fde725";  // v4 gold
  if (rank === 2) return "#1a5c1a";  // dark green — white text passes AAA
  if (rank === 3) return "#21918c";  // v2 teal
  return "#3b528b";                  // v1 blue
}

// ─── Dark text on rank color for contrast ────────────────────────────────────
function getRankTextColor(rank: number): string {
  if (rank === 1) return "#3b0a52";  // dark on yellow
  return "#ffffff";                  // white on darker colors
}

export function FamilyScreen() {
  const navigate = useNavigate();
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const questPct = Math.round((FAMILY_QUEST.progress / FAMILY_QUEST.total) * 100);
  const questColor = questPct >= 80 ? "#1a5c1a" : questPct >= 50 ? "#21918c" : "#3b528b";

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
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <button
              onClick={() => navigate("/home")}
              style={{ padding: "0.5rem", background: "rgba(59,82,139,0.07)", border: "none", borderRadius: "0.75rem", cursor: "pointer", display: "flex" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--color-title)" }} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-title)", lineHeight: 1.15, marginBottom: "0.1rem" }}>
                Family Circle
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                Hakʼéí — Your people, your strength
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Family member cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.38 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.875rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)" }}>
                The Circle
              </h2>
              <span style={{ fontSize: "0.7rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                {FAMILY_MEMBERS.filter(m => m.lastActive === "Today").length} active today
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {FAMILY_MEMBERS.map((member, i) => {
                const status    = getBPStatus(member.systolic, member.diastolic);
                const isExpanded = expandedMember === member.name;

                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.07, duration: 0.35 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                      style={{
                        width: "100%", textAlign: "left",
                        background: member.isYou
                          ? "linear-gradient(135deg, rgba(253,231,37,0.08) 0%, rgba(255,255,255,0.95) 60%)"
                          : "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: member.isYou
                          ? "1.5px solid rgba(253,231,37,0.35)"
                          : `1px solid ${status.color}25`,
                        borderLeft: `4px solid ${status.color}`,
                        borderRadius: "1.25rem",
                        padding: "1rem 1.25rem",
                        boxShadow: `0 4px 16px ${status.color}12`,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>

                        {/* Avatar with BP status ring */}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${status.color}22 0%, ${status.color}11 100%)`,
                            border: `2.5px solid ${status.color}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.82rem", fontWeight: 800,
                            color: status.text,
                          }}>
                            {member.initials}
                          </div>
                          {/* Active dot */}
                          {member.lastActive === "Today" && (
                            <div style={{
                              position: "absolute", bottom: 0, right: 0,
                              width: 12, height: 12, borderRadius: "50%",
                              background: "#5ec962", border: "2px solid white",
                            }} />
                          )}
                        </div>

                        {/* Name + role */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.1rem" }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--color-title)" }}>
                              {member.name}
                            </span>
                            {member.isYou && (
                              <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "9999px", background: "rgba(253,231,37,0.25)", color: "#5c4a00", border: "1px solid rgba(253,231,37,0.50)" }}>
                                You
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                            {member.role}
                          </span>
                        </div>

                        {/* BP reading */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "0.1rem", justifyContent: "flex-end" }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: status.color, lineHeight: 1 }}>
                              {member.systolic}
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "var(--color-placeholder)", margin: "0 0.1rem" }}>/</span>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: status.color, lineHeight: 1 }}>
                              {member.diastolic}
                            </span>
                          </div>
                          <span style={{
                            fontSize: "0.65rem", fontWeight: 700,
                            color: status.text,
                            background: `${status.color}15`,
                            padding: "0.1rem 0.45rem", borderRadius: "9999px",
                            display: "inline-block", marginTop: "0.2rem",
                          }}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.25 }}
                          style={{
                            marginTop: "0.875rem",
                            paddingTop: "0.875rem",
                            borderTop: "1px solid rgba(59,82,139,0.10)",
                            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "0.5rem",
                          }}
                        >
                          {[
                            { label: "XP",     value: `${member.xp.toLocaleString()}`, icon: "⚡" },
                            { label: "Streak", value: `${member.streak}d`,              icon: "🔥" },
                            { label: "Active", value: member.lastActive,                icon: "✅" },
                          ].map(stat => (
                            <div key={stat.label} style={{
                              textAlign: "center", padding: "0.5rem",
                              background: "rgba(59,82,139,0.05)", borderRadius: "0.75rem",
                            }}>
                              <p style={{ fontSize: "0.9rem", marginBottom: "0.15rem" }}>{stat.icon}</p>
                              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 800, color: "var(--color-title)" }}>
                                {stat.value}
                              </p>
                              <p style={{ fontSize: "0.62rem", color: "var(--color-placeholder)", fontWeight: 600 }}>
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Shared family quest — one goal together ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1.5px solid ${questColor}35`,
              borderLeft: `4px solid ${questColor}`,
              borderRadius: "1.35rem",
              padding: "1.4rem 1.5rem",
              boxShadow: `0 6px 22px ${questColor}12`,
              marginBottom: "1.25rem",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Viridis bar */}
            <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 1.35rem 1.35rem" }} />

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: `${questColor}18`, border: `1.5px solid ${questColor}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Target size={18} style={{ color: questColor }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                  Family Quest
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-title)", lineHeight: 1.25, marginBottom: "0.2rem" }}>
                  {FAMILY_QUEST.title}
                </h3>
                <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                  {FAMILY_QUEST.titleNavajo}
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--color-body)", lineHeight: 1.6, marginBottom: "1rem" }}>
              {FAMILY_QUEST.description}
            </p>

            {/* Progress bar */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: questColor }}>
                  Day {FAMILY_QUEST.progress} of {FAMILY_QUEST.total}
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-placeholder)" }}>
                  {FAMILY_QUEST.daysLeft} days left
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(59,82,139,0.10)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${questPct}%` }}
                  transition={{ delay: 0.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: "100%", borderRadius: 999, background: `linear-gradient(to right, ${questColor}aa, ${questColor})` }}
                />
              </div>
            </div>

            {/* Reward */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.3rem 0.875rem", borderRadius: "9999px",
              background: "rgba(253,231,37,0.12)", border: "1px solid rgba(253,231,37,0.35)",
            }}>
              <Sparkles size={13} style={{ color: "#5c4a00" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5c4a00" }}>
                Family reward: +{FAMILY_QUEST.reward} XP each
              </span>
            </div>
          </motion.div>

          {/* ── Encouragement leaderboard — "we" not "me" ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.35rem",
              padding: "1.25rem 1.4rem",
              boxShadow: "0 4px 16px rgba(59,82,139,0.07)",
            }}
          >
            {/* Header — "we" framing */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "0.1rem" }}>
                  How we're all doing
                </h3>
                <p style={{ fontSize: "0.7rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                  Hózhó — together in balance
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.3rem 0.75rem", borderRadius: "9999px",
                background: "rgba(94,201,98,0.10)", border: "1px solid rgba(94,201,98,0.25)",
              }}>
                <Heart size={12} style={{ color: "#1a5c1a", fill: "#1a5c1a" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1a5c1a" }}>
                  {FAMILY_MEMBERS.reduce((s, m) => s + m.xp, 0).toLocaleString()} XP together
                </span>
              </div>
            </div>

            {/* Leaderboard rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {LEADERBOARD.map((member, i) => {
                const rankColor     = getRankColor(member.rank);
                const rankTextColor = getRankTextColor(member.rank);
                const barWidth      = Math.round((member.xp / LEADERBOARD[0].xp) * 100);

                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.42 + i * 0.07 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.65rem 0.875rem",
                      borderRadius: "1rem",
                      background: member.isYou ? "rgba(253,231,37,0.06)" : "rgba(59,82,139,0.04)",
                      border: member.isYou ? "1px solid rgba(253,231,37,0.25)" : "1px solid transparent",
                    }}
                  >
                    {/* Rank badge */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: rankColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.72rem", fontWeight: 800,
                      color: rankTextColor,
                    }}>
                      {member.rank}
                    </div>

                    {/* Name + XP bar */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: member.isYou ? 800 : 600, color: "var(--color-title)" }}>
                          {member.name}
                          {member.isYou && <span style={{ fontSize: "0.62rem", color: "var(--color-subtitle)", fontWeight: 500, marginLeft: "0.3rem" }}>(you)</span>}
                        </span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-title)" }}>
                          {member.xp.toLocaleString()} XP
                        </span>
                      </div>
                      {/* XP bar */}
                      <div style={{ height: 5, borderRadius: 999, background: "rgba(59,82,139,0.10)", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          style={{ height: "100%", borderRadius: 999, background: rankColor }}
                        />
                      </div>
                    </div>

                    {/* Streak */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <p style={{ fontSize: "0.7rem" }}>🔥</p>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--color-placeholder)" }}>
                        {member.streak}d
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Collective encouragement — not competitive */}
            <div style={{
              marginTop: "1rem",
              paddingTop: "0.875rem",
              borderTop: "1px solid rgba(59,82,139,0.08)",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "0.78rem", color: "var(--color-body)", lineHeight: 1.6, fontStyle: "italic" }}>
                Every point earned by one is a step forward for all. Your family has come a long way together.
              </p>
              <p style={{ fontSize: "0.7rem", color: "var(--color-subtitle)", marginTop: "0.3rem", fontStyle: "italic" }}>
                Hózhó nahasdlíí' — K'é dóó nizhóní.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}