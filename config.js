// Global application configuration and threshold constants
import { PRIORITIES } from './constants/lists.js';

// Default attendance threshold percentage
export const DEFAULT_ATTENDANCE_THRESHOLD = 75;

// Warning range above threshold
export const BORDERLINE_BAND = 5;

// Threshold days for urgent tasks
export const DUE_SOON_DAYS = 3;

// Bounds for threshold adjustment
export const THRESHOLD_MIN = 50;
export const THRESHOLD_MAX = 95;
export const THRESHOLD_STEP = 5;

// Default target percentage for final grade calculator
export const DEFAULT_TARGET_OVERALL = 70;

// Re-export task priorities from lists
export { PRIORITIES };
export const PRIORITY_IDS = PRIORITIES.map((p) => p.id);

// Attendance status mapping
export const ATTENDANCE_STATUS = {
  below: { id: 'below', label: 'Below threshold', tone: 'danger', icon: '▼' },
  at: { id: 'at', label: 'At threshold', tone: 'warn', icon: '●' },
  above: { id: 'above', label: 'Above threshold', tone: 'safe', icon: '▲' },
  none: { id: 'none', label: 'No classes yet', tone: 'muted', icon: '–' },
};

// Task urgency status mapping
export const TASK_URGENCY = {
  overdue: { id: 'overdue', label: 'Overdue', tone: 'danger', icon: '!' },
  soon: { id: 'soon', label: 'Due soon', tone: 'warn', icon: '●' },
  later: { id: 'later', label: 'Upcoming', tone: 'safe', icon: '○' },
  done: { id: 'done', label: 'Completed', tone: 'muted', icon: '✓' },
};
