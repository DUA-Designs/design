import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

const PETAL_COLORS = [
  "#440154",
  "#3b528b",
  "#21918c",
  "#5ec962",
  "#fde725",
  "#5ec962",
  "#21918c",
  "#3b528b",
];

export function SplashScreen() {
  const navigate              = useNavigate();
  const [ready,   setReady]   = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleBegin = () => {
    setLeaving(true);
    setTimeout(() => navigate("/auth"), 600);
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 2rem",
            background: "radial-gradient(ellipse at 50% 20%, #e8f5e9 0%, #fdf8f0 45%, #e3eaf7 100%)",
            backgroundColor: "#fdf8f0",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background orbs */}
          <div aria-hidden="true" style={{ position: "absolute", width: 600, height: 600, top: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", width: 500, height: 500, bottom: "-10%", right: "-10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,82,139,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", width: 300, height: 300, top: "55%", left: "5%", borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* Viridis petal ring */}
          <div aria-hidden="true" style={{ position: "relative", width: 260, height: 260, marginBottom: "2.5rem" }}>

            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 0 }}>
              {PETAL_COLORS.map((color, i) => (
                <motion.div key={i}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.55 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: "backOut" }}
                  style={{ position: "absolute", width: 18, height: 52, left: "50%", top: "50%", marginLeft: -9, borderRadius: "50% 50% 40% 40%", background: color, transformOrigin: "50% 130px", transform: `rotate(${i * 45}deg) translateY(-130px)` }}
                />
              ))}
            </motion.div>

            <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 20 }}>
              {PETAL_COLORS.map((color, i) => (
                <motion.div key={i}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.25 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                  style={{ position: "absolute", width: 10, height: 32, left: "50%", top: "50%", marginLeft: -5, borderRadius: "50%", background: color, transformOrigin: "50% 90px", transform: `rotate(${i * 45 + 22}deg) translateY(-90px)` }}
                />
              ))}
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.35) 0%, transparent 70%)" }}
            />

            <motion.div
              initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 14, stiffness: 120 }}
              style={{ position: "absolute", inset: 48, borderRadius: "50%", background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(94,201,98,0.35), 0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <svg width="52" height="50" viewBox="0 0 46 44" fill="none" aria-hidden="true">
                <path d="M23 40 C23 40 3 26 3 14.5 C3 8.8 7.3 4 13 4 C17 4 20.5 6.2 23 10 C25.5 6.2 29 4 33 4 C38.7 4 43 8.8 43 14.5 C43 26 23 40 23 40Z" fill="#3b0a52" opacity={0.92} />
                <polyline points="6,22 11,22 13,17 15,27 17,14 19,28 21,22 25,22 27,19 29,22 40,22" stroke="#fde725" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </motion.div>

          </div>

          {/* App name */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.55, ease: [0.4, 0, 0.2, 1] }} style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(2rem, 7vw, 2.8rem)", color: "#3b528b", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "0.2rem" }}>
              Cardio Care Quest
            </h1>
          </motion.div>

          {/* Navajo greeting */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(1.3rem, 4vw, 1.6rem)", fontWeight: 700, color: "#1a7571", marginBottom: "0.35rem", letterSpacing: "0.01em" }}>
              Yá'át'ééh
            </p>
            <div style={{ width: 40, height: 2, borderRadius: 999, background: "linear-gradient(to right, #5ec962, #fde725)", margin: "0.5rem auto" }} />
            <p style={{ fontSize: "1rem", fontWeight: 500, color: "#6b7a9f", letterSpacing: "0.04em" }}>
              Welcome to Your Health Journey
            </p>
          </motion.div>

          {/* Begin button */}
          <AnimatePresence>
            {ready && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                onClick={handleBegin}
                whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(253,231,37,0.55), 0 4px 12px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "1.2rem 3rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3b0a52", background: "#fde725", border: "none", borderRadius: "9999px", cursor: "pointer", boxShadow: "0 8px 32px rgba(253,231,37,0.45)", position: "relative", overflow: "hidden" }}
              >
                Begin Journey
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Viridis bar */}
          <motion.div aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", transformOrigin: "left" }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}