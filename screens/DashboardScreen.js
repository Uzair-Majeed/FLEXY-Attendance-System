import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';
import Stepper from '../components/Stepper';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import AttendanceBarChart from '../components/charts/AttendanceBarChart';
import WorkloadChart from '../components/charts/WorkloadChart';
import SemesterHealthChart from '../components/charts/SemesterHealthChart';
import { colors, radius, spacing, tones, type } from '../theme';
import { THRESHOLD_MAX, THRESHOLD_MIN, THRESHOLD_STEP } from '../config';

// Main dashboard screen: shows summary stats, alerts, charts, and upcoming tasks
export default function DashboardScreen({
  student,
  courses,
  tasks,
  threshold,
  onThresholdChange,
  onToggleTask,
  onDeleteTask,
  onNavigate,
}) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(300, width - spacing.lg * 4);

  // Attendance calculations
  const trackedCourses = courses.filter((c) => c.held > 0);
  const belowThresholdCount = trackedCourses.filter(
    (c) => Math.round((c.attended / c.held) * 100) < threshold
  ).length;
  const totalAttended = trackedCourses.reduce((sum, c) => sum + c.attended, 0);
  const totalHeld = trackedCourses.reduce((sum, c) => sum + c.held, 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 0;

  // Task calculations
  const now = new Date();
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = pendingTasks.filter((t) => new Date(t.dueDate) < now).length;
  const dueSoonCount = pendingTasks.filter((t) => {
    const diff = (new Date(t.dueDate) - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  // Simple alerts array
  const alerts = [];
  if (belowThresholdCount > 0) {
    alerts.push({
      id: 'below',
      tone: 'danger',
      icon: '⚠️',
      message: `${belowThresholdCount} course(s) below your ${threshold}% attendance requirement!`,
    });
  }
  if (overdueCount > 0) {
    alerts.push({
      id: 'overdue',
      tone: 'danger',
      icon: '!',
      message: `${overdueCount} task(s) past due date.`,
    });
  } else if (dueSoonCount > 0) {
    alerts.push({
      id: 'soon',
      tone: 'warn',
      icon: '⏰',
      message: `${dueSoonCount} task(s) due within the next 3 days.`,
    });
  }

  // Top 3 upcoming tasks
  const upcomingTasks = pendingTasks
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Student Header */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{student.semester} · {student.section}</Text>
        <Text style={styles.title}>Academic Dashboard</Text>
        <Text style={styles.subtitle}>
          {student.name} ({student.rollNo})
        </Text>
      </View>

      {/* 2. Urgent Alerts */}
      {alerts.length > 0 ? (
        <View style={styles.alerts}>
          {alerts.slice(0, 2).map((alert) => (
            <View
              key={alert.id}
              style={[
                styles.alert,
                { backgroundColor: tones[alert.tone].soft, borderColor: tones[alert.tone].solid },
              ]}
            >
              <Text style={[styles.alertIcon, { color: tones[alert.tone].solid }]}>
                {alert.icon}
              </Text>
              <Text style={styles.alertText}>{alert.message}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 3. Summary Stat Cards */}
      <View style={styles.tiles}>
        <StatCard
          label="Below Threshold"
          value={belowThresholdCount}
          caption={`courses under ${threshold}%`}
          tone={belowThresholdCount > 0 ? 'danger' : 'safe'}
        />
        <StatCard
          label="Overall Attendance"
          value={overallPct}
          unit="%"
          caption={`${totalAttended} / ${totalHeld} attended`}
          tone={overallPct < threshold ? 'danger' : 'safe'}
        />
        <StatCard
          label="Pending Tasks"
          value={pendingTasks.length}
          caption={`${completedCount} finished`}
          tone={pendingTasks.length > 0 ? 'warn' : 'safe'}
        />
        <StatCard
          label="Due Soon"
          value={dueSoonCount + overdueCount}
          caption={overdueCount > 0 ? `${overdueCount} overdue!` : 'next 3 days'}
          tone={overdueCount > 0 ? 'danger' : dueSoonCount > 0 ? 'warn' : 'safe'}
        />
      </View>

      {/* 4. Quick Navigation Buttons */}
      <View style={styles.actions}>
        <ActionCard
          icon="◧"
          title="Attendance"
          detail="Mark present/absent & simulate attendance"
          badge={belowThresholdCount > 0 ? `${belowThresholdCount} at risk` : null}
          badgeTone="danger"
          onPress={() => onNavigate('attendance')}
        />
        <ActionCard
          icon="☰"
          title="Tasks"
          detail="Manage assignments, quizzes & deadlines"
          badge={overdueCount > 0 ? `${overdueCount} overdue` : null}
          badgeTone="danger"
          onPress={() => onNavigate('tasks')}
        />
        <ActionCard
          icon="▦"
          title="Marks"
          detail="View weighted scores & target grade calculator"
          onPress={() => onNavigate('marks')}
        />
      </View>

      {/* 5. Attendance by Course Bar Chart (Primary Chart) */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeading}>
          <Text style={styles.chartTitle}>Attendance by Course</Text>
          <Text style={styles.chartDetail}>
            Color-coded bars showing attendance percentage per subject
          </Text>
        </View>

        <AttendanceBarChart courses={courses} threshold={threshold} width={chartWidth} />

        {/* Threshold Adjustment Controls */}
        <View style={styles.thresholdRow}>
          <Stepper
            label="Attendance threshold"
            value={threshold}
            onChange={onThresholdChange}
            min={THRESHOLD_MIN}
            max={THRESHOLD_MAX}
            step={THRESHOLD_STEP}
            suffix="%"
          />
          <Text style={styles.thresholdHint}>
            Adjusting threshold updates warning colors across the app.
          </Text>
        </View>
      </Card>

      {/* 6. Pending Work by Urgency Pie Chart */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeading}>
          <Text style={styles.chartTitle}>Pending Work by Urgency</Text>
          <Text style={styles.chartDetail}>
            Workload distribution by due date and urgency
          </Text>
        </View>

        <WorkloadChart tasks={tasks} width={chartWidth} />
      </Card>

      {/* 7. Semester Health Rings Chart */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeading}>
          <Text style={styles.chartTitle}>Semester Health</Text>
          <Text style={styles.chartDetail}>
            Overall term standing across attendance, course marks, and tasks
          </Text>
        </View>

        <SemesterHealthChart
          courses={courses}
          tasks={tasks}
          threshold={threshold}
          width={chartWidth}
        />
      </Card>

      {/* 8. Upcoming Tasks Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => onNavigate('tasks')}>
            <Text style={styles.sectionLink}>View all ›</Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.length === 0 ? (
          <EmptyState
            icon="✓"
            title="All caught up!"
            message="No pending tasks right now."
            actionLabel="Add a task"
            onAction={() => onNavigate('tasks')}
          />
        ) : (
          <View style={styles.list}>
            {upcomingTasks.map((task) => (
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
      </View>
    </ScrollView>
  );
}

function ActionCard({ icon, title, detail, badge, badgeTone = 'warn', onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.action}>
        <View style={styles.actionIcon}>
          <Text style={styles.actionIconText}>{icon}</Text>
        </View>
        <View style={styles.actionBody}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDetail}>{detail}</Text>
        </View>
        {badge ? <StatusPill tone={badgeTone} label={badge} size="sm" /> : null}
        <Text style={styles.actionChevron}>›</Text>
      </Card>
    </TouchableOpacity>
  );
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
  hero: {
    gap: 3,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    ...type.caption,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    ...type.display,
    color: colors.text,
  },
  subtitle: {
    ...type.small,
    color: colors.textMuted,
  },
  alerts: {
    gap: spacing.sm,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  alertIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertText: {
    ...type.small,
    color: colors.textSecondary,
    flex: 1,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 16,
    color: colors.primary,
  },
  actionBody: {
    flex: 1,
    gap: 1,
  },
  actionTitle: {
    ...type.heading,
    color: colors.text,
  },
  actionDetail: {
    ...type.small,
    fontSize: 12,
    color: colors.textMuted,
  },
  actionChevron: {
    fontSize: 18,
    color: colors.textMuted,
  },
  chartCard: {
    gap: spacing.md,
  },
  chartHeading: {
    gap: 2,
  },
  chartTitle: {
    ...type.heading,
    color: colors.text,
  },
  chartDetail: {
    ...type.small,
    color: colors.textMuted,
  },
  thresholdRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  thresholdHint: {
    ...type.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...type.heading,
    color: colors.text,
  },
  sectionLink: {
    ...type.small,
    color: colors.primary,
    fontWeight: '700',
  },
  list: {
    gap: spacing.sm,
  },
});
