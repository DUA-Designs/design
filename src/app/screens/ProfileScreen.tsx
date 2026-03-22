import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, User, MapPin, Hash, Bell, BellOff,
  ChevronRight, LogOut, Heart, Trophy, Flame,
  Shield, BookOpen, Sparkles,
} from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Mock participant data — replace with real auth/backend data ──────────────
const PARTICIPANT = {
  name:          "Sarah Lonewolf",
  participantId: "CCQ-2024-0042",
  city:          "Gallup",
  state:         "New Mexico",
  joinDate:      "January 14, 2025",
  studyEnd:      "July 14, 2025",
};

// ─── Mock study progress stats ────────────────────────────────────────────────
const STATS = [
  { label: "Total XP",      value: "1,250",  icon: Sparkles, color: "#5c4a00",  bg: "rgba(253,231,37,0.12)",  border: "rgba(253,231,37,0.30)" },
  { label: "Day Streak",    value: "6",      icon: Flame,    color: "#440154",  bg: "rgba(68,1,84,0.08)",     border: "rgba(68,1,84,0.20)"    },
  { label: "BP Logs",       value: "23",     icon: Heart,    color: "#1a7571",  bg: "rgba(26,117,113,0.08)",  border: "rgba(26,117,113,0.22)" },
  { label: "Days Active",   value: "31",     icon: Trophy,   color: "#1a5c1a",  bg: "rgba(26,92,26,0.08)",    border: "rgba(26,92,26,0.22)"   },
];

// ─── Notification settings ────────────────────────────────────────────────────
interface NotifSetting {
  key:     string;
  label:   string;
  navajo:  string;
  desc:    string;
  enabled: boolean;
}

const DEFAULT_NOTIFS: NotifSetting[] = [
  { key: "medication", label: "Medication Reminder",  navajo: "Azeeʼ bee bóhólníih",     desc: "Daily reminder to log your medication",      enabled: true  },
  { key: "bp",         label: "BP Check-in",          navajo: "Jáádí bee haz'ą́",          desc: "Morning prompt to log your blood pressure",  enabled: true  },
  { key: "quest",      label: "Daily Quest",          navajo: "Nídiilnish",               desc: "Reminder when your daily quest is waiting",  enabled: true  },
  { key: "family",     label: "Family Activity",      navajo: "Hakʼéí bee naaltsoos",     desc: "Alert when a family member logs their BP",   enabled: false },
];

