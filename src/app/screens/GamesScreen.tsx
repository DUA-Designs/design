import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Lock, Sparkles, Star,
  Heart, Utensils, Footprints, Brain, Pill, Trophy,
} from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Game definitions ─────────────────────────────────────────────────────────
// Each game is a health pillar expressed as a game mode
// Viridis colors assigned by pillar — consistent with HomeScreen
const GAMES = [
  {
    id:          "trivia",
    title:       "BP Trivia",
    titleNavajo: "Béésh bąąh dahane'",
    desc:        "Test your blood pressure knowledge. Answer questions, earn XP, learn something new.",
    icon:        Brain,
    color:       "#440154",
    pillar:      "Heart",
    path:        "/trivia",
    locked:      false,
    stars:       3,
    maxStars:    3,
    xpReward:    140,
    plays:       12,
    bestScore:   "7/7",
    tag:         "Knowledge",
  },
  {
    id:          "bp-log-game",
    title:       "Heart Keeper",
    titleNavajo: "Jáádí Bee Naaghá",
    desc:        "Log your BP daily and keep your heart healthy streak alive. Consistency is the game.",
    icon:        Heart,
    color:       "#3b528b",
    pillar:      "Heart",
    path:        "/bp-log",
    locked:      false,
    stars:       2,
    maxStars:    3,
    xpReward:    50,
    plays:       23,
    bestScore:   "6 day streak",
    tag:         "Daily Habit",
  },
  {
    id:          "diet-game",
    title:       "Plate Quest",
    titleNavajo: "Ch'iyáán Naanish",
    desc:        "Log your meals for 7 days straight. Discover how traditional foods support your heart.",
    icon:        Utensils,
    color:       "#21918c",
    pillar:      "Plate",
    path:        "/diet-log",
    locked:      false,
    stars:       1,
    maxStars:    3,
    xpReward:    80,
    plays:       8,
    bestScore:   "3 day streak",
    tag:         "Nutrition",
  },
  {
    id:          "movement-game",
    title:       "Movement Trail",
    titleNavajo: "Na'ashch'ąąd Bitsʼąą'",
    desc:        "Walk, work, move. Every activity logged counts toward your movement badge.",
    icon:        Footprints,
    color:       "#1a5c1a",
    pillar:      "Movement",
    path:        "/exercise-log",
    locked:      false,
    stars:       2,
    maxStars:    3,
    xpReward:    60,
    plays:       15,
    bestScore:   "45 min session",
    tag:         "Activity",
  },
  {
    id:          "medication-game",
    title:       "Medicine Keeper",
    titleNavajo: "Azeeʼ Bee Naaghá",
    desc:        "Build your medication streak. Protect your flame and keep your routine strong.",
    icon:        Pill,
    color:       "#1a7571",
    pillar:      "Medicine",
    path:        "/medication",
    locked:      false,
    stars:       3,
    maxStars:    3,
    xpReward:    40,
    plays:       30,
    bestScore:   "6 day streak",
    tag:         "Habit",
  },
  {
    id:          "family-challenge",
    title:       "Family Challenge",
    titleNavajo: "Hakʼéí Naanish",
    desc:        "Compete together — not against each other. Help your family reach the weekly goal.",
    icon:        Trophy,
    color:       "#3b528b",
    pillar:      "Family",
    path:        "/family",
    locked:      true,
    stars:       0,
    maxStars:    3,
    xpReward:    200,
    plays:       0,
    bestScore:   "—",
    tag:         "Community",
    unlockHint:  "Complete 5 days of BP logging to unlock",
  },
];

