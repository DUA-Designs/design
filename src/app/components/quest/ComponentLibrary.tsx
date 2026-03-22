/**
 * CARDIO CARE QUEST - COMPONENT LIBRARY
 * 
 * This file documents all reusable components in the Cardio Care Quest design system.
 * These components follow the "Modern Tribal Game" aesthetic with:
 * - Soft-edged 3D elements
 * - Hand-drawn textures
 * - Celebratory animations
 * - Earthy color palette (ochres, turquoise, sage greens, sunset oranges)
 * - Rounded, friendly typography (Nunito/Quicksand)
 * - Dual-language support (English/Navajo)
 */

// ==================== CORE COMPONENTS ====================

export { HealthPillarTile } from "./HealthPillarTile";
/**
 * HealthPillarTile
 * 
 * A game-level tile representing one of the five health pillars.
 * Features:
 * - Circular progress ring indicator
 * - Large, tappable icon
 * - Dual-language labels
 * - Hover animations
 * - Custom color theming
 * 
 * Usage:
 * <HealthPillarTile
 *   icon={Heart}
 *   title="Heart"
 *   titleNavajo="Jáádí"
 *   progress={75}
 *   color="#E87D3E"
 *   onClick={() => navigate('/bp-log')}
 * />
 */

export { DualLanguageHeader } from "./DualLanguageHeader";
/**
 * DualLanguageHeader
 * 
 * Displays page headers in both English and Navajo.
 * Features:
 * - Responsive sizing (sm, md, lg, xl)
 * - Culturally-appropriate typography hierarchy
 * 
 * Usage:
 * <DualLanguageHeader
 *   english="Blood Pressure Log"
 *   navajo="Jáádí Bee Haz'ą́"
 *   size="lg"
 * />
 */

export { XPBadge } from "./XPBadge";
/**
 * XPBadge
 * 
 * Displays user's current XP (experience points) with gold gradient.
 * Features:
 * - Sparkle icon
 * - Optional entrance animation
 * - Gold gradient background
 * 
 * Usage:
 * <XPBadge xp={1250} showAnimation={true} />
 */

export { CelebrationModal } from "./CelebrationModal";
/**
 * CelebrationModal
 * 
 * A warm, encouraging modal for celebrating user achievements.
 * Features:
 * - Spinning celebration icon
 * - Dual-language messages
 * - XP gain animation
 * - Auto-dismiss option
 * - Spring animations
 * 
 * Usage:
 * <CelebrationModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   message="Great Job!"
 *   navajoMessage="Yéego!"
 *   xpGained={50}
 * />
 */

export { BPCard } from "./BPCard";
/**
 * BPCard
 * 
 * Large, prominent card showing blood pressure reading.
 * Features:
 * - Color-coded status (Normal/Elevated/Stage 1/Stage 2)
 * - Trend indicators (up/down/stable)
 * - Heart icon with status color
 * - Timestamp display
 * - Hover animation
 * 
 * Usage:
 * <BPCard
 *   systolic={120}
 *   diastolic={80}
 *   trend="stable"
 *   timestamp="Today at 8:00 AM"
 * />
 */

export { DailyTaskCard } from "./DailyTaskCard";
/**
 * DailyTaskCard
 * 
 * Interactive card for daily health tasks/quests.
 * Features:
 * - Toggle completion state
 * - Gradient background when completed
 * - Check/circle icon indicator
 * - Dual-language task description
 * - Tap animation
 * 
 * Usage:
 * <DailyTaskCard
 *   task="Log your blood pressure"
 *   taskNavajo="Nídiilnish jáádí bee haz'ą́"
 *   completed={false}
 *   onToggle={() => handleToggle()}
 * />
 */

export { BottomNav } from "./BottomNav";
/**
 * BottomNav
 * 
 * Fixed bottom navigation bar with 4 main sections.
 * Features:
 * - Animated active indicator
 * - Soft icons with labels
 * - React Router integration
 * - Responsive layout
 * 
 * Usage:
 * <BottomNav />
 */

// ==================== COLOR PALETTE ====================

