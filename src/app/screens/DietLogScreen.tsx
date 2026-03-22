import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, X, CheckCircle2, Leaf } from "lucide-react";
import { BottomNav } from "../components/quest/BottomNav";

// ─── Meal slots ───────────────────────────────────────────────────────────────
const MEAL_SLOTS = [
  { key: "breakfast", label: "Breakfast", navajo: "Abíní",     emoji: "🌅" },
  { key: "lunch",     label: "Lunch",     navajo: "Álchíní",   emoji: "☀️" },
  { key: "dinner",    label: "Dinner",    navajo: "Hi'ąą'",    emoji: "🌙" },
  { key: "snacks",    label: "Snacks",    navajo: "Ałk'idą́ą́'", emoji: "🌿" },
];

// ─── Visual meal rating — plate icons, not numbers ────────────────────────────
// Five states from least balanced to most balanced
// Viridis mapped: v0 purple → v4 yellow encoding quality progression
const MEAL_RATINGS = [
  { value: 1, emoji: "😔", label: "Rough day",   navajo: "Doo nizhóní da", color: "#440154" },
  { value: 2, emoji: "😐", label: "Could improve", navajo: "Nitsékees",    color: "#3b528b" },
  { value: 3, emoji: "🙂", label: "Pretty good",  navajo: "Hózhó",         color: "#21918c" },
  { value: 4, emoji: "😊", label: "Great choices", navajo: "Nizhóní",      color: "#1a5c1a" },
  { value: 5, emoji: "🌟", label: "Excellent!",   navajo: "Yá'át'ééh!",    color: "#7a5500" },
];

// ─── Culturally grounded nutrition tips ──────────────────────────────────────
// Never judgmental — always celebrate awareness
const NUTRITION_TIPS = [
  {
    tip: "Traditional foods like mutton stew and corn are rich in nutrients. Enjoying them is part of taking care of yourself.",
    navajo: "Diyogí bitsį' dóó naadą́ą́' — nizhóní.",
  },
  {
    tip: "Adding a handful of leafy greens to any meal — even alongside fry bread — is a step worth celebrating.",
    navajo: "Ch'il łigaii bee hózhó nahasdlíí'.",
  },
  {
    tip: "Drinking water with your meals helps your heart work more easily. Small habits add up over time.",
    navajo: "Tó bee naaki yiską́.",
  },
  {
    tip: "Every meal you log is an act of care for yourself and your family. That awareness alone is powerful.",
    navajo: "Bee hózhó nahasdlíí' — nizhóní.",
  },
  {
    tip: "Portion size matters more than food choice. Enjoying traditional foods in balanced amounts keeps culture and health together.",
    navajo: "Ałk'idą́ą́' dóó k'é — hózhó.",
  },
  {
    tip: "Beans, squash, and corn — the Three Sisters — have sustained Navajo families for generations. They are medicine too.",
    navajo: "Naadą́ą́' dóó ndaadą́ą́' — bił hózhó.",
  },
];

// ─── Meal entry type ──────────────────────────────────────────────────────────
interface MealEntry {
  notes: string;
  rating: number | null;
  photo: string | null;
}

type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";
type MealData = Record<MealKey, MealEntry>;

const emptyMeal = (): MealEntry => ({ notes: "", rating: null, photo: null });

