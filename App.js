import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DashboardScreen from './screens/DashboardScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import TasksScreen from './screens/TasksScreen';
import MarksScreen from './screens/MarksScreen';

import { initialCourses, initialTasks, student } from './data/initialData';
import { DEFAULT_ATTENDANCE_THRESHOLD } from './config';
import { colors } from './theme';

// Maximum attendance actions that can be undone
const UNDO_LIMIT = 10;

// Main App component: manages screen navigation and root state
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourses[0]?.id ?? null);

  const [courses, setCourses] = useState(initialCourses);
  const [tasks, setTasks] = useState(initialTasks);
  const [threshold, setThreshold] = useState(DEFAULT_ATTENDANCE_THRESHOLD);

  // History of attendance changes for undo functionality
  const [history, setHistory] = useState([]);

  // Marks a course attendance present or absent
  const markAttendance = (courseId, present) => {
    const before = courses.find((c) => c.id === courseId);
    if (!before) return;

    const attended = before.attended + (present ? 1 : 0);
    const held = before.held + 1;

    setCourses((current) =>
      current.map((course) =>
        course.id === courseId
          ? {
              ...course,
              attended,
              held,
              totalPlanned: Math.max(course.totalPlanned, held),
            }
          : course
      )
    );

    setHistory((current) => [
      ...current.slice(-(UNDO_LIMIT - 1)),
      {
        courseId,
        attended: before.attended,
        held: before.held,
        totalPlanned: before.totalPlanned,
        label: `${before.code} marked ${present ? 'present' : 'absent'} — now ${attended} of ${held}`,
      },
    ]);
  };

  // Reverts the last attendance change
  const undoAttendance = () => {
    const last = history[history.length - 1];
    if (!last) return;

    setCourses((current) =>
      current.map((course) =>
        course.id === last.courseId
          ? {
              ...course,
              attended: last.attended,
              held: last.held,
              totalPlanned: last.totalPlanned,
            }
          : course
      )
    );
    setHistory((current) => current.slice(0, -1));
  };

  // Adds a new task to the task list
  const addTask = (draft) => {
    setTasks((current) => [
      ...current,
      {
        id: `task-${Date.now()}`,
        title: draft.title,
        courseId: draft.courseId,
        dueDate: draft.dueDate,
        priority: draft.priority,
        completed: false,
      },
    ]);
  };

  // Toggles completion status of a task
  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Removes a task by id
  const deleteTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  // Navigation handlers
  const goHome = () => setCurrentView('dashboard');

  const openMarks = (courseId) => {
    if (courseId) setSelectedCourseId(courseId);
    setCurrentView('marks');
  };

  // Renders screen based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'attendance':
        return (
          <AttendanceScreen
            courses={courses}
            threshold={threshold}
            onBack={goHome}
            onMarkPresent={(courseId) => markAttendance(courseId, true)}
            onMarkAbsent={(courseId) => markAttendance(courseId, false)}
            onOpenMarks={openMarks}
            lastAction={history[history.length - 1] || null}
            onUndo={undoAttendance}
          />
        );

      case 'tasks':
        return (
          <TasksScreen
            courses={courses}
            tasks={tasks}
            onBack={goHome}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        );

      case 'marks':
        return (
          <MarksScreen
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onBack={goHome}
          />
        );

      case 'dashboard':
      default:
        return (
          <DashboardScreen
            student={student}
            courses={courses}
            tasks={tasks}
            threshold={threshold}
            onThresholdChange={setThreshold}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onNavigate={setCurrentView}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        {renderView()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
