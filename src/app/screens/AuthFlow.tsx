import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Trash2 } from "lucide-react";

const APP_NAME = "Cardio Care Quest";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type InputType = "text" | "number" | "radio" | "checkbox" | "slider" | "signature";
type FormData  = Record<string, string | string[] | number>;

interface FieldOption { label: string; value: string; }

interface Field {
  fieldKey: string;
  inputType: InputType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  unit?: string;
  description?: string;           // HTML string — used for consent block
  options?: FieldOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
  showIf?: (data: FormData) => boolean; // conditional visibility
}

interface Step {
  id: number;
  groupTitle: string;
  subtitle?: string;
  fields: Field[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS  — real data from the research protocol
// ═══════════════════════════════════════════════════════════════════════════════

const STEPS: Step[] = [
  {
    id: 1,
    groupTitle: "Basic Information",
    fields: [
      { fieldKey: "firstName", inputType: "text",   title: "First Name",  placeholder: "Enter your first name" },
      { fieldKey: "lastName",  inputType: "text",   title: "Last Name",   placeholder: "Enter your last name"  },
      { fieldKey: "zipCode",   inputType: "number", title: "Zip Code",    placeholder: "e.g. 78701", unit: "" },
      { fieldKey: "state",     inputType: "text",   title: "State",       placeholder: "e.g. Texas"  },
      { fieldKey: "city",      inputType: "text",   title: "City",        placeholder: "e.g. Austin" },
    ],
  },
  {
    id: 2,
    groupTitle: "Identity Details",
    fields: [
      {
        fieldKey: "gender",
        inputType: "radio",
        title: "Gender",
        options: [
          { label: "Male",   value: "male"   },
          { label: "Female", value: "female" },
          { label: "Other",  value: "other"  },
        ],
      },
      {
        fieldKey: "genderSpecify",
        inputType: "text",
        title: "Please specify your gender",
        placeholder: "Describe your gender identity",
        showIf: (data) => data["gender"] === "other",
      },
      {
        fieldKey: "raceSpecify",
        inputType: "text",
        title: "Please specify your Race / Ethnicity",
        placeholder: "e.g. Navajo Nation, Hispanic, etc.",
      },
    ],
  },
  {
    id: 3,
    groupTitle: "Experience Setup",
    fields: [
      {
        fieldKey: "playerMode",
        inputType: "radio",
        title: "How will you use this app?",
        options: [
          { label: "Single-player", value: "single" },
          { label: "Multi-player",  value: "multi"  },
        ],
      },
      {
        fieldKey: "playerCount",
        inputType: "number",
        title: "How many players will participate?",
        placeholder: "e.g. 2",
        unit: "players",
        showIf: (data) => data["playerMode"] === "multi",
      },
    ],
  },
  {
    id: 4,
    groupTitle: "App Management",
    fields: [
      {
        fieldKey: "bpAppUsage",
        inputType: "radio",
        title: "Do you currently use an app to manage your blood pressure?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No",  value: "no"  },
        ],
      },
      {
        fieldKey: "bpAppType",
        inputType: "text",
        title: "Which app do you use to manage your blood pressure?",
        placeholder: "e.g. MyFitnessPal, Apple Health…",
        showIf: (data) => data["bpAppUsage"] === "yes",
      },
    ],
  },
  {
    id: 5,
    groupTitle: "Pre-Survey — Form 1",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q1", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I decided to start using ${APP_NAME} because other people want me to use it.` },
      { fieldKey: "q2", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would expect ${APP_NAME} to be interesting to use.` },
      { fieldKey: "q3", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I believe ${APP_NAME} could improve my life.` },
      { fieldKey: "q4", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} could help me do something important.` },
      { fieldKey: "q5", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would want others to know I use ${APP_NAME}.` },
    ],
  },
  {
    id: 6,
    groupTitle: "Pre-Survey — Form 2",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q6",  inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel bad about myself if I didn't try ${APP_NAME}.` },
      { fieldKey: "q7",  inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I think ${APP_NAME} would be enjoyable.` },
      { fieldKey: "q8",  inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I am required to use ${APP_NAME} (e.g. by my job, hospital, or family).` },
      { fieldKey: "q9",  inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} could be of value to me.` },
      { fieldKey: "q10", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would be fun to use.` },
    ],
  },
  {
    id: 7,
    groupTitle: "Pre-Survey — Form 3",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q11", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would look good to others if I use it.` },
      { fieldKey: "q12", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel confident that I could use ${APP_NAME} effectively.` },
      { fieldKey: "q13", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would be easy for me to use.` },
      { fieldKey: "q14", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel very capable and effective at using ${APP_NAME}.` },
      { fieldKey: "q15", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel confident in my ability to use ${APP_NAME}.` },
    ],
  },
  {
    id: 8,
    groupTitle: "Pre-Survey — Form 4",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q16", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `Learning how to use ${APP_NAME} would be difficult.` },
      { fieldKey: "q17", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would find the ${APP_NAME} interface and controls confusing.` },
      { fieldKey: "q18", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `It won't be easy for me to use ${APP_NAME}.` },
      { fieldKey: "q19", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would provide me with useful options and choices.` },
      { fieldKey: "q20", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would be able to get ${APP_NAME} to do what I want.` },
    ],
  },
  {
    id: 9,
    groupTitle: "Pre-Survey — Form 5",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q21", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel pressured by the use of ${APP_NAME}.` },
      { fieldKey: "q22", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would feel intrusive.` },
      { fieldKey: "q23", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would feel controlling.` },
      { fieldKey: "q24", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would help me form or sustain fulfilling relationships.` },
      { fieldKey: "q25", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would help me feel part of a larger community.` },
    ],
  },
  {
    id: 10,
    groupTitle: "Pre-Survey — Form 6",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q26", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} would make me feel connected to other people.` },
      { fieldKey: "q27", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I wouldn't feel close to other users using ${APP_NAME}.` },
      { fieldKey: "q28", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `${APP_NAME} wouldn't support meaningful connections to others.` },
      { fieldKey: "q29", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would find using ${APP_NAME} too difficult to do regularly.` },
    ],
  },
  {
    id: 11,
    groupTitle: "Pre-Survey — Form 7",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q30", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would only use ${APP_NAME} because I have to.` },
      { fieldKey: "q31", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would find using ${APP_NAME} to track blood pressure too challenging.` },
      { fieldKey: "q32", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `It would be easy to use ${APP_NAME} to help me remember to take my medication on time.` },
    ],
  },
  {
    id: 12,
    groupTitle: "Pre-Survey — Form 8",
    subtitle: "Please rate how much you agree with each statement. (1 = Strongly Disagree, 7 = Strongly Agree)",
    fields: [
      { fieldKey: "q33", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would use ${APP_NAME} to help remember my medication because other people want me to.` },
      { fieldKey: "q34", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `I would feel guilty if I don't use ${APP_NAME} to track my blood pressure.` },
      { fieldKey: "q35", inputType: "slider", sliderMin: 1, sliderMax: 7, sliderMinLabel: "Strongly disagree", sliderMaxLabel: "Strongly agree", title: `Using ${APP_NAME} to remember my medication would help me feel part of a larger community.` },
    ],
  },
  {
    id: 13,
    groupTitle: "Additional Reflections",
    subtitle: "Please share any final thoughts about your heart health journey.",
    fields: [
      {
        fieldKey: "additionalNotes",
        inputType: "text",
        title: "Sharing more / Nahane'",
        placeholder: "Your answer…",
      },
    ],
  },
  {
    id: 14,
    groupTitle: "Consent to Participate",
    subtitle: "Please read the consent form carefully, then sign below to confirm your agreement.",
    fields: [
      {
        fieldKey: "consentAgreement",
        inputType: "checkbox",
        title: "",
        description: `
<strong>Title:</strong> CardioCare Quest: A Co-created Serious Game for High Blood Pressure Healthcare Compliance<br/><br/>
<strong>Principal Investigator:</strong> Jared Duval, PhD; Tochukwu Ikwunne, PhD; Creaque Charles Tyler (Texas State University), PharmD<br/><br/>
<strong>Summary of the research:</strong><br/>
This is a consent form for participation in a research study. Your participation is voluntary. It contains important information about this study and what to expect if you decide to participate. Please consider the information carefully.<br/><br/>
You are being asked to participate in a study about creating a serious game for health (called CardioCare Quest) that enhances treatment compliance of High Blood Pressure (HBP) for indigenous populations. CardioCare Quest will offer an enjoyable way for individuals to stay connected to their HBP treatment plans while providing valuable data for medical professionals.<br/><br/>
<strong>AGREEMENT TO PARTICIPATE</strong><br/>
I have read (or someone has read to me) this form, and I am aware that I am being asked to participate in a research study. I have had the opportunity to ask questions and have had them answered to my satisfaction. I affirm that I am at least 18 years of age and voluntarily agree to participate in this study.<br/><br/>
I am not giving up any legal rights by signing this form. I will be given a copy of this form.
        `,
        options: [{ label: "I have read and agree to the terms above", value: "agreed" }],
      },
      {
        fieldKey: "digitalSignature",
        inputType: "signature",
        title: "Digital Signature",
        subtitle: "Please sign in the box below using your mouse or finger.",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// VIRIDIS PROGRESS COLOR
// ═══════════════════════════════════════════════════════════════════════════════

function viridisProgressColor(step: number, total: number): string {
  const t = step / total;
  if (t < 0.25) return "#440154";
  if (t < 0.50) return "#3b528b";
  if (t < 0.75) return "#21918c";
  if (t < 0.95) return "#5ec962";
  return "#fde725";
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNATURE PAD
// ═══════════════════════════════════════════════════════════════════════════════

function SignaturePad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const drawing    = useRef(false);
  const lastPos    = useRef<{ x: number; y: number } | null>(null);

  // Restore existing signature on mount
  useEffect(() => {
    if (value && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current!;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d")!;
    const pos    = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#2d3a5e";
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPos.current = null;
    onChange(canvasRef.current?.toDataURL() ?? "");
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{
        position: "relative",
        borderRadius: "1.25rem",
        overflow: "hidden",
        border: "1.5px solid rgba(59,82,139,0.30)",
        background: "#ffffff",
      }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={220}
          style={{ width: "100%", height: 180, display: "block", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Baseline */}
        <div style={{
          position: "absolute", bottom: 36, left: "5%", right: "5%",
          height: 1, background: "rgba(59,82,139,0.15)", pointerEvents: "none",
        }} />
        {!value && (
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "0.85rem", color: "rgba(59,82,139,0.30)",
            fontStyle: "italic", pointerEvents: "none",
          }}>
            Sign here
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          marginTop: "0.6rem",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.8rem", fontWeight: 600,
          color: "var(--color-placeholder)",
        }}
      >
        <Trash2 size={13} />
        Clear signature
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIELD RENDERER — renders a single field based on inputType
// ═══════════════════════════════════════════════════════════════════════════════

function FieldRenderer({
  field, value, onChange, onToggle,
}: {
  field: Field;
  value: string | string[] | number;
  onChange: (v: string | number) => void;
  onToggle: (v: string) => void;
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: field.unit ? "1rem 4rem 1rem 1.1rem" : "1rem 1.1rem",
    fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500,
    color: "var(--color-body)", background: "#ffffff",
    border: "1.5px solid rgba(59,82,139,0.30)",
    borderRadius: "1rem", outline: "none",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#1a7571";
    e.target.style.boxShadow   = "0 0 0 3.5px rgba(26,117,113,0.12)";
  };
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(59,82,139,0.30)";
    e.target.style.boxShadow   = "none";
  };

  // ── text / number ──────────────────────────────────────────────────────────
  if (field.inputType === "text" || field.inputType === "number") {
    return (
      <div style={{ position: "relative" }}>
        <input
          type={field.inputType}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          aria-label={field.title}
          style={inputStyle}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        {field.unit && (
          <span style={{
            position: "absolute", right: "1.1rem", top: "50%", transform: "translateY(-50%)",
            fontSize: "0.8rem", fontWeight: 600, color: "var(--color-placeholder)",
          }}>
            {field.unit}
          </span>
        )}
      </div>
    );
  }

  // ── radio ──────────────────────────────────────────────────────────────────
  if (field.inputType === "radio" && field.options) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {field.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button key={opt.value} type="button"
              onClick={() => onChange(opt.value)} aria-pressed={selected}
              style={{
                display: "flex", alignItems: "center", gap: "0.8rem",
                padding: "0.8rem 1.1rem", textAlign: "left", cursor: "pointer",
                background: selected ? "rgba(26,117,113,0.07)" : "#ffffff",
                border: `1.5px solid ${selected ? "#1a7571" : "rgba(59,82,139,0.22)"}`,
                borderRadius: "1rem",
                boxShadow: selected ? "0 0 0 3px rgba(26,117,113,0.10)" : "none",
                transition: "all 0.18s",
              }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${selected ? "#1a7571" : "rgba(59,82,139,0.35)"}`,
                background: selected ? "#1a7571" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
              }}>
                {selected && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: selected ? 700 : 500, color: selected ? "#1a7571" : "var(--color-body)", transition: "color 0.18s" }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── checkbox ───────────────────────────────────────────────────────────────
  if (field.inputType === "checkbox" && field.options) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {field.description && (
          <div
            style={{
              background: "rgba(59,82,139,0.04)",
              border: "1px solid rgba(59,82,139,0.12)",
              borderRadius: "1rem",
              padding: "1.25rem 1.5rem",
              fontSize: "0.85rem",
              lineHeight: 1.75,
              color: "var(--color-body)",
              maxHeight: 260,
              overflowY: "auto",
              marginBottom: "1rem",
            }}
            dangerouslySetInnerHTML={{ __html: field.description }}
          />
        )}
        {field.options.map((opt) => {
          const checked = ((value as string[]) ?? []).includes(opt.value);
          return (
            <button key={opt.value} type="button"
              onClick={() => onToggle(opt.value)} aria-pressed={checked}
              style={{
                display: "flex", alignItems: "center", gap: "0.8rem",
                padding: "0.8rem 1.1rem", textAlign: "left", cursor: "pointer",
                background: checked ? "rgba(26,117,113,0.07)" : "#ffffff",
                border: `1.5px solid ${checked ? "#1a7571" : "rgba(59,82,139,0.22)"}`,
                borderRadius: "1rem",
                boxShadow: checked ? "0 0 0 3px rgba(26,117,113,0.10)" : "none",
                transition: "all 0.18s",
              }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${checked ? "#1a7571" : "rgba(59,82,139,0.35)"}`,
                background: checked ? "#1a7571" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
              }}>
                {checked && <Check size={11} color="#fff" strokeWidth={3} />}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: checked ? 700 : 500, color: checked ? "#1a7571" : "var(--color-body)", transition: "color 0.18s" }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── slider ─────────────────────────────────────────────────────────────────
  if (field.inputType === "slider") {
    const num = (value as number) ?? field.sliderMin ?? 1;
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <motion.div
            key={num}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12 }}
            style={{
              width: 58, height: 58, borderRadius: "50%",
              background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(253,231,37,0.32)",
            }}
          >
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#3b0a52" }}>
              {num}
            </span>
          </motion.div>
        </div>
        <input type="range"
          min={field.sliderMin ?? 1} max={field.sliderMax ?? 7} step={1}
          value={num}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={field.title}
          aria-valuemin={field.sliderMin ?? 1}
          aria-valuemax={field.sliderMax ?? 7}
          aria-valuenow={num}
          style={{ width: "100%", accentColor: "#1a7571", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-placeholder)" }}>
          <span>{field.sliderMinLabel ?? field.sliderMin}</span>
          <span>{field.sliderMaxLabel ?? field.sliderMax}</span>
        </div>
      </div>
    );
  }

  // ── signature ──────────────────────────────────────────────────────────────
  if (field.inputType === "signature") {
    return (
      <SignaturePad
        value={value as string}
        onChange={(v) => onChange(v)}
      />
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH FLOW
// ═══════════════════════════════════════════════════════════════════════════════

export function AuthFlow() {
  const navigate = useNavigate();
  const [view, setView] = useState<"login" | "signup">("login");
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
      <AnimatePresence mode="wait">
        {view === "login" && (
          <LoginPage key="login" onLogin={() => navigate("/home")} onNavigateToSignup={() => setView("signup")} />
        )}
        {view === "signup" && (
          <SignupFlow key="signup" onComplete={() => navigate("/home")} onBack={() => setView("login")} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

interface LoginPageProps { onLogin: () => void; onNavigateToSignup: () => void; }

function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", background: "var(--color-bg-gradient)", backgroundColor: "var(--color-bg)",
        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "fixed", width: 480, height: 480, top: -120, right: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "fixed", width: 360, height: 360, bottom: -80, left: -80, borderRadius: "50%", background: "radial-gradient(circle, rgba(33,145,140,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "relative", overflow: "hidden", width: "100%", maxWidth: 440,
          padding: "3rem 2.75rem 2.75rem", textAlign: "center",
          background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
          border: "1px solid rgba(33,145,140,0.22)", borderRadius: "2rem",
          boxShadow: "0 24px 64px rgba(59,82,139,0.13), 0 4px 16px rgba(33,145,140,0.09)",
        }}
      >
        {/* EKG Heart Icon */}
        <div aria-hidden="true" style={{ position: "relative", width: 88, height: 88, margin: "0 auto 1.75rem" }}>
          <motion.div
            animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,231,37,0.22) 0%, transparent 68%)" }}
          />
          <div style={{
            position: "relative", width: "100%", height: "100%", borderRadius: "50%",
            background: "linear-gradient(135deg, #fde725 0%, #5ec962 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(94,201,98,0.28)",
          }}>
            <svg width="46" height="44" viewBox="0 0 46 44" fill="none">
              <path d="M23 40 C23 40 3 26 3 14.5 C3 8.8 7.3 4 13 4 C17 4 20.5 6.2 23 10 C25.5 6.2 29 4 33 4 C38.7 4 43 8.8 43 14.5 C43 26 23 40 23 40Z" fill="#3b0a52" opacity={0.92} />
              <polyline points="6,22 11,22 13,17 15,27 17,14 19,28 21,22 25,22 27,19 29,22 40,22" stroke="#fde725" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(1.85rem, 5vw, 2.35rem)", color: "var(--color-title)", letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: "0.45rem" }}>
          Cardio Care Quest
        </h1>
        <p style={{ fontSize: "1rem", fontWeight: 700, fontStyle: "italic", color: "var(--color-subtitle)", marginBottom: "2.25rem", letterSpacing: "0.02em" }}>
          <em>Biih ííyá</em>
          <span aria-hidden="true" style={{ opacity: 0.35, margin: "0 0.45rem", fontStyle: "normal" }}>•</span>
          Login
        </p>

        <form noValidate onSubmit={(e) => { e.preventDefault(); onLogin(); }} aria-label="Login form">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.75rem" }}>
            {[
              { id: "participant-id", type: "text",     placeholder: "Participant ID",  icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>, label: "Participant ID" },
              { id: "password",       type: "password", placeholder: "Password",        icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>, label: "Password" },
            ].map(({ id, type, placeholder, icon, label }) => (
              <div key={id} style={{ position: "relative" }}>
                <label htmlFor={id} className="sr-only">{label}</label>
                <input id={id} type={type} placeholder={placeholder} aria-required="true"
                  autoComplete={type === "password" ? "current-password" : "username"}
                  style={{ width: "100%", padding: "1.05rem 1.1rem 1.05rem 2.9rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500, color: "var(--color-body)", background: "#ffffff", border: "1.5px solid rgba(59,82,139,0.30)", borderRadius: "1.25rem", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a7571"; e.target.style.boxShadow = "0 0 0 3.5px rgba(26,117,113,0.12)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(59,82,139,0.30)"; e.target.style.boxShadow = "none"; }}
                />
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b528b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, opacity: 0.55, pointerEvents: "none" }}>
                  {icon}
                </svg>
              </div>
            ))}
          </div>

          <motion.button type="submit"
            whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(253,231,37,0.50), 0 4px 12px rgba(0,0,0,0.07)" }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "1.15rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-btn-text)", background: "var(--color-btn-bg)", border: "none", borderRadius: "1.25rem", cursor: "pointer", boxShadow: "var(--color-btn-glow)", marginBottom: "1.5rem" }}
          >
            Enter the Quest
          </motion.button>
        </form>

        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem", color: "var(--color-placeholder)", fontSize: "0.8rem" }}>
          <span style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />or<span style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        </div>

        <button type="button" onClick={onNavigateToSignup}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-link)", textDecoration: "underline", textUnderlineOffset: 5, textDecorationColor: "rgba(26,117,113,0.40)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecorationColor = "#1a7571")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = "rgba(26,117,113,0.40)")}
        >
          New user? Join the Circle
        </button>

        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 2rem 2rem" }} />
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNUP FLOW — 14-step research questionnaire
// ═══════════════════════════════════════════════════════════════════════════════

