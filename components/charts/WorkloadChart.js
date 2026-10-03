import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, radius, spacing, type } from '../../theme';

const CHART_HEIGHT = 180;

// Pie chart showing pending tasks split by urgency: overdue, due soon, and upcoming
export default function WorkloadChart({ tasks, width }) {
  const now = new Date();
  const pending = tasks.filter((t) => !t.completed);

  // If no tasks are pending, show an empty state note
  if (pending.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyNote}>All caught up! No pending tasks right now.</Text>
      </View>
    );
  }

  // Count tasks by urgency category
  const overdue = pending.filter((t) => new Date(t.dueDate) < now).length;
  const dueSoon = pending.filter((t) => {
    const diffDays = (new Date(t.dueDate) - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  }).length;
  let upcoming = pending.length - overdue - dueSoon;
  if (upcoming < 0) {
    upcoming = 0;
  }

  // Data slices for the PieChart (only include categories that have at least 1 task)
  const chartData = [
    {
      name: 'Overdue',
      count: overdue,
      color: colors.danger,
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Due Soon',
      count: dueSoon,
      color: colors.warn,
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Upcoming',
      count: upcoming,
      color: colors.primary,
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    },
  ].filter((item) => item.count > 0);

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={width}
        height={CHART_HEIGHT}
        chartConfig={chartConfig}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute={false}
      />

      {/* Summary count pills below chart */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.summaryText}>{overdue} Overdue</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: colors.warn }]} />
          <Text style={styles.summaryText}>{dueSoon} Due Soon (3d)</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.summaryText}>{upcoming} Upcoming</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    ...type.caption,
    color: colors.textSecondary,
  },
  emptyNote: {
    ...type.body,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.md,
  },
});
