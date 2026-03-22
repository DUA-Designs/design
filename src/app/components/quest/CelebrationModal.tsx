import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useEffect } from "react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  navajoMessage: string;
  xpGained?: number;
}

export function CelebrationModal({ isOpen, onClose, message, navajoMessage, xpGained }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen && xpGained) {
      const t = setTimeout(() => onClose(), 300000);
      return () => clearTimeout(t);
    }
  }, [isOpen, xpGained, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
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
            initial={{ scale: 0.82, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.82, y: 28, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(33,145,140,0.20)",
              borderRadius: "2rem",
              padding: "2.5rem 2rem 2rem",
              maxWidth: 340, width: "100%",
              textAlign: "center",
              boxShadow: "0 24px 64px rgba(59,82,139,0.16)",
              overflow: "hidden",
            }}
          >
            {/* Viridis bar */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, width: "100%", height: 4,
              background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)",
              borderRadius: "0 0 2rem 2rem",
            }} />

            {/* Close */}
            <button onClick={onClose} style={{
              position: "absolute", top: "0.875rem", right: "0.875rem",
              padding: "0.35rem", background: "rgba(59,82,139,0.06)",
              border: "none", borderRadius: "50%", cursor: "pointer",width: "40px",
    height: "40px",
              display: "flex",alignItems:"center", justifyContent:"center"
            }}>
              <X size={16} style={{ color: "var(--color-placeholder)" }} />
            </button>

            {/* Spinning icon */}
            <motion.div
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 0.55, ease: "backOut" }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 76, height: 76, borderRadius: "50%",
                background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                boxShadow: "0 6px 22px rgba(253,231,37,0.38)",
                marginBottom: "1.1rem",
              }}
            >
              <Sparkles size={34} style={{ color: "#3b0a52" }} />
            </motion.div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.9rem", fontWeight: 900,
              color: "var(--color-title)", marginBottom: "0.25rem",
            }}>
              {message}
            </h2>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic", fontSize: "1.1rem",
              color: "var(--color-subtitle)", marginBottom: "1.4rem",
            }}>
              {navajoMessage}
            </p>

            {xpGained && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 10 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  padding: "0.6rem 1.4rem", borderRadius: "9999px",
                  background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                  boxShadow: "0 4px 16px rgba(253,231,37,0.38)",
                }}
              >
                <Sparkles size={18} style={{ color: "#3b0a52" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#3b0a52" }}>
                  +{xpGained} XP
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
