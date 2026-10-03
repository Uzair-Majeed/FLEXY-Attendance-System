import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { colors, spacing, type } from '../theme';
import { PRIORITIES } from '../config';
import { QUICK_DATE_OPTIONS, TASK_SORT_OPTIONS, TASK_STATUS_FILTERS } from '../constants/lists';

// Helper to get formatted date offset (YYYY-MM-DD)
const getOffsetDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const EMPTY_DRAFT = { title: '', courseId: null, dueDate: '', priority: 'medium' };

// Tasks screen: manage assignments, quizzes, and deadlines
export default function TasksScreen({
  courses,
  tasks,
  onBack,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [sort, setSort] = useState('due');

  // Simple task counts
  const now = new Date();
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = pendingTasks.filter((t) => new Date(t.dueDate) < now).length;
  const dueSoonCount = pendingTasks.filter((t) => {
    const diff = (new Date(t.dueDate) - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  const errors = validateDraft(draft, courses);
  const showErrors = submitted;

  const courseOptions = courses.map((course) => ({ id: course.id, label: course.code }));
  const courseFilters = [
    { id: 'all', label: 'All courses', count: tasks.length },
    ...courses.map((course) => ({
      id: course.id,
      label: course.code,
      count: tasks.filter((task) => task.courseId === course.id).length,
    })),
  ];

  // Filter and sort tasks list
  const visibleTasks = useMemo(() => {
    const matched = tasks.filter((task) => {
      if (courseFilter !== 'all' && task.courseId !== courseFilter) return false;
      if (statusFilter === 'pending') return !task.completed;
      if (statusFilter === 'done') return task.completed;
      return true;
    });

    const rank = { high: 0, medium: 1, low: 2 };
    return [...matched].sort((a, b) => {
      if (sort === 'priority') {
        const diff = (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1);
        if (diff !== 0) return diff;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, courseFilter, statusFilter, sort]);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(validateDraft(draft, courses)).length > 0) return;

    onAddTask({
      title: draft.title.trim(),
      courseId: draft.courseId,
      dueDate: draft.dueDate.trim(),
      priority: draft.priority,
    });

    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    setFormOpen(false);
    setStatusFilter('pending');
  };

  const cancel = () => {
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    setFormOpen(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title="Tasks & Deadlines"
        subtitle={`${pendingTasks.length} pending · ${completedCount} completed`}
        onBack={onBack}
      />

      <View style={styles.tiles}>
        <StatCard
          label="Overdue"
          value={overdueCount}
          caption={overdueCount > 0 ? 'needs attention now!' : 'nothing late'}
          tone={overdueCount > 0 ? 'danger' : 'safe'}
        />
        <StatCard
          label="Due Soon"
          value={dueSoonCount}
          caption="within next 3 days"
          tone={dueSoonCount > 0 ? 'warn' : 'safe'}
        />
      </View>

      {/* New Task Form */}
      {formOpen ? (
        <Card style={styles.form}>
          <Text style={styles.formTitle}>New Task</Text>

          <TextField
            label="Title"
            value={draft.title}
            onChangeText={(value) => update('title', value)}
            placeholder="e.g. Assignment 1 Submission"
            maxLength={80}
            error={showErrors ? errors.title : null}
          />

          <View>
            <FilterTabs
              label="Course"
              options={courseOptions}
              value={draft.courseId}
              onChange={(value) => update('courseId', value)}
            />
            {showErrors && errors.courseId ? (
              <Text style={styles.fieldError}>{errors.courseId}</Text>
            ) : null}
          </View>

          <TextField
            label="Due Date"
            value={draft.dueDate}
            onChangeText={(value) => update('dueDate', value)}
            placeholder="YYYY-MM-DD"
            maxLength={10}
            autoCapitalize="none"
            error={showErrors ? errors.dueDate : null}
            hint="Format: YYYY-MM-DD (e.g. 2026-10-05)"
          />

          <FilterTabs
            label="Quick Pick Date"
            options={QUICK_DATE_OPTIONS}
            value={matchQuickDate(draft.dueDate)}
            onChange={(id) => {
              const choice = QUICK_DATE_OPTIONS.find((option) => option.id === id);
              update('dueDate', choice ? getOffsetDate(choice.days) : draft.dueDate);
            }}
          />

          <FilterTabs
            label="Priority"
            options={PRIORITIES}
            value={draft.priority}
            onChange={(value) => update('priority', value)}
          />

          <View style={styles.formActions}>
            <AppButton title="Cancel" onPress={cancel} variant="ghost" style={styles.formButton} />
            <AppButton title="Add Task" icon="+" onPress={submit} style={styles.formButton} />
          </View>
        </Card>
      ) : (
        <AppButton title="Add a Task" icon="+" onPress={() => setFormOpen(true)} />
      )}

      {/* Filters */}
      <View style={styles.controls}>
        <FilterTabs
          label="Course"
          options={courseFilters}
          value={courseFilter}
          onChange={setCourseFilter}
        />
        <FilterTabs
          label="Status"
          options={TASK_STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterTabs label="Sort By" options={TASK_SORT_OPTIONS} value={sort} onChange={setSort} />
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <EmptyState
          icon="☰"
          title="No tasks yet"
          message="Add your assignments, quizzes or exams above."
          actionLabel="Add a Task"
          onAction={() => setFormOpen(true)}
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          icon="⌕"
          title="No matching tasks"
          message="No tasks match this filter."
          actionLabel="Reset filters"
          onAction={() => {
            setCourseFilter('all');
            setStatusFilter('all');
          }}
        />
      ) : (
        <View style={styles.list}>
          <Text style={styles.count}>
            Showing {visibleTasks.length} of {tasks.length} tasks
          </Text>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              course={courses.find((c) => c.id === task.courseId)}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function validateDraft(draft, courses) {
  const errors = {};
  if (!draft.title.trim()) {
    errors.title = 'Title is required.';
  }
  if (!draft.courseId) {
    errors.courseId = 'Select which course this task belongs to.';
  } else if (!courses.some((c) => c.id === draft.courseId)) {
    errors.courseId = 'The selected course no longer exists.';
  }
  if (!draft.dueDate.trim()) {
    errors.dueDate = 'Due date is required.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate.trim())) {
    errors.dueDate = 'Use YYYY-MM-DD format (e.g. 2026-10-05).';
  }
  return errors;
}

function matchQuickDate(dueDate) {
  const match = QUICK_DATE_OPTIONS.find((option) => getOffsetDate(option.days) === dueDate);
  return match ? match.id : null;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  formTitle: {
    ...type.heading,
    color: colors.text,
  },
  fieldError: {
    ...type.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  formButton: {
    flex: 1,
  },
  controls: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  count: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