/**
 * PRIMARY COLORS
 * 
 * Earthy Ochres:
 * --ochre-light: #F4E4D7 (Backgrounds, subtle highlights)
 * --ochre: #D4A574 (Primary ochre, buttons, accents)
 * --ochre-dark: #B8784D (Darker accents, borders)
 * 
 * Turquoise:
 * --turquoise-light: #B8E6E1 (Light backgrounds, hover states)
 * --turquoise: #5DBDAD (Primary brand color, buttons)
 * --turquoise-dark: #3A8B7D (Dark accents)
 * 
 * Sage Green:
 * --sage-light: #D8E4D0 (Backgrounds)
 * --sage: #8FAA7F (Health/success indicators)
 * --sage-dark: #5C7A4D (Dark accents)
 * 
 * Sunset Orange:
 * --sunset-light: #FFD4B8 (Backgrounds)
 * --sunset: #E87D3E (Accent color, alerts)
 * --sunset-dark: #C85A1E (Destructive actions)
 * 
 * Vibrant Gold (Rewards/XP):
 * --gold-light: #FFE8B3 (Backgrounds)
 * --gold: #FFB81C (XP badges, achievements)
 * --gold-dark: #D99A00 (Dark accents)
 */

// ==================== TYPOGRAPHY ====================

/**
 * FONT FAMILIES
 * 
 * Primary: 'Nunito' - Rounded, friendly sans-serif
 * Secondary: 'Quicksand' - Soft, geometric sans-serif
 * 
 * FONT WEIGHTS
 * 300 - Light (Rarely used)
 * 400-500 - Regular body text
 * 600 - Semibold (Headings, labels)
 * 700-800 - Bold (Main headings)
 * 900 - Extrabold (Large numbers, emphasis)
 */

// ==================== DESIGN PRINCIPLES ====================

/**
 * 1. WELCOMING, NOT CLINICAL
 *    - Avoid harsh whites and sharp edges
 *    - Use warm, earthy tones
 *    - Round all corners (1rem minimum)
 *    - Soft shadows, not harsh borders
 * 
 * 2. GAMIFICATION
 *    - Progress rings/bars everywhere
 *    - XP system for all actions
 *    - Achievement celebrations
 *    - Level-based visual metaphors
 * 
 * 3. CULTURAL RESPECT
 *    - All headers support dual-language
 *    - Navajo text always visible
 *    - Traditional foods/activities featured
 *    - No shaming language
 *    - Community over competition
 * 
 * 4. ACCESSIBILITY
 *    - Large, tappable targets (min 44px)
 *    - High contrast text
 *    - Clear visual hierarchy
 *    - Simple, direct language
 * 
 * 5. CELEBRATION
 *    - Every action deserves recognition
 *    - Positive reinforcement
 *    - Progress visualization
 *    - Family/community achievements
 */

// ==================== ICON SYSTEM ====================

/**
 * HEALTH PILLAR ICONS (lucide-react)
 * 
 * Heart - Cardiovascular health, BP monitoring
 * Utensils - Diet, nutrition, traditional foods
 * Footprints - Exercise, movement, daily activities
 * Users - Family, community, support network
 * Pill - Medication adherence, prescriptions
 * 
 * SUPPORTING ICONS
 * 
 * Sparkles - XP, achievements, rewards
 * Trophy - Leaderboards, achievements
 * Clock - Time tracking, activity duration
 * CheckCircle/Circle - Task completion
 * TrendingUp/Down - BP trends, progress
 * Smile/Meh/Frown - Mood tracking
 */

// ==================== ANIMATION GUIDELINES ====================

/**
 * MOTION PRINCIPLES (using motion/react)
 * 
 * 1. Spring Physics
 *    - Use spring animations for natural feel
 *    - damping: 15-20 for most interactions
 *    - type: "spring" for buttons, cards
 * 
 * 2. Hover Effects
 *    - scale: 1.02-1.05 (subtle lift)
 *    - y: -5 (slight elevation)
 *    - transition: smooth, quick
 * 
 * 3. Tap Feedback
 *    - scale: 0.95-0.98 (press down)
 *    - Immediate response
 * 
 * 4. Page Transitions
 *    - opacity: 0 to 1
 *    - x: ±50 for slide effects
 *    - Stagger for lists
 * 
 * 5. Celebrations
 *    - rotate: 360 for icons
 *    - scale: [0, 1.1, 1] for bounce
 *    - Delay chains for effects
 */

// This is a documentation file - no executable code needed
export default null;