// ─── Study progress bar ───────────────────────────────────────────────────────
const STUDY_START  = new Date("2025-01-14");
const STUDY_END    = new Date("2025-07-14");
const TODAY        = new Date("2025-03-22");
const studyDays    = Math.round((STUDY_END.getTime()   - STUDY_START.getTime()) / 86400000);
const elapsedDays  = Math.round((TODAY.getTime()       - STUDY_START.getTime()) / 86400000);
const studyPct     = Math.min(Math.round((elapsedDays / studyDays) * 100), 100);
const studyColor   = studyPct >= 75 ? "#1a5c1a" : studyPct >= 50 ? "#21918c" : studyPct >= 25 ? "#3b528b" : "#440154";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [notifs,      setNotifs]      = useState<NotifSetting[]>(DEFAULT_NOTIFS);
  const [showLogout,  setShowLogout]  = useState(false);

  const toggleNotif = (key: string) => {
    setNotifs(prev => prev.map(n => n.key === key ? { ...n, enabled: !n.enabled } : n));
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
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,82,139,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <button
              onClick={() => navigate("/home")}
              style={{ padding: "0.5rem", background: "rgba(59,82,139,0.07)", border: "none", borderRadius: "0.75rem", cursor: "pointer", display: "flex" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--color-title)" }} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-title)", lineHeight: 1.15, marginBottom: "0.1rem" }}>
                My Profile
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                Your journey so far
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Participant identity card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.15)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              boxShadow: "0 6px 22px rgba(59,82,139,0.08)",
              marginBottom: "1.25rem",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Viridis bar */}
            <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 1.5rem 1.5rem" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              {/* Avatar */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(253,231,37,0.30)",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem", fontWeight: 900, color: "#3b0a52",
              }}>
                SL
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "0.2rem" }}>
                  {PARTICIPANT.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Shield size={12} style={{ color: "var(--color-subtitle)" }} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-subtitle)" }}>
                    Research Participant
                  </span>
                </div>
              </div>
            </div>

            {/* Info rows */}
            {[
              { icon: Hash,   label: "Participant ID", value: PARTICIPANT.participantId },
              { icon: MapPin, label: "Location",       value: `${PARTICIPANT.city}, ${PARTICIPANT.state}` },
              { icon: User,   label: "Joined",         value: PARTICIPANT.joinDate },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.6rem 0",
                borderBottom: "1px solid rgba(59,82,139,0.07)",
              }}>
                <row.icon size={15} style={{ color: "var(--color-subtitle)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-placeholder)", minWidth: 90 }}>
                  {row.label}
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-body)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ── Study progress ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${studyColor}25`,
              borderLeft: `4px solid ${studyColor}`,
              borderRadius: "1.35rem",
              padding: "1.4rem 1.5rem",
              boxShadow: `0 6px 20px ${studyColor}10`,
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <BookOpen size={16} style={{ color: studyColor }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-title)" }}>
                Study Progress
              </h3>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.25rem" }}>
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "1rem",
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                    display: "flex", alignItems: "center", gap: "0.65rem",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: `${stat.color}18`,
                    border: `1.5px solid ${stat.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <stat.icon size={15} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--color-placeholder)", marginTop: "0.15rem" }}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Study timeline bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: studyColor }}>
                  Day {elapsedDays} of {studyDays}
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-placeholder)" }}>
                  Study ends {PARTICIPANT.studyEnd}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: "rgba(59,82,139,0.10)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${studyPct}%` }}
                  transition={{ delay: 0.35, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: "100%", borderRadius: 999, background: `linear-gradient(to right, ${studyColor}99, ${studyColor})` }}
                />
              </div>
              <p style={{ fontSize: "0.68rem", color: "var(--color-placeholder)", marginTop: "0.4rem", fontStyle: "italic" }}>
                {studyPct}% of the study journey complete
              </p>
            </div>
          </motion.div>

          {/* ── Notification settings ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.38 }}
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(33,145,140,0.14)",
              borderRadius: "1.35rem",
              padding: "1.25rem 1.4rem",
              boxShadow: "0 4px 16px rgba(59,82,139,0.07)",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <Bell size={16} style={{ color: "var(--color-subtitle)" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--color-title)" }}>
                Reminders
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              {notifs.map((notif, i) => (
                <motion.div
                  key={notif.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + i * 0.06 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.875rem 0",
                    borderBottom: i < notifs.length - 1 ? "1px solid rgba(59,82,139,0.07)" : "none",
                  }}
                >
                  {/* Toggle */}
                  <button
                    onClick={() => toggleNotif(notif.key)}
                    aria-label={`${notif.enabled ? "Disable" : "Enable"} ${notif.label}`}
                    style={{
                      position: "relative",
                      width: 44, height: 24, borderRadius: 999, flexShrink: 0,
                      background: notif.enabled ? "#1a7571" : "rgba(59,82,139,0.18)",
                      border: "none", cursor: "pointer",
                      transition: "background 0.25s",
                    }}
                  >
                    <motion.div
                      animate={{ x: notif.enabled ? 22 : 2 }}
                      transition={{ type: "spring", damping: 18, stiffness: 300 }}
                      style={{
                        position: "absolute", top: 2,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                      }}
                    />
                  </button>

                  {/* Label */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                      {notif.enabled
                        ? <Bell size={13} style={{ color: "#1a7571", flexShrink: 0 }} />
                        : <BellOff size={13} style={{ color: "var(--color-placeholder)", flexShrink: 0 }} />
                      }
                      <span style={{
                        fontSize: "0.88rem", fontWeight: 700,
                        color: notif.enabled ? "var(--color-title)" : "var(--color-placeholder)",
                        transition: "color 0.2s",
                      }}>
                        {notif.label}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--color-placeholder)", lineHeight: 1.4 }}>
                      {notif.desc}
                    </p>
                    <p style={{ fontSize: "0.65rem", fontStyle: "italic", color: "var(--color-subtitle)", marginTop: "0.1rem" }}>
                      {/* {notif.navajo} */}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Account / logout ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.38 }}
            style={{ marginBottom: "1rem" }}
          >
            <button
              onClick={() => setShowLogout(true)}
              style={{
                width: "100%", padding: "1rem 1.25rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(68,1,84,0.15)",
                borderRadius: "1.25rem",
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(59,82,139,0.06)",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(68,1,84,0.08)",
                border: "1px solid rgba(68,1,84,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <LogOut size={16} style={{ color: "#440154" }} />
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#440154", flex: 1, textAlign: "left" }}>
                Sign Out
              </span>
              <ChevronRight size={16} style={{ color: "rgba(68,1,84,0.40)" }} />
            </button>
          </motion.div>

          {/* Study note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "0.72rem", color: "var(--color-placeholder)",
              textAlign: "center", lineHeight: 1.6,
              padding: "0 0.5rem",
            }}
          >
            Your data is securely stored as part of the CardioCare Quest research study at Texas State University.
          </motion.p>

        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLogout(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1.5rem",
              background: "rgba(59,82,139,0.22)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(33,145,140,0.18)",
                borderRadius: "1.75rem",
                padding: "2rem 1.75rem",
                maxWidth: 320, width: "100%",
                textAlign: "center",
                boxShadow: "0 20px 56px rgba(59,82,139,0.16)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 1.75rem 1.75rem" }} />

              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>👋</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-title)", marginBottom: "0.4rem" }}>
                Sign out?
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--color-body)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Your progress is saved. Come back anytime to continue your health journey.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%", padding: "0.9rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem", fontWeight: 800,
                    color: "#440154",
                    background: "rgba(68,1,84,0.08)",
                    border: "1.5px solid rgba(68,1,84,0.22)",
                    borderRadius: "1.15rem", cursor: "pointer",
                  }}
                >
                  Yes, sign out
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  style={{
                    width: "100%", padding: "0.9rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem", fontWeight: 700,
                    color: "var(--color-subtitle)",
                    background: "rgba(26,117,113,0.06)",
                    border: "1.5px solid rgba(26,117,113,0.18)",
                    borderRadius: "1.15rem", cursor: "pointer",
                  }}
                >
                  Stay in the Circle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}