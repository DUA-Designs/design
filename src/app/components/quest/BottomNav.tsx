import { Home, Activity, Users, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { icon: Home,     label: "Home",    path: "/home"    },
  { icon: Activity, label: "Health",  path: "/bp-log"  },
  { icon: Users,    label: "Family",  path: "/family"  },
  { icon: User,     label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,0.93)",
      backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      borderTop: "1px solid rgba(33,145,140,0.13)",
      boxShadow: "0 -4px 24px rgba(59,82,139,0.07)",
      zIndex: 40,
    }}>
      {/* Viridis top line */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)",
      }} />

      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "0.55rem 0.5rem 0.75rem",
        maxWidth: 480, margin: "0 auto",
      }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "0.18rem", padding: "0.45rem 1rem",
                borderRadius: "0.875rem", background: "none",
                border: "none", cursor: "pointer", position: "relative",
                minWidth: 56,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  style={{
                    position: "absolute", inset: 0, borderRadius: "0.875rem",
                    background: "rgba(26,117,113,0.08)",
                    border: "1.5px solid rgba(26,117,113,0.18)",
                  }}
                  transition={{ type: "spring", damping: 22, stiffness: 320 }}
                />
              )}
              <Icon
                size={21} strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  position: "relative", zIndex: 1,
                  color: isActive ? "#1a7571" : "rgba(59,82,139,0.40)",
                  transition: "color 0.2s",
                }}
              />
              <span style={{
                position: "relative", zIndex: 1,
                fontSize: "0.62rem", fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1a7571" : "rgba(59,82,139,0.40)",
                transition: "color 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