interface SignupFlowProps { onComplete: () => void; onBack: () => void; }

function SignupFlow({ onComplete, onBack }: SignupFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData,    setFormData]    = useState<FormData>({});
  const [direction,   setDirection]   = useState<1 | -1>(1);

  const step       = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const isLast     = currentStep === totalSteps - 1;
  const progressColor = viridisProgressColor(currentStep + 1, totalSteps);

  const getValue = (key: string, inputType: InputType): string | string[] | number => {
    if (inputType === "slider")   return (formData[key] as number)   ?? 1;
    if (inputType === "checkbox") return (formData[key] as string[]) ?? [];
    return (formData[key] as string) ?? "";
  };

  const setValue = (key: string, val: string | string[] | number) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const toggleCheckbox = (key: string, value: string) => {
    const current = (formData[key] as string[]) ?? [];
    setValue(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const goNext = () => {
    if (isLast) { onComplete(); return; }
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  const goPrev = () => {
    if (currentStep === 0) { onBack(); return; }
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  const visibleFields = step.fields.filter((f) => !f.showIf || f.showIf(formData));

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", background: "var(--color-bg-gradient)", backgroundColor: "var(--color-bg)",
        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "fixed", width: 480, height: 480, top: -120, right: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,201,98,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "fixed", width: 360, height: 360, bottom: -80, left: -80, borderRadius: "50%", background: "radial-gradient(circle, rgba(33,145,140,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        position: "relative", overflow: "hidden", width: "100%", maxWidth: 560,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px) saturate(1.3)",
        WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        border: "1px solid rgba(33,145,140,0.22)", borderRadius: "2rem",
        boxShadow: "0 24px 64px rgba(59,82,139,0.13), 0 4px 16px rgba(33,145,140,0.09)",
      }}>

        {/* Progress header */}
        <div style={{ padding: "1.75rem 2.25rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: progressColor, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.4s ease" }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--color-placeholder)" }}>
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
            </span>
          </div>

          {/* Segmented Viridis bar */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalSteps}, 1fr)`, gap: 3, marginBottom: "1.5rem" }}>
            {STEPS.map((s, i) => {
              const isDone    = i < currentStep;
              const isCurrent = i === currentStep;
              const segColor  = viridisProgressColor(i + 1, totalSteps);
              return (
                <div key={s.id} style={{ height: 6, borderRadius: 999, position: "relative", overflow: "hidden", backgroundColor: isDone || isCurrent ? segColor : "rgba(59,82,139,0.12)", transition: "background-color 0.4s ease" }}>
                  {isCurrent && (
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      style={{ position: "absolute", inset: 0, backgroundColor: segColor, borderRadius: 999 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div style={{ padding: "0 2.25rem 1.25rem", maxHeight: "60vh", overflowY: "auto" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} custom={direction}
              initial={{ opacity: 0, x: direction * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Group title */}
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "var(--color-title)", lineHeight: 1.25, marginBottom: step.subtitle ? "0.4rem" : "1.25rem" }}>
                {step.groupTitle}
              </h2>
              {step.subtitle && (
                <p style={{ fontSize: "0.85rem", color: "var(--color-subtitle)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  {step.subtitle}
                </p>
              )}

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {visibleFields.map((field) => (
                  <div key={field.fieldKey}>
                    {field.title && (
                      <label htmlFor={field.fieldKey} style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-body)", marginBottom: "0.4rem", lineHeight: 1.4 }}>
                        {field.title}
                      </label>
                    )}
                    <FieldRenderer
                      field={field}
                      value={getValue(field.fieldKey, field.inputType)}
                      onChange={(v) => setValue(field.fieldKey, v)}
                      onToggle={(v) => toggleCheckbox(field.fieldKey, v)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1.25rem 2.25rem 2rem", borderTop: "1px solid rgba(59,82,139,0.10)" }}>
          <motion.button type="button" onClick={goPrev} whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.4rem", minHeight: 44, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-subtitle)", background: "rgba(26,117,113,0.06)", border: "1.5px solid rgba(26,117,113,0.20)", borderRadius: "1.25rem" }}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            {currentStep === 0 ? "Login" : "Back"}
          </motion.button>

          <motion.button type="button" onClick={goNext}
            whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(253,231,37,0.50), 0 4px 12px rgba(0,0,0,0.07)" }}
            whileTap={{ scale: 0.98 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", flex: 1, padding: "0.85rem 1.4rem", minHeight: 44, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-btn-text)", background: "var(--color-btn-bg)", border: "none", borderRadius: "1.25rem", boxShadow: "var(--color-btn-glow)" }}>
            {isLast ? "Join the Circle" : "Next"}
            {isLast ? <Check size={16} strokeWidth={2.5} /> : <ArrowRight size={16} strokeWidth={2.5} />}
          </motion.button>
        </div>

        {/* Viridis bar */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)", borderRadius: "0 0 2rem 2rem" }} />
      </div>
    </motion.div>
  );
}