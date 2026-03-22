import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, ChevronRight, Trophy } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── BP Trivia questions ───────────────────────────────────────────────────────
// Short, readable, never more than two lines per the client brief
const QUESTIONS = [
  {
    id: 1,
    question: "What is considered a normal blood pressure reading?",
    answers: ["140/90 mmHg", "120/80 mmHg", "160/100 mmHg", "100/60 mmHg"],
    correct: 1,
    explanation: "120/80 mmHg is the gold standard for normal BP. Readings below this range are ideal.",
    xp: 20,
  },
  {
    id: 2,
    question: "Which lifestyle change has the biggest impact on lowering blood pressure?",
    answers: ["Drinking more coffee", "Reducing sodium intake", "Sleeping less", "Avoiding vegetables"],
    correct: 1,
    explanation: "Reducing sodium (salt) intake is one of the most effective dietary changes for lowering BP.",
    xp: 20,
  },
  {
    id: 3,
    question: "How often should someone with high BP check their reading at home?",
    answers: ["Once a month", "Once a week", "Daily or as advised by doctor", "Only at the clinic"],
    correct: 2,
    explanation: "Daily home monitoring helps track trends and alerts you to changes before your next clinic visit.",
    xp: 25,
  },
  {
    id: 4,
    question: "What does the top number in a BP reading measure?",
    answers: ["Diastolic pressure", "Heart rate", "Systolic pressure", "Oxygen level"],
    correct: 2,
    explanation: "The top number is systolic pressure — the force when your heart beats and pumps blood.",
    xp: 15,
  },
  {
    id: 5,
    question: "Which of these foods can help lower blood pressure naturally?",
    answers: ["Processed deli meats", "Canned soups", "Leafy greens and berries", "Fast food burgers"],
    correct: 2,
    explanation: "Leafy greens and berries are rich in potassium and antioxidants that support healthy BP levels.",
    xp: 20,
  },
  {
    id: 6,
    question: "High blood pressure is often called the 'silent killer' because:",
    answers: [
      "It only affects older people",
      "It causes no symptoms but damages organs",
      "It is very rare",
      "It only happens at night",
    ],
    correct: 1,
    explanation: "Most people with high BP feel no symptoms, so regular monitoring is essential for early detection.",
    xp: 25,
  },
  {
    id: 7,
    question: "Which activity is most effective at reducing blood pressure over time?",
    answers: ["Watching TV", "Regular moderate exercise", "Eating more protein", "Taking cold showers"],
    correct: 1,
    explanation: "Regular aerobic exercise — even 30 minutes of walking daily — significantly lowers BP over time.",
    xp: 20,
  },
];

// ─── Answer button state colors — Viridis semantic mapping ───────────────────
// Correct   → v3 green  #5ec962  (healthy outcome)
// Incorrect → v0 purple #440154  (alert — not red, keeps warm theme)
// Revealed  → v1 blue   #3b528b  (informational)
// Default   → white card
// Selected  → teal ring

type AnswerState = "default" | "correct" | "incorrect" | "revealed";

function getAnswerStyle(state: AnswerState, isSelected: boolean): React.CSSProperties {
  switch (state) {
    case "correct":
      return {
        background: "linear-gradient(135deg, rgba(94,201,98,0.14) 0%, rgba(33,145,140,0.10) 100%)",
        border: "2px solid #5ec962",
        boxShadow: "0 4px 16px rgba(94,201,98,0.20)",
      };
    case "incorrect":
      return {
        background: "rgba(68,1,84,0.07)",
        border: "2px solid #440154",
        boxShadow: "none",
        opacity: 0.85,
      };
    case "revealed":
      return {
        background: "linear-gradient(135deg, rgba(94,201,98,0.10) 0%, rgba(33,145,140,0.07) 100%)",
        border: "2px solid rgba(94,201,98,0.50)",
        boxShadow: "none",
      };
    default:
      return {
        background: isSelected ? "rgba(26,117,113,0.06)" : "rgba(255,255,255,0.92)",
        border: isSelected ? "2px solid rgba(26,117,113,0.40)" : "1.5px solid rgba(59,82,139,0.16)",
        boxShadow: isSelected ? "0 0 0 3px rgba(26,117,113,0.08)" : "0 2px 8px rgba(59,82,139,0.06)",
      };
  }
}

function getAnswerTextColor(state: AnswerState): string {
  if (state === "correct" || state === "revealed") return "#1a6b1a";
  if (state === "incorrect") return "#440154";
  return "var(--color-body)";
}

