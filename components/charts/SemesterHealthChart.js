import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { getCourseMarks } from '../../constants/lists';
import { colors, radius, spacing, tones, type } from '../../theme';

const CHART_HEIGHT = 170;

// Progress rings chart showing semester health across attendance, marks, and tasks
export default function SemesterHealthChart({ courses, tasks, threshold, width }) {
  // 1. Attendance health calculation
  const trackedCourses = courses.filter((c) => c.held > 0);
  const totalAttended = trackedCourses.reduce((sum, c) => sum + c.attended, 0);
  const totalHeld = trackedCourses.reduce((sum, c) => sum + c.held, 0);

  let attendancePct = 100;
  if (totalHeld > 0) {
    attendancePct = Math.round((totalAttended / totalHeld) * 100);
  }

  let attendanceRatio = attendancePct / 100;
  if (attendanceRatio < 0.01) {
    attendanceRatio = 0.01;
  } else if (attendanceRatio > 1) {
    attendanceRatio = 1;
  }

  // 2. Marks health calculation across graded courses
  const gradedCourses = courses.filter((c) => {
    const marks = getCourseMarks(c);
    return marks.gradedWeight > 0;
  });
  const atRiskMarksCount = gradedCourses.filter((c) => {
    const marks = getCourseMarks(c);
    return marks.pct !== null && marks.pct < 50;
  }).length;
  const marksSum = gradedCourses.reduce((sum, c) => sum + (getCourseMarks(c).pct || 0), 0);

  let avgMarksPct = 100;
  if (gradedCourses.length > 0) {
    avgMarksPct = Math.round(marksSum / gradedCourses.length);
  }

  let marksRatio = avgMarksPct / 100;
  if (marksRatio < 0.01) {
    marksRatio = 0.01;
  } else if (marksRatio > 1) {
    marksRatio = 1;
  }

  // 3. Task completion health calculation
  const completedTasks = tasks.filter((t) => t.completed).length;

  let taskPct = 100;
  if (tasks.length > 0) {
    taskPct = Math.round((completedTasks / tasks.length) * 100);
  }

  let taskRatio = taskPct / 100;
  if (taskRatio < 0.01) {
    taskRatio = 0.01;
  } else if (taskRatio > 1) {
    taskRatio = 1;
  }

  // Determine overall semester standing
  const isAttendanceSafe = attendancePct >= threshold;
  const isMarksSafe = atRiskMarksCount === 0;
  const isSemesterSafe = isAttendanceSafe && isMarksSafe;

  // Status colors and labels computed using if-else
  let attendanceColor = colors.safe;
  let attendanceSub = 'Safe';
  if (!isAttendanceSafe) {
    attendanceColor = colors.danger;
    attendanceSub = 'Low';
  }

  let marksColor = colors.primary;
  let marksSub = 'Passing';
  if (!isMarksSafe) {
    marksColor = colors.warn;
    marksSub = `${atRiskMarksCount} Risk`;
  }

  let verdictIcon = '🛡️';
  let verdictBg = tones.safe.soft;
  let verdictBorder = tones.safe.solid;
  let verdictText = 'Semester Safe: Attendance and course marks are in good standing.';

  if (!isSemesterSafe) {
    verdictIcon = '⚠️';
    verdictBg = tones.warn.soft;
    verdictBorder = tones.warn.solid;

    if (isAttendanceSafe) {
      verdictText = 'Warning: Some course marks need attention to stay semester safe.';
    } else {
      verdictText = 'Warning: Overall attendance is below your target threshold.';
    }
  }

  const chartData = {
    labels: ['Attendance', 'Marks', 'Tasks'],
    data: [attendanceRatio, marksRatio, taskRatio],
    colors: [attendanceColor, marksColor, colors.accent],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1, index) => {
      if (index === 0) {
        return attendanceColor;
      } else if (index === 1) {
        return marksColor;
      } else {
        return colors.accent;
      }
    },
    strokeWidth: 10,
  };

  return (
    <View style={styles.container}>
      {/* Concentric Progress Rings */}
      <ProgressChart
        data={chartData}
        width={width}
        height={CHART_HEIGHT}
        strokeWidth={10}
        radius={22}
        chartConfig={chartConfig}
        hideLegend={true}
        withCustomBarColorFromData={true}
        style={styles.chart}
      />

      {/* 3 Metric Summary Pillars */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={[styles.dot, { backgroundColor: attendanceColor }]} />
          <Text style={styles.metricLabel}>Attendance</Text>
          <Text style={styles.metricValue}>{attendancePct}%</Text>
          <Text style={styles.metricSub}>{attendanceSub}</Text>
        </View>

        <View style={styles.metricItem}>
          <View style={[styles.dot, { backgroundColor: marksColor }]} />
          <Text style={styles.metricLabel}>Avg Marks</Text>
          <Text style={styles.metricValue}>{avgMarksPct}%</Text>
          <Text style={styles.metricSub}>{marksSub}</Text>
        </View>

        <View style={styles.metricItem}>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={styles.metricValue}>{taskPct}%</Text>
          <Text style={styles.metricSub}>{completedTasks}/{tasks.length} tasks</Text>
        </View>
      </View>

      {/* Semester Safe status banner */}
      <View
        style={[
          styles.verdictBanner,
          {
            backgroundColor: verdictBg,
            borderColor: verdictBorder,
          },
        ]}
      >
        <Text style={styles.verdictIcon}>{verdictIcon}</Text>
        <Text style={styles.verdictText}>{verdictText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.md,
  },
  chart: {
    borderRadius: radius.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacing.xs,
  },
  metricItem: {
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  metricLabel: {
    ...type.caption,
    color: colors.textMuted,
  },
  metricValue: {
    ...type.heading,
    color: colors.text,
  },
  metricSub: {
    ...type.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    width: '100%',
  },
  verdictIcon: {
    fontSize: 14,
  },
  verdictText: {
    ...type.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