// ─── Single meal card ─────────────────────────────────────────────────────────
function MealCard({
  slot, entry, onChange,
}: {
  slot: typeof MEAL_SLOTS[0];
  entry: MealEntry;
  onChange: (updated: MealEntry) => void;
}) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const hasEntry = entry.notes.trim().length > 0 || entry.rating !== null;
  const ratingColor = entry.rating
    ? MEAL_RATINGS.find(r => r.value === entry.rating)?.color ?? "var(--color-subtitle)"
    : "var(--color-subtitle)";

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange({ ...entry, photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: hasEntry
          ? `1.5px solid ${ratingColor}40`
          : "1px solid rgba(33,145,140,0.14)",
        borderLeft: hasEntry ? `4px solid ${ratingColor}` : "1px solid rgba(33,145,140,0.14)",
        borderRadius: "1.35rem",
        padding: "1.25rem 1.25rem 1rem",
        boxShadow: hasEntry
          ? `0 6px 22px ${ratingColor}12`
          : "0 4px 16px rgba(59,82,139,0.06)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Meal header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.3rem" }}>{slot.emoji}</span>
          <div>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--color-title)", lineHeight: 1 }}>
              {slot.label}
            </h3>
            <p style={{ fontSize: "0.68rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
              {/* {slot.navajo} */}
            </p>
          </div>
        </div>
        {hasEntry && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
            <CheckCircle2 size={18} style={{ color: ratingColor }} />
          </motion.div>
        )}
      </div>

      {/* Visual meal rating */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-placeholder)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          How did this meal feel?
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.3rem" }}>
          {MEAL_RATINGS.map(r => {
            const isSelected = entry.rating === r.value;
            return (
              <motion.button
                key={r.value}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange({ ...entry, rating: isSelected ? null : r.value })}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "0.2rem", padding: "0.5rem 0.2rem",
                  borderRadius: "0.875rem",
                  background: isSelected ? `${r.color}14` : "transparent",
                  border: isSelected ? `1.5px solid ${r.color}50` : "1.5px solid transparent",
                  cursor: "pointer", transition: "all 0.18s",
                }}
              >
                <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{r.emoji}</span>
                <span style={{
                  fontSize: "0.58rem", fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? r.color : "var(--color-placeholder)",
                  textAlign: "center", lineHeight: 1.2,
                  transition: "color 0.18s",
                }}>
                  {r.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notes — casual, low pressure */}
      <div style={{ marginBottom: "0.875rem" }}>
        <textarea
          placeholder={`What did you eat? (e.g. mutton stew, fry bread, corn…)`}
          value={entry.notes}
          onChange={e => onChange({ ...entry, notes: e.target.value })}
          rows={2}
          style={{
            width: "100%",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 400,
            color: "var(--color-body)",
            background: "rgba(59,82,139,0.04)",
            border: "1.5px solid rgba(59,82,139,0.14)",
            borderRadius: "0.875rem",
            padding: "0.75rem 1rem",
            outline: "none",
            resize: "none",
            lineHeight: 1.6,
            transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderColor = "#1a7571"; e.target.style.boxShadow = "0 0 0 3px rgba(26,117,113,0.08)"; }}
          onBlur={e  => { e.target.style.borderColor = "rgba(59,82,139,0.14)"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      {/* Photo upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handlePhoto}
        />

        {entry.photo ? (
          <div style={{ position: "relative", borderRadius: "0.875rem", overflow: "hidden" }}>
            <img
              src={entry.photo}
              alt="Meal photo"
              style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
            />
            <button
              onClick={() => onChange({ ...entry, photo: null })}
              style={{
                position: "absolute", top: "0.5rem", right: "0.5rem",
                padding: "0.3rem", background: "rgba(0,0,0,0.50)",
                border: "none", borderRadius: "50%", cursor: "pointer",
                display: "flex",
              }}
            >
              <X size={14} style={{ color: "#ffffff" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.55rem 1rem",
              background: "rgba(59,82,139,0.05)",
              border: "1.5px dashed rgba(59,82,139,0.22)",
              borderRadius: "0.875rem", cursor: "pointer",
              width: "100%", justifyContent: "center",
            }}
          >
            <Camera size={15} style={{ color: "var(--color-subtitle)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-subtitle)" }}>
              Add a photo (optional)
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function DietLogScreen() {
  const navigate  = useNavigate();
  const tipIndex  = useState(() => Math.floor(Math.random() * NUTRITION_TIPS.length))[0];
  const tip       = NUTRITION_TIPS[tipIndex];

  const [meals, setMeals] = useState<MealData>({
    breakfast: emptyMeal(),
    lunch:     emptyMeal(),
    dinner:    emptyMeal(),
    snacks:    emptyMeal(),
  });

  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const loggedCount = Object.values(meals).filter(m => m.notes.trim() || m.rating !== null).length;
  const hasAny      = loggedCount > 0;

  const updateMeal = (key: MealKey, updated: MealEntry) => {
    setMeals(prev => ({ ...prev, [key]: updated }));
  };

  const handleSave = async () => {
    if (!hasAny) return;
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
          <div aria-hidden="true" style={{ position: "absolute", top: -40, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

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
                  Food Journal
                </h1>
                <p style={{ fontSize: "0.8rem", color: "var(--color-subtitle)", fontStyle: "italic", fontWeight: 500 }}>
                  Today's meals
                </p>
              </div>
            </div>

            {/* Logged count badge */}
            {loggedCount > 0 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.4rem 0.875rem", borderRadius: "9999px",
                  background: "linear-gradient(135deg, #5ec962 0%, #21918c 100%)",
                  boxShadow: "0 3px 12px rgba(94,201,98,0.30)",
                }}
              >
                <Leaf size={13} style={{ color: "#3b0a52" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 800, color: "#3b0a52" }}>
                  {loggedCount}/4 logged
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <div style={{ padding: "0 1.25rem" }}>

          {/* ── Encouraging intro — sets the tone ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(94,201,98,0.20)",
              borderRadius: "1.15rem",
              padding: "0.875rem 1.1rem",
              marginBottom: "1.25rem",
              display: "flex", alignItems: "flex-start", gap: "0.65rem",
            }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🌱</span>
            <p style={{ fontSize: "0.8rem", color: "var(--color-body)", lineHeight: 1.6, fontStyle: "italic" }}>
              Log what you ate today — no perfect meals needed. Every entry is an act of care for yourself.
              {/* <span style={{ color: "var(--color-subtitle)", marginLeft: "0.3rem" }}>
                Bee hózhó nahasdlíí'.
              </span> */}
            </p>
          </motion.div>

          {/* ── Meal cards ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
            {MEAL_SLOTS.map((slot, i) => (
              <motion.div
                key={slot.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.38 }}
              >
                <MealCard
                  slot={slot}
                  entry={meals[slot.key as MealKey]}
                  onChange={updated => updateMeal(slot.key as MealKey, updated)}
                />
              </motion.div>
            ))}
          </div>

          {/* ── Save button ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                    background: "linear-gradient(135deg, rgba(94,201,98,0.12) 0%, rgba(33,145,140,0.08) 100%)",
                    border: "1.5px solid rgba(94,201,98,0.38)",
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: "#5ec962" }} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1a6b1a" }}>
                      Journal saved! 🌿
                    </p>
                    <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "#1a7571" }}>
                      Awareness is the first step to balance.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="save"
                  whileHover={hasAny ? { y: -2, boxShadow: "0 10px 30px rgba(94,201,98,0.35)" } : {}}
                  whileTap={hasAny ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={!hasAny || saving}
                  style={{
                    width: "100%", padding: "1.1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem", fontWeight: 800,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: hasAny ? "#3b0a52" : "rgba(59,82,139,0.30)",
                    background: hasAny
                      ? "linear-gradient(135deg, #5ec962 0%, #21918c 100%)"
                      : "rgba(59,82,139,0.06)",
                    border: hasAny ? "none" : "1.5px solid rgba(59,82,139,0.12)",
                    borderRadius: "1.35rem",
                    cursor: hasAny ? "pointer" : "not-allowed",
                    boxShadow: hasAny ? "0 6px 22px rgba(94,201,98,0.28)" : "none",
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
                      <Leaf size={16} style={{ color: "#3b0a52" }} />
                      Save Journal
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Nutrition tip — encouraging, never judgmental ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(94,201,98,0.18)",
              borderRadius: "1.35rem",
              padding: "1.1rem 1.25rem",
              boxShadow: "0 3px 14px rgba(59,82,139,0.06)",
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(94,201,98,0.15) 0%, rgba(33,145,140,0.12) 100%)",
              border: "1px solid rgba(94,201,98,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Leaf size={16} style={{ color: "#5ec962" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1a7571", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Today's Nourishment Thought
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--color-body)", lineHeight: 1.65, marginBottom: "0.3rem" }}>
                {tip.tip}
              </p>
              <p style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--color-subtitle)" }}>
                {/* {tip.navajo} */}
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}