// ─── Star rating display ──────────────────────────────────────────────────────
function StarRating({ stars, max, color }: { stars: number; max: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          style={{
            color:    i < stars ? color : "rgba(59,82,139,0.20)",
            fill:     i < stars ? color : "transparent",
            transition: "all 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function GamesScreen() {
  const navigate    = useNavigate();
  const [selected,  setSelected]  = useState<string | null>(null);

  const totalXP      = GAMES.filter(g => !g.locked).reduce((s, g) => s + g.xpReward, 0);
  const unlockedCount = GAMES.filter(g => !g.locked).length;

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
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

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
                  Quest Games
                </h1>
                <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                  Naanish — Play your way to health
                </p>
              </div>
            </div>

            {/* Total XP available */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem",
              padding: "0.4rem 0.875rem", borderRadius: "9999px",
              background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
              boxShadow: "0 3px 12px rgba(253,231,37,0.30)",
            }}>
              <Sparkles size={13} style={{ color: "#3b0a52" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 800, color: "#3b0a52" }}>
                {unlockedCount} games
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Summary strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            style={{
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.15rem",
              padding: "0.875rem 1.25rem",
              marginBottom: "1.25rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "var(--color-body)", lineHeight: 1.5 }}>
              Each game is a health pillar. Play them all to earn up to{" "}
              <strong style={{ color: "var(--color-title)" }}>{totalXP} XP</strong> per day.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              padding: "0.25rem 0.7rem", borderRadius: "9999px",
              background: "rgba(59,82,139,0.07)",
              border: "1px solid rgba(59,82,139,0.15)",
              marginLeft: "0.75rem", flexShrink: 0,
            }}>
              <Trophy size={12} style={{ color: "#3b528b" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#3b528b" }}>
                {GAMES.filter(g => g.stars === g.maxStars && !g.locked).length} mastered
              </span>
            </div>
          </motion.div>

          {/* ── Game cards ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {GAMES.map((game, i) => {
              const isExpanded = selected === game.id;
              const Icon       = game.icon;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                >
                  <motion.button
                    whileHover={!game.locked ? { scale: 1.01, y: -2 } : {}}
                    whileTap={!game.locked ? { scale: 0.99 } : {}}
                    onClick={() => !game.locked && setSelected(isExpanded ? null : game.id)}
                    style={{
                      width: "100%", textAlign: "left",
                      background: game.locked
                        ? "rgba(255,255,255,0.55)"
                        : `linear-gradient(160deg, ${hexToRgba(game.color, 0.09)} 0%, rgba(255,255,255,0.95) 55%)`,
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: game.locked
                        ? "1px solid rgba(59,82,139,0.10)"
                        : `1.5px solid ${hexToRgba(game.color, 0.28)}`,
                      borderLeft: game.locked
                        ? "1px solid rgba(59,82,139,0.10)"
                        : `4px solid ${game.color}`,
                      borderRadius: "1.35rem",
                      padding: "1.1rem 1.25rem",
                      boxShadow: game.locked
                        ? "none"
                        : `0 5px 18px ${hexToRgba(game.color, 0.12)}`,
                      cursor: game.locked ? "default" : "pointer",
                      opacity: game.locked ? 0.65 : 1,
                    }}
                  >
                    {/* Main row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>

                      {/* Icon circle */}
                      <div style={{
                        width: 48, height: 48, borderRadius: "1rem", flexShrink: 0,
                        background: game.locked
                          ? "rgba(59,82,139,0.08)"
                          : hexToRgba(game.color, 0.12),
                        border: game.locked
                          ? "1.5px solid rgba(59,82,139,0.14)"
                          : `1.5px solid ${hexToRgba(game.color, 0.30)}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {game.locked
                          ? <Lock size={20} style={{ color: "rgba(59,82,139,0.30)" }} />
                          : <Icon size={22} strokeWidth={2} style={{ color: game.color }} />
                        }
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.95rem", fontWeight: 800,
                            color: game.locked ? "var(--color-placeholder)" : "var(--color-title)",
                          }}>
                            {game.title}
                          </span>
                          {/* Tag pill */}
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 700,
                            padding: "0.12rem 0.5rem", borderRadius: "9999px",
                            background: game.locked ? "rgba(59,82,139,0.07)" : hexToRgba(game.color, 0.10),
                            color: game.locked ? "var(--color-placeholder)" : game.color,
                            border: `1px solid ${game.locked ? "rgba(59,82,139,0.12)" : hexToRgba(game.color, 0.25)}`,
                          }}>
                            {game.tag}
                          </span>
                        </div>
                        <p style={{
                          fontSize: "0.68rem", fontStyle: "italic",
                          color: "var(--color-subtitle)", marginBottom: "0.4rem",
                        }}>
                          {game.titleNavajo}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <StarRating stars={game.stars} max={game.maxStars} color={game.color} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-placeholder)" }}>
                            +{game.xpReward} XP max
                          </span>
                        </div>
                      </div>

                      {/* Lock or plays count */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {game.locked ? (
                          <Lock size={16} style={{ color: "rgba(59,82,139,0.25)" }} />
                        ) : (
                          <div>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900, color: game.color, lineHeight: 1 }}>
                              {game.plays}
                            </p>
                            <p style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--color-placeholder)" }}>plays</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && !game.locked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            marginTop: "0.875rem",
                            paddingTop: "0.875rem",
                            borderTop: `1px solid ${hexToRgba(game.color, 0.18)}`,
                          }}
                        >
                          <p style={{ fontSize: "0.82rem", color: "var(--color-body)", lineHeight: 1.65, marginBottom: "0.875rem" }}>
                            {game.desc}
                          </p>

                          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
                            {[
                              { label: "Best",  value: game.bestScore },
                              { label: "Plays", value: String(game.plays) },
                              { label: "XP",    value: `+${game.xpReward}` },
                            ].map(stat => (
                              <div key={stat.label} style={{
                                padding: "0.4rem 0.875rem", borderRadius: "0.75rem",
                                background: hexToRgba(game.color, 0.08),
                                border: `1px solid ${hexToRgba(game.color, 0.20)}`,
                                textAlign: "center",
                              }}>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 800, color: game.color }}>
                                  {stat.value}
                                </p>
                                <p style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--color-placeholder)" }}>
                                  {stat.label}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Play button */}
                          <motion.button
                            whileHover={{ y: -2, boxShadow: `0 8px 24px ${hexToRgba(game.color, 0.30)}` }}
                            whileTap={{ scale: 0.98 }}
                            onClick={e => { e.stopPropagation(); navigate(game.path); }}
                            style={{
                              width: "100%", padding: "0.875rem",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.9rem", fontWeight: 800,
                              letterSpacing: "0.07em", textTransform: "uppercase",
                              color: "#ffffff",
                              background: game.color,
                              border: "none", borderRadius: "1rem",
                              cursor: "pointer",
                              boxShadow: `0 4px 16px ${hexToRgba(game.color, 0.28)}`,
                            }}
                          >
                            Play Now →
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Locked hint */}
                    {game.locked && game.unlockHint && (
                      <div style={{
                        marginTop: "0.75rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid rgba(59,82,139,0.08)",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                      }}>
                        <Lock size={12} style={{ color: "rgba(59,82,139,0.35)", flexShrink: 0 }} />
                        <p style={{ fontSize: "0.72rem", color: "var(--color-placeholder)", fontStyle: "italic" }}>
                          {game.unlockHint}
                        </p>
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* ── Encouragement footer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{
              textAlign: "center",
              padding: "1.5rem 0.5rem 0.5rem",
            }}
          >
            <p style={{ fontSize: "0.78rem", color: "var(--color-placeholder)", lineHeight: 1.6, fontStyle: "italic" }}>
              Every game you play is a step toward better heart health.
              <br />
              <span style={{ color: "var(--color-subtitle)" }}>Hózhó nahasdlíí' — balance is restored.</span>
            </p>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}