// ─── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ score, total, xpEarned, onRestart, onHome }: {
  score: number; total: number; xpEarned: number;
  onRestart: () => void; onHome: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const viridisColor = pct >= 80 ? "#5ec962" : pct >= 60 ? "#21918c" : pct >= 40 ? "#3b528b" : "#440154";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{ padding: "0 1.25rem", textAlign: "center" }}
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 12 }}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 96, height: 96, borderRadius: "50%",
          background: `linear-gradient(135deg, ${viridisColor} 0%, ${viridisColor}bb 100%)`,
          boxShadow: `0 8px 28px ${viridisColor}40`,
          marginBottom: "1.5rem",
        }}
      >
        <Trophy size={44} style={{ color: pct >= 80 ? "#3b0a52" : "#ffffff" }} />
      </motion.div>

      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "var(--color-title)", marginBottom: "0.3rem" }}>
        {pct >= 80 ? "Excellent!" : pct >= 60 ? "Well done!" : pct >= 40 ? "Good effort!" : "Keep learning!"}
      </h2>
      <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: "var(--color-subtitle)", marginBottom: "2rem" }}>
        {pct >= 80 ? "Yá'át'ééh — You're a heart health champion" : "Nizhóní — Every question teaches you something"}
      </p>

      {/* Score */}
      <div style={{
        background: "rgba(255,255,255,0.92)", border: "1px solid rgba(33,145,140,0.15)",
        borderRadius: "1.5rem", padding: "1.5rem", marginBottom: "1.25rem",
        boxShadow: "0 4px 18px rgba(59,82,139,0.07)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem",
      }}>
        {[
          { label: "Score", value: `${score}/${total}`, color: viridisColor },
          { label: "Accuracy", value: `${pct}%`, color: viridisColor },
          { label: "XP Earned", value: `+${xpEarned}`, color: "#fde725" },
        ].map(item => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: item.color, lineHeight: 1 }}>
              {item.value}
            </p>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-placeholder)", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <motion.button
          whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(253,231,37,0.45)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          style={{
            width: "100%", padding: "1.1rem",
            fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 800,
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: "#3b0a52", background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
            border: "none", borderRadius: "1.25rem", cursor: "pointer",
            boxShadow: "0 6px 22px rgba(253,231,37,0.32)",
          }}
        >
          Play Again
        </motion.button>
        <button
          onClick={onHome}
          style={{
            width: "100%", padding: "0.9rem",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700,
            color: "var(--color-subtitle)",
            background: "rgba(26,117,113,0.06)", border: "1.5px solid rgba(26,117,113,0.18)",
            borderRadius: "1.25rem", cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function TriviaScreen() {
  const navigate = useNavigate();

  const [currentQ,    setCurrentQ]    = useState(0);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [answered,    setAnswered]    = useState(false);
  const [score,       setScore]       = useState(0);
  const [xpEarned,    setXpEarned]    = useState(0);
  const [showResult,  setShowResult]  = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const q           = QUESTIONS[currentQ];
  const totalQ      = QUESTIONS.length;
  const isLast      = currentQ === totalQ - 1;
  const totalXP     = QUESTIONS.reduce((s, q) => s + q.xp, 0);
  const progressPct = ((currentQ) / totalQ) * 100;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    setShowExplain(true);
    if (index === q.correct) {
      setScore(s => s + 1);
      setXpEarned(x => x + q.xp);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentQ(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setShowExplain(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setXpEarned(0);
    setShowResult(false);
    setShowExplain(false);
  };

  const getAnswerState = (index: number): AnswerState => {
    if (!answered) return "default";
    if (index === q.correct && index === selected) return "correct";
    if (index === selected && index !== q.correct) return "incorrect";
    if (index === q.correct && selected !== null) return "revealed";
    return "default";
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
                  BP Trivia
                </h1>
                <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                  Béésh bąąh dahane' — Learn and earn
                </p>
              </div>
            </div>

            {/* XP always visible — client requirement */}
            {!showResult && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.1rem",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.35rem 0.875rem", borderRadius: "9999px",
                  background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                  boxShadow: "0 3px 12px rgba(253,231,37,0.35)",
                }}>
                  <Sparkles size={13} style={{ color: "#3b0a52" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "#3b0a52" }}>
                    {xpEarned} / {totalXP} XP
                  </span>
                </div>
                <span style={{ fontSize: "0.62rem", color: "var(--color-placeholder)", fontWeight: 500, paddingRight: "0.5rem" }}>
                  earned so far
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {!showResult ? (
            <>
              {/* ── Progress bar — Viridis colored by progress ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                style={{ marginBottom: "1.25rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-placeholder)", letterSpacing: "0.05em" }}>
                    Question {currentQ + 1} of {totalQ}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-subtitle)" }}>
                    {score} correct
                  </span>
                </div>

                {/* Segmented progress — Viridis stops */}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalQ}, 1fr)`, gap: 3 }}>
                  {QUESTIONS.map((_, i) => {
                    const isDone    = i < currentQ;
                    const isCurrent = i === currentQ;
                    const t         = (i + 1) / totalQ;
                    const segColor  = t < 0.25 ? "#440154" : t < 0.50 ? "#3b528b" : t < 0.75 ? "#21918c" : t < 0.95 ? "#5ec962" : "#fde725";
                    return (
                      <div key={i} style={{ height: 6, borderRadius: 999, position: "relative", overflow: "hidden", backgroundColor: isDone || isCurrent ? segColor : "rgba(59,82,139,0.12)", transition: "background-color 0.4s" }}>
                        {isCurrent && (
                          <motion.div
                            initial={{ width: "0%" }} animate={{ width: "100%" }}
                            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                            style={{ position: "absolute", inset: 0, backgroundColor: segColor, borderRadius: 999 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Question card ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Question */}
                  <div style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(33,145,140,0.15)",
                    borderRadius: "1.5rem",
                    padding: "1.75rem 1.5rem",
                    boxShadow: "0 8px 28px rgba(59,82,139,0.08)",
                    marginBottom: "1rem",
                    textAlign: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* XP reward badge — always visible */}
                    <div style={{
                      position: "absolute", top: "1rem", right: "1rem",
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.22rem 0.6rem", borderRadius: "9999px",
                      background: "rgba(253,231,37,0.15)",
                      border: "1px solid rgba(253,231,37,0.40)",
                    }}>
                      <Sparkles size={11} style={{ color: "#5c4a00" }} />
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#5c4a00" }}>+{q.xp} XP</span>
                    </div>

                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.1rem, 3.5vw, 1.35rem)",
                      fontWeight: 700,
                      color: "var(--color-title)",
                      lineHeight: 1.4,
                      marginTop: "0.5rem",
                    }}>
                      {q.question}
                    </h2>
                  </div>

                  {/* Answer buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1rem" }}>
                    {q.answers.map((answer, i) => {
                      const state     = getAnswerState(i);
                      const isSelected = selected === i;
                      const style     = getAnswerStyle(state, isSelected);
                      return (
                        <motion.button
                          key={i}
                          whileHover={!answered ? { scale: 1.02, x: 4 } : {}}
                          whileTap={!answered ? { scale: 0.98 } : {}}
                          onClick={() => handleAnswer(i)}
                          style={{
                            ...style,
                            width: "100%", padding: "1rem 1.25rem",
                            borderRadius: "1.15rem", cursor: answered ? "default" : "pointer",
                            textAlign: "left", display: "flex",
                            alignItems: "center", gap: "0.875rem",
                            transition: "all 0.25s ease",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {/* Letter label */}
                          <span style={{
                            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                            background: state === "correct" || state === "revealed"
                              ? "#5ec962"
                              : state === "incorrect"
                                ? "#440154"
                                : isSelected ? "#1a7571" : "rgba(59,82,139,0.10)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.72rem", fontWeight: 800,
                            color: state === "default" && !isSelected ? "var(--color-placeholder)" : "#ffffff",
                            transition: "all 0.25s",
                          }}>
                            {state === "correct" || state === "revealed"
                              ? <CheckCircle2 size={14} />
                              : state === "incorrect"
                                ? <XCircle size={14} />
                                : ["A", "B", "C", "D"][i]
                            }
                          </span>

                          <span style={{
                            fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500,
                            color: getAnswerTextColor(state),
                            flex: 1, lineHeight: 1.4,
                            transition: "color 0.25s",
                          }}>
                            {answer}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation — appears after answering */}
                  <AnimatePresence>
                    {showExplain && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: selected === q.correct
                            ? "rgba(94,201,98,0.08)"
                            : "rgba(59,82,139,0.06)",
                          border: `1px solid ${selected === q.correct ? "rgba(94,201,98,0.30)" : "rgba(59,82,139,0.15)"}`,
                          borderRadius: "1.15rem",
                          padding: "1rem 1.25rem",
                          marginBottom: "1rem",
                          display: "flex", alignItems: "flex-start", gap: "0.75rem",
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>
                          {selected === q.correct
                            ? <CheckCircle2 size={18} style={{ color: "#5ec962" }} />
                            : <XCircle size={18} style={{ color: "#440154" }} />
                          }
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: selected === q.correct ? "#1a6b1a" : "#440154", marginBottom: "0.2rem" }}>
                            {selected === q.correct ? "Correct! Yá'át'ééh! 🎉" : "Not quite — here's why:"}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "var(--color-body)", lineHeight: 1.6 }}>
                            {q.explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next button */}
                  {answered && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(253,231,37,0.45)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      style={{
                        width: "100%", padding: "1.05rem",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.95rem", fontWeight: 800,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: "#3b0a52",
                        background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
                        border: "none", borderRadius: "1.25rem", cursor: "pointer",
                        boxShadow: "0 6px 22px rgba(253,231,37,0.30)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      }}
                    >
                      {isLast ? "See Results" : "Next Question"}
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <ResultsScreen
              score={score}
              total={totalQ}
              xpEarned={xpEarned}
              onRestart={handleRestart}
              onHome={() => navigate("/home")}
            />
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}