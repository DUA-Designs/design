# Cardio Care Quest - Design System Documentation

## Overview

**Cardio Care Quest** is a culturally-tailored health informatics application designed for the Diné (Navajo) community. The app transforms cardiovascular health monitoring into an inviting, warm community game rather than a clinical hospital application.

---

## Design Philosophy: "Modern Tribal Game"

### Core Principles

1. **Welcoming, Not Clinical**
   - Soft-edged 3D elements with generous border-radius (1rem+)
   - Warm earthy color palette instead of clinical whites
   - Hand-drawn textures and organic shapes
   - Celebratory animations for all achievements

2. **Gamification**
   - XP (Experience Points) system for all health actions
   - Progress rings and visual feedback
   - Achievement badges and family leaderboards
   - Quest-based daily tasks

3. **Cultural Respect**
   - Dual-language support (English/Navajo) throughout
   - Traditional foods and activities featured
   - Community focus over individual competition
   - No shaming language—always encouraging

4. **Accessibility**
   - Large, tappable targets (minimum 44px)
   - High contrast text on all backgrounds
   - Clear visual hierarchy
   - Simple, direct language

---

## Color Palette

### Earthy Ochres
- `#F4E4D7` - Light ochre (backgrounds, subtle highlights)
- `#D4A574` - Primary ochre (buttons, accents)
- `#B8784D` - Dark ochre (borders, emphasis)

### Turquoise
- `#B8E6E1` - Light turquoise (hover states)
- `#5DBDAD` - Primary turquoise (brand color, primary buttons)
- `#3A8B7D` - Dark turquoise (active states)

### Sage Green
- `#D8E4D0` - Light sage (backgrounds)
- `#8FAA7F` - Primary sage (health/success indicators)
- `#5C7A4D` - Dark sage (emphasis)

### Sunset Orange
- `#FFD4B8` - Light sunset (backgrounds)
- `#E87D3E` - Primary sunset (alerts, warnings)
- `#C85A1E` - Dark sunset (destructive actions)

### Vibrant Gold (Rewards/XP)
- `#FFE8B3` - Light gold (backgrounds)
- `#FFB81C` - Primary gold (XP badges, achievements)
- `#D99A00` - Dark gold (emphasis)

---

## Typography

### Font Families
- **Primary:** 'Nunito' - Rounded, friendly sans-serif
- **Secondary:** 'Quicksand' - Soft, geometric sans-serif

### Font Weights
- **300** - Light (rarely used)
- **400-500** - Regular (body text)
- **600** - Semibold (headings, labels)
- **700-800** - Bold (main headings)
- **900** - Extrabold (large numbers, strong emphasis)

### Usage Guidelines
- All headers must support dual-language strings
- English text uses larger font-size
- Navajo text appears below in a slightly smaller, complementary size
- Maintain 1.5 line-height for readability

---

## Component Library

### Core Components

#### 1. HealthPillarTile
**Purpose:** Interactive tile representing one of five health pillars

**Features:**
- Circular progress ring (0-100%)
- Large icon (Heart, Utensils, Footprints, Users, Pill)
- Dual-language labels
- Hover scale animation (1.05)
- Custom color theming

**Usage:**
```tsx
<HealthPillarTile
  icon={Heart}
  title="Heart"
  titleNavajo="Jáádí"
  progress={75}
  color="#E87D3E"
  onClick={() => navigate('/bp-log')}
/>
```

---

#### 2. DualLanguageHeader
**Purpose:** Page headers in English and Navajo

**Features:**
- Responsive sizing (sm, md, lg, xl)
- Culturally-appropriate hierarchy
- Centered alignment

**Usage:**
```tsx
<DualLanguageHeader
  english="Blood Pressure Log"
  navajo="Jáádí Bee Haz'ą́"
  size="lg"
/>
```

---

#### 3. XPBadge
**Purpose:** Display user's experience points

**Features:**
- Gold gradient background
- Sparkle icon
- Optional entrance animation
- Always visible in header

**Usage:**
```tsx
<XPBadge xp={1250} showAnimation={true} />
```

---

#### 4. CelebrationModal
**Purpose:** Celebrate user achievements

**Features:**
- Spinning celebration icon
- Dual-language congratulations
- XP gain animation with bouncing numbers
- Auto-dismiss after 3 seconds
- Spring-based animations

**Usage:**
```tsx
<CelebrationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  message="Great Job!"
  navajoMessage="Yéego!"
  xpGained={50}
/>
```

---

#### 5. BPCard
**Purpose:** Display blood pressure readings

**Features:**
- Large, prominent numbers
- Color-coded status:
  - Green (#8FAA7F) - Normal (<120/80)
  - Yellow (#FFB81C) - Elevated (120-129/<80)
  - Orange (#E87D3E) - Stage 1 (130-139/80-89)
  - Red (#C85A1E) - Stage 2 (≥140/≥90)
- Trend indicators (↑↓→)
- Heart icon with status color
- Timestamp

**Usage:**
```tsx
<BPCard
  systolic={120}
  diastolic={80}
  trend="stable"
  timestamp="Today at 8:00 AM"
/>
```

---

#### 6. DailyTaskCard
**Purpose:** Interactive daily health task

**Features:**
- Toggle completion state
- Gradient background when completed
- Check/circle icon indicator
- Dual-language task description
- Tap animation (scale 0.98)

**Usage:**
```tsx
<DailyTaskCard
  task="Log your blood pressure"
  taskNavajo="Nídiilnish jáádí bee haz'ą́"
  completed={false}
  onToggle={handleToggle}
/>
```

---

#### 7. BottomNav
**Purpose:** Fixed bottom navigation

**Features:**
- 4 main sections (Home, Health, Family, Profile)
- Animated active indicator (layoutId transition)
- Soft icons with labels
- React Router integration

**Usage:**
```tsx
<BottomNav />
```

---

## Screen Architecture

### Mobile Screens

1. **Splash Screen** (`/`)
   - Zen-like welcome moment
   - Stylized heart/sun logo with animated rays
   - "Begin Journey" button
   - Gradient background

2. **Home Dashboard** (`/home`)
   - Large BP card (most recent reading)
   - Daily task card
   - 5 health pillar tiles in grid
   - XP badge in header
   - Bottom navigation

3. **BP Log Screen** (`/bp-log`)
   - Large numerical inputs (systolic/diastolic)
   - Emoji-based mood check (😊😐☹️)
   - 7-day sparkline chart
   - "Save Reading" button with celebration

4. **Trivia Quiz** (`/trivia`)
   - Progress bar at top
   - Clean question card
   - 4 large answer buttons
   - Real-time XP counter
   - Green/red feedback animations

5. **Diet Log** (`/diet-log`)
   - Grid of traditional food tiles
   - Visual emoji icons (🫓🍲🌽)
   - No shaming—encouraging nutrition tips
   - Multi-select with checkmarks
   - Total calorie summary

6. **Exercise Log** (`/exercise-log`)
   - Activity tiles (walking, herding, housework)
   - Time-based tracking (not calories)
   - Daily goal progress bar
   - Quick time selector modal

7. **Family Circle** (`/family`)
   - "Living room" feel
   - Family member cards with avatars
   - Shared family quest progress
   - Community contribution leaderboard
   - Heart rate status indicators

8. **Profile** (`/profile`)
   - User avatar and stats
   - Achievement badges
   - Settings access
   - XP display

9. **Games Hub** (`/games`)
   - List of educational games
   - BP Trivia, challenges, memory games
   - XP rewards shown

---

### Tablet Screen (Landscape)

**Clinician Dashboard** (`/clinician`)
- Professional, data-forward layout
- Left sidebar navigation
- Patient list with search
- Color-coded alerts (critical/warning)
- Patient detail panel with:
  - BP history charts
  - Medication adherence tracker
  - Trend analysis
  - Current medications list

---

## Animation Guidelines

### Motion Principles (using motion/react)

1. **Spring Physics**
   - Use `type: "spring"` for natural feel
   - `damping: 15-20` for most interactions
   - Smooth, organic movements

2. **Hover Effects**
   ```tsx
   whileHover={{ scale: 1.02-1.05, y: -5 }}
   ```

3. **Tap Feedback**
   ```tsx
   whileTap={{ scale: 0.95-0.98 }}
   ```

4. **Page Transitions**
   ```tsx
   initial={{ opacity: 0, x: 50 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -50 }}
   ```

5. **Celebrations**
   ```tsx
   animate={{ rotate: 360, scale: [0, 1.1, 1] }}
   ```

---

## Icon System (Lucide React)

### Health Pillars
- `Heart` - Cardiovascular health, BP monitoring
- `Utensils` - Diet, nutrition, traditional foods
- `Footprints` - Exercise, movement, activities
- `Users` - Family, community, support
- `Pill` - Medication adherence

### Supporting Icons
- `Sparkles` - XP, achievements, rewards
- `Trophy` - Leaderboards, achievements
- `Clock` - Time tracking
- `CheckCircle/Circle` - Task completion
- `TrendingUp/Down` - BP trends
- `Smile/Meh/Frown` - Mood tracking

---

## Cultural Considerations

### Navajo Language Integration
All user-facing text includes Navajo translations. Common phrases:
- **Yá'át'ééh** - Hello/Welcome
- **Yéego** - Great job/Excellent
- **Nizhónígo** - Beautiful/Well done
- **Jáádí** - Heart
- **Ch'iyáán** - Food
- **Na'ashch'ąąd** - Movement
- **Hakʼéí** - Family
- **Azeeʼ** - Medicine

### Traditional Foods Featured
- Fry Bread (Dahdiniilghaazh)
- Mutton Stew (Dibé Bitoo')
- Blue Corn Mush (Naadą́ą́')
- Squash (Naayízí)
- Beans (Bááh)
- Wild Berries (Didzé)

### Traditional Activities
- Herding (Dibé Ałnáázh)
- Walking (Deesdoi)
- Gardening (Ch'il Łichxí'í)
- Chopping Wood (Chizh Biyaagi)

---

## Technical Stack

- **React** with TypeScript
- **React Router** (Data mode) for navigation
- **Motion** (formerly Framer Motion) for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **Tailwind CSS v4** for styling
- **Google Fonts** (Nunito, Quicksand)

---

## Responsive Design

- **Mobile-first:** Primary experience optimized for 375px-428px
- **Tablet:** Clinician dashboard optimized for landscape (1024px+)
- **Touch-friendly:** All interactive elements ≥44px tap target
- **Safe areas:** Rounded bottom navigation respects mobile notches

---

## Accessibility

- High contrast text ratios (WCAG AA compliant)
- Large touch targets
- Clear visual hierarchy
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly labels

---

## Future Enhancements

- Voice input for BP readings
- Offline mode with local storage
- Push notifications for medication reminders
- Integration with Bluetooth BP monitors
- More educational games
- Video tutorials in Navajo language
- Community challenges and events

---

**Created with ❤️ for the Diné community**
