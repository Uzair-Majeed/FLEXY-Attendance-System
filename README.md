# 📱 FLEXY — Attendance System
### Student Companion App · SMD Assignment 01

A **React Native** student utility app built with **Expo** that helps university students track attendance, monitor marks, manage tasks, and simulate hypothetical attendance scenarios — all without a backend or database.

---

## 📌 Proposed Solution

The goal was to build a lightweight, self-contained student dashboard app that runs on both **Android** and **Web** using a single codebase. Since no database is required, all state lives in JavaScript arrays and objects in memory, seeded from `data/initialData.js`. A single `theme.js` file defines all design tokens (colors, spacing, typography, radius) so every screen and component shares a consistent dark, sharp visual style.

Navigation is intentionally simple — no tab bar or drawer. Screens are rendered conditionally based on a `currentView` string in `App.js`, and each screen exposes a back button to return to the Dashboard.

---

## ✨ Major Features

### 🏠 Dashboard
- **Summary stat cards** — overall attendance %, courses below threshold, pending tasks, and overdue count at a glance.
- **Smart alert banners** — automatically shown when attendance drops below the configured threshold or tasks are overdue / due within 3 days.
- **Adjustable attendance threshold** — a stepper control lets the student set their required attendance % (50–95%, step 5). All calculations update in real time.
- **Three charts:**
  - **Attendance Bar Chart** — per-course attendance bars, color-coded red/blue by threshold.
  - **Semester Health Chart** — radial/composite view of overall semester standing.
  - **Workload Chart** — visualizes pending task distribution across courses.
- **Upcoming tasks** — a preview of the next pending tasks with urgency indicators.
- **Quick navigation** — buttons to jump directly into Attendance, Marks, or Tasks screens.

### 📋 Attendance Screen
- Lists all enrolled courses as **expandable course cards**.
- Each card shows: attendance %, a color-coded status pill (Below / At / Above / No classes yet), a progress bar, classes attended vs. held, and remaining classes.
- **Mark Present / Mark Absent** buttons to log today's attendance with a single tap.
- **Undo** — up to 10 recent attendance actions can be undone.
- **Search & filter** — search courses by name/code; filter by All / Below / Safe.
- **Sort** — sort by risk (lowest attendance first), name, or credit hours.
- **What-If Calculator** — embedded inside each course card; lets the student simulate: *"If I attend / miss the next N classes, what will my attendance be?"* Shows the projected percentage and whether it stays above the threshold.
- **Contextual advice messages** — each card shows a plain-English recommendation based on current attendance (e.g., "You can miss 2 more classes safely" or "Attend all remaining classes to recover.").

### 📊 Marks Screen
- **Per-course breakdown** — select any course from a tab strip and see every assessment (quizzes, assignments, midterm, final) with obtained/total marks and weight.
- **Weighted progress bars** — each assessment row shows a proportional fill bar.
- **Weighted average** — live calculation of the current weighted percentage across graded assessments, with a letter grade badge (A, B+, C, etc.).
- **Target grade calculator** — a stepper lets the student set a desired final %, and the app calculates the exact score needed in remaining assessments to hit that target.
- **Status pills** — each assessment is tagged Graded, Pending, or a pass/fail indicator.

### ✅ Tasks Screen
- **Add tasks** via an inline form: title, linked course, due date (quick-pick buttons for Today / Tomorrow / +3 days / +7 days, or type manually), and priority (High / Medium / Low).
- **Filter** by course, status (Pending / Completed / All), and urgency.
- **Sort** by due date, priority, or course.
- **Check off** tasks as complete with a single tap.
- **Delete** tasks with a confirmation-free delete button.
- **Task stat cards** — shows total, pending, overdue, and completed counts.
- **Urgency badges** — Overdue (red), Due Soon within 3 days (amber), Upcoming (blue), Done (muted).

---

## 🗂️ Project Structure

```
Assignment_01/
├── App.js                   # Root component; manages navigation state and global state
├── theme.js                 # Design tokens: colors, spacing, radius, typography
├── config.js                # App-wide constants (thresholds, urgency days, status maps)
├── index.js                 # Expo entry point
├── app.json                 # Expo app configuration
│
├── data/
│   └── initialData.js       # Hardcoded seed data: student profile, courses, tasks
│
├── constants/
│   └── lists.js             # Shared lists: priorities, sort options, grade scale, etc.
│
├── screens/
│   ├── DashboardScreen.js   # Main dashboard: stats, alerts, charts, tasks preview
│   ├── AttendanceScreen.js  # Course attendance tracking with search, filter, sort
│   ├── MarksScreen.js       # Assessment breakdown and target grade calculator
│   └── TasksScreen.js       # Task management: add, filter, sort, complete, delete
│
└── components/
    ├── AppButton.js          # Reusable button (primary / secondary / danger)
    ├── Card.js               # Generic surface container with border
    ├── CourseCard.js         # Expandable card: attendance, mark buttons, what-if calc
    ├── EmptyState.js         # Centered icon + title + message for empty lists
    ├── FilterTabs.js         # Horizontal scrollable tab strip with counts
    ├── ProgressBar.js        # Fill bar with threshold marker line
    ├── ScreenHeader.js       # Screen title with optional back button
    ├── StatCard.js           # Compact labeled number card for summary stats
    ├── StatusPill.js         # Colored badge pill (danger / warn / safe / muted)
    ├── Stepper.js            # +/− counter control with min/max/step
    ├── TaskCard.js           # Task row with urgency badge, check-off, and delete
    ├── TextField.js          # Styled text input with label and error state
    ├── WhatIfCalculator.js   # Attendance simulation embedded inside CourseCard
    └── charts/
        ├── AttendanceBarChart.js   # SVG bar chart: per-course attendance %
        ├── SemesterHealthChart.js  # Composite chart: overall semester health
        └── WorkloadChart.js        # Chart: pending task load by course
```

---

## 🎨 Design System

All visual tokens are defined in `theme.js` and imported across every screen and component.

| Token | Description | Value |
|---|---|---|
| `colors.background` | App background | `#0d0d0d` (near-black) |
| `colors.card` | Card surface | `#1a1a19` |
| `colors.primary` | Accent / highlight | `#9085e9` (soft violet) |
| `colors.danger` | Below threshold / overdue | `#d03b3b` (red) |
| `colors.warning` | Borderline / due soon | `#c98500` (amber) |
| `colors.safe` | Above threshold / on track | `#3987e5` (blue) |
| `spacing` | Scale | xs=4, sm=8, md=12, lg=16, xl=24, xxl=32 |
| `radius` | Rounding | sm=8, md=12, lg=16, pill=999 |
| `type` | Styles | display, title, heading, body, small, caption |

---

## 🧩 Data Model

No database is used. All data is stored in React `useState` hooks in `App.js`, initialized from `data/initialData.js`.

### Course Object
```js
{
  id: 'smd',
  code: 'SMD',
  name: 'Software for Mobile Devices',
  instructor: 'Ms. Hira Naseer',
  creditHours: 3,
  attended: 18,        // classes attended so far
  held: 24,            // classes held so far
  totalPlanned: 32,    // total classes planned for the semester
  assessments: [
    { id: 'midterm', title: 'Midterm',    obtained: 35,   total: 50,  weight: 25 },
    { id: 'final',   title: 'Final Exam', obtained: null, total: 100, weight: 50 },
  ]
}
```

### Task Object
```js
{
  id: 't1',
  title: 'Assignment 1 — FLEX Companion app',
  courseId: 'smd',
  dueDate: '2026-10-05',   // YYYY-MM-DD
  priority: 'high',         // 'high' | 'medium' | 'low'
  completed: false
}
```

---

## 🚀 Setup and Running

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)
- [Expo Go](https://expo.dev/client) app on your phone (for mobile preview)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx expo start
```

From the Expo developer menu:

| Platform | How to open |
|---|---|
| **Web** | Press `w` in the terminal |
| **Android** | Press `a` (needs Android emulator or Expo Go on device) |
| **iOS** | Press `i` (macOS + Xcode, or Expo Go on device) |
| **Physical device** | Scan the QR code with the Expo Go app |

### Web only (fastest for testing)

```bash
npx expo start --web
```

Opens in your browser at `http://localhost:8081`.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `expo` | Build and run React Native apps |
| `react-native` | Core UI components |
| `react-native-svg` | SVG primitives used to build custom charts |
| `react-native-web` | Web target support |
| `react-native-safe-area-context` | Safe area insets for notch/island devices |
| `expo-status-bar` | Status bar tint control |

> `react-native-chart-kit` is present in `package.json` but is **not used** — the charts are implemented directly with `react-native-svg` primitives for full web compatibility.

---

## ⚙️ Configuration

Edit `config.js` to change app-wide defaults:

| Constant | Default | Description |
|---|---|---|
| `DEFAULT_ATTENDANCE_THRESHOLD` | `75` | Starting threshold % |
| `BORDERLINE_BAND` | `5` | Warn if within 5% above threshold |
| `DUE_SOON_DAYS` | `3` | Tasks due within N days = "Due Soon" |
| `THRESHOLD_MIN` | `50` | Lowest the user can set the threshold |
| `THRESHOLD_MAX` | `95` | Highest the user can set the threshold |
| `DEFAULT_TARGET_OVERALL` | `70` | Default target % in the marks calculator |

---

## 👤 Author

**Uzair Majeed** — BS Software Engineering  
FAST NUCES · Spring 2026 · Section SE-7A  
Registration No.: 23I-3063  
Course: Software for Mobile Devices (SMD)
