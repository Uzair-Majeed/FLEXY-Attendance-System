// Simple helper to get date offset from today (YYYY-MM-DD)
const getDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// Sample student profile data
export const student = {
  name: 'Uzair Majeed',
  rollNo: '23I-3063',
  program: 'BS Software Engineering',
  semester: 'Spring 2026',
  section: 'SE-7A',
};

// Initial course records with attendance and assessments
export const initialCourses = [
  {
    id: 'smd',
    code: 'SMD',
    name: 'Software for Mobile Devices',
    instructor: 'Ms. Hira Naseer',
    creditHours: 3,
    attended: 18,
    held: 24,
    totalPlanned: 32,
    assessments: [
      { id: 'quizzes', title: 'Quizzes', obtained: 16, total: 20, weight: 10 },
      { id: 'assignments', title: 'Assignments', obtained: 27, total: 30, weight: 15 },
      { id: 'midterm', title: 'Midterm', obtained: 35, total: 50, weight: 25 },
      { id: 'final', title: 'Final Exam', obtained: null, total: 100, weight: 50 },
    ],
  },
  {
    id: 'cn',
    code: 'CN',
    name: 'Computer Networks',
    instructor: 'Dr. Adeel Raza',
    creditHours: 3,
    attended: 14,
    held: 24,
    totalPlanned: 32,
    assessments: [
      { id: 'quizzes', title: 'Quizzes', obtained: 12, total: 25, weight: 15 },
      { id: 'labs', title: 'Lab Tasks', obtained: 30, total: 40, weight: 20 },
      { id: 'midterm', title: 'Midterm', obtained: 22, total: 50, weight: 25 },
      { id: 'final', title: 'Final Exam', obtained: null, total: 100, weight: 40 },
    ],
  },
  {
    id: 'dsa',
    code: 'DSA',
    name: 'Design & Analysis of Algorithms',
    instructor: 'Dr. Sana Malik',
    creditHours: 3,
    attended: 17,
    held: 24,
    totalPlanned: 32,
    assessments: [
      { id: 'quizzes', title: 'Quizzes', obtained: 18, total: 20, weight: 10 },
      { id: 'assignments', title: 'Assignments', obtained: 24, total: 30, weight: 20 },
      { id: 'midterm', title: 'Midterm', obtained: 38, total: 50, weight: 20 },
      { id: 'final', title: 'Final Exam', obtained: null, total: 100, weight: 50 },
    ],
  },
  {
    id: 'ai',
    code: 'AI',
    name: 'Artificial Intelligence',
    instructor: 'Dr. Bilal Khan',
    creditHours: 3,
    attended: 23,
    held: 25,
    totalPlanned: 32,
    assessments: [
      { id: 'quizzes', title: 'Quizzes', obtained: 20, total: 20, weight: 15 },
      { id: 'project', title: 'Semester Project', obtained: null, total: 100, weight: 25 },
      { id: 'midterm', title: 'Midterm', obtained: 44, total: 50, weight: 25 },
      { id: 'final', title: 'Final Exam', obtained: null, total: 100, weight: 35 },
    ],
  },
  {
    id: 'tw',
    code: 'TW',
    name: 'Technical & Business Writing',
    instructor: 'Mr. Faraz Idrees',
    creditHours: 2,
    attended: 0,
    held: 0,
    totalPlanned: 24,
    assessments: [],
  },
];

// Initial task records
export const initialTasks = [
  {
    id: 't1',
    title: 'Assignment 1 — FLEX Companion app',
    courseId: 'smd',
    dueDate: getDate(2),
    priority: 'high',
    completed: false,
  },
  {
    id: 't2',
    title: 'Read Ch. 4 — Transport Layer',
    courseId: 'cn',
    dueDate: getDate(-3),
    priority: 'medium',
    completed: false,
  },
  {
    id: 't3',
    title: 'Quiz 3 prep — graph traversal',
    courseId: 'dsa',
    dueDate: getDate(1),
    priority: 'high',
    completed: false,
  },
  {
    id: 't4',
    title: 'Lab report — subnetting exercise',
    courseId: 'cn',
    dueDate: getDate(6),
    priority: 'medium',
    completed: false,
  },
  {
    id: 't5',
    title: 'AI semester project proposal',
    courseId: 'ai',
    dueDate: getDate(9),
    priority: 'high',
    completed: false,
  },
  {
    id: 't6',
    title: 'Draft the formal report outline',
    courseId: 'tw',
    dueDate: getDate(4),
    priority: 'low',
    completed: false,
  },
  {
    id: 't7',
    title: 'Quiz 2 — recursion & recurrences',
    courseId: 'dsa',
    dueDate: getDate(-5),
    priority: 'medium',
    completed: true,
  },
  {
    id: 't8',
    title: 'Midterm revision — SMD',
    courseId: 'smd',
    dueDate: getDate(-8),
    priority: 'low',
    completed: true,
  },
];
