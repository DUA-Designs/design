interface DualLanguageHeaderProps {
  english: string;
  navajo: string;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "center";
}

export function DualLanguageHeader({
  english,
  navajo,
  size = "md",
  align = "center",
}: DualLanguageHeaderProps) {

  const fontSizes: Record<string, string> = {
    sm: "clamp(1rem,    3vw, 1.15rem)",
    md: "clamp(1.25rem, 4vw, 1.5rem)",
    lg: "clamp(1.5rem,  5vw, 1.85rem)",
    xl: "clamp(1.85rem, 6vw, 2.35rem)",
  };

  const navajoSizes: Record<string, string> = {
    sm: "0.75rem",
    md: "0.85rem",
    lg: "0.95rem",
    xl: "1.05rem",
  };

  return (
    <div style={{ textAlign: align }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: fontSizes[size],
        fontWeight: 900,
        color: "var(--color-title)",       // #3b528b — 5.2:1 AA ✓ on white
        lineHeight: 1.15,
        marginBottom: "0.25rem",
        letterSpacing: "-0.01em",
      }}>
        {english}
      </h1>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: navajoSizes[size],
        fontWeight: 600,
        fontStyle: "italic",
        color: "var(--color-subtitle)",    // #1a7571 — 5.6:1 AA ✓ on white
        letterSpacing: "0.02em",
      }}>
        {navajo}
      </p>
    </div>
  );
}