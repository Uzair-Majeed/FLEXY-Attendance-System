// Static lists and options used across the application

// Attendance sorting options
export const ATTENDANCE_SORT_OPTIONS = [
  { id: 'risk', label: 'Lowest % first' },
  { id: 'code', label: 'Course Code' },
];

// Task sorting options
export const TASK_SORT_OPTIONS = [
  { id: 'due', label: 'Nearest Deadline' },
  { id: 'priority', label: 'Priority' },
];

// Quick date presets for adding tasks
export const QUICK_DATE_OPTIONS = [
  { id: 'today', label: 'Today', days: 0 },
  { id: 'tomorrow', label: 'Tomorrow', days: 1 },
  { id: 'week', label: 'In a week', days: 7 },
];

// Task status filters
export const TASK_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'done', label: 'Completed' },
];

// Attendance status filter options
export const ATTENDANCE_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'below', label: 'Below' },
  { id: 'safe', label: 'Safe' },
];

// Task priority levels
export const PRIORITIES = [
  { id: 'high', label: 'High', rank: 0 },
  { id: 'medium', label: 'Medium', rank: 1 },
  { id: 'low', label: 'Low', rank: 2 },
];

// Colors mapped to task priority
export const PRIORITY_TONE = { high: 'danger', medium: 'warn', low: 'muted' };

// Standard grade thresholds and GPA values
export const GRADE_SCALE = [
  { min: 85, grade: 'A', gpa: 4.0 },
  { min: 80, grade: 'A-', gpa: 3.7 },
  { min: 75, grade: 'B+', gpa: 3.3 },
  { min: 70, grade: 'B', gpa: 3.0 },
  { min: 65, grade: 'B-', gpa: 2.7 },
  { min: 60, grade: 'C+', gpa: 2.3 },
  { min: 55, grade: 'C', gpa: 2.0 },
  { min: 50, grade: 'D', gpa: 1.0 },
  { min: 0, grade: 'F', gpa: 0.0 },
];

// Returns letter grade and GPA for a percentage
export const getGrade = (pct) => {
  if (pct === null || pct === undefined) return { grade: '—', gpa: '—' };
  return GRADE_SCALE.find((g) => pct >= g.min) || { grade: 'F', gpa: 0.0 };
};

// Calculates marks, percentage, and grade for a single course
export const getCourseMarks = (course) => {
  let earned = 0;
  let gradedWeight = 0;
  let totalWeight = 0;

  (course.assessments || []).forEach((a) => {
    totalWeight += a.weight;
    if (a.obtained !== null && a.obtained !== undefined) {
      earned += (a.obtained / a.total) * a.weight;
      gradedWeight += a.weight;
    }
  });

  earned = Math.round(earned * 10) / 10;
  const pct = gradedWeight > 0 ? Math.round((earned / gradedWeight) * 100) : null;
  const gradeInfo = getGrade(pct);
  const isSafe = pct === null ? true : pct >= 50;

  return {
    earned,
    gradedWeight,
    totalWeight,
    pct,
    grade: gradeInfo.grade,
    gpa: gradeInfo.gpa,
    isSafe,
  };
};