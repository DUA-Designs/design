import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DailyTaskCardProps {
  task: string;
  taskNavajo: string;
  completed: boolean;
  onToggle: () => void;
}

export function DailyTaskCard({ task, taskNavajo, completed, onToggle }: DailyTaskCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      style={{
        width: "100%",
        padding: "1.1rem 1.4rem",
        borderRadius: "1.35rem",
        background: completed
          ? "linear-gradient(135deg, rgba(94,201,98,0.12) 0%, rgba(33,145,140,0.08) 100%)"
          : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: completed
          ? "1.5px solid rgba(94,201,98,0.38)"
          : "1.5px solid rgba(59,82,139,0.16)",
        boxShadow: completed
          ? "0 4px 18px rgba(94,201,98,0.14)"
          : "0 4px 18px rgba(59,82,139,0.07)",
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.25s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
            <CheckCircle2 size={28} style={{ color: "#5ec962", flexShrink: 0 }} />
          </motion.div>
        ) : (
          <motion.div key="circle" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Circle size={28} style={{ color: "rgba(59,82,139,0.28)", flexShrink: 0 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.95rem", fontWeight: 700,
          color: completed ? "#1a6b1a" : "var(--color-title)",
          marginBottom: "0.18rem",
          transition: "color 0.25s",
        }}>
          {task}
        </h3>
        <p style={{
          fontSize: "0.75rem", fontStyle: "italic",
          color: completed ? "#1a7571" : "var(--color-subtitle)",
          transition: "color 0.25s",
        }}>
          {taskNavajo}
        </p>
      </div>

      {!completed && (
        <ArrowRight size={16} style={{ color: "var(--color-placeholder)", flexShrink: 0 }} />
      )}
    </motion.button>
  );
}
