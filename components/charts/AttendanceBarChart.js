import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors, radius, spacing, type } from '../../theme';

const CHART_HEIGHT = 200;
const PADDING_LEFT = 36;
const PADDING_BOTTOM = 28;
const PADDING_TOP = 20;
const BAR_GAP = 0.35; // fraction of bar slot used as gap

// Custom bar chart built with react-native-svg (works on web + native)
export default function AttendanceBarChart({ courses, threshold, width }) {
  // Only chart courses where classes have actually been held
  const tracked = courses.filter((course) => course.held > 0);

  if (tracked.length === 0) {
    return (
      <Text style={styles.emptyNote}>
        No classes held yet. Attendance will be charted once classes begin.
      </Text>
    );
  }

  // Calculate percentage: (attended / held) * 100
  const labels = tracked.map((c) => c.code);
  const dataValues = tracked.map((c) => Math.round((c.attended / c.held) * 100));

  // Chart drawing area dimensions
  const chartWidth = width || 300;
  const drawWidth = chartWidth - PADDING_LEFT;
  const drawHeight = CHART_HEIGHT - PADDING_BOTTOM - PADDING_TOP;

  const barSlotWidth = drawWidth / dataValues.length;
  const barWidth = barSlotWidth * (1 - BAR_GAP);
  const barOffset = (barSlotWidth - barWidth) / 2;

  // Y-axis: 0 to 100
  const yMax = 100;

  function getBarColor(val) {
    if (val < threshold) {
      return colors.danger;
    }
    return colors.safe;
  }

  function getBarHeight(val) {
    return (val / yMax) * drawHeight;
  }

  // Y-axis grid lines at 0, 25, 50, 75, 100
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={CHART_HEIGHT}>
        {/* Grid lines */}
        {gridLines.map((gridVal) => {
          const y = PADDING_TOP + drawHeight - (gridVal / yMax) * drawHeight;
          return (
            <React.Fragment key={gridVal}>
              <Line
                x1={PADDING_LEFT}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
              />
              <SvgText
                x={PADDING_LEFT - 4}
                y={y + 4}
                fontSize={9}
                fill={colors.textMuted}
                textAnchor="end"
              >
                {gridVal}%
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Bars */}
        {dataValues.map((val, i) => {
          const barH = getBarHeight(val);
          const x = PADDING_LEFT + i * barSlotWidth + barOffset;
          const y = PADDING_TOP + drawHeight - barH;
          const barColor = getBarColor(val);

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={barColor}
                rx={3}
                ry={3}
              />
              {/* Value label on top of bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                fontSize={10}
                fill={barColor}
                textAnchor="middle"
                fontWeight="bold"
              >
                {val}%
              </SvgText>
              {/* Course code label below bar */}
              <SvgText
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 6}
                fontSize={9}
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {labels[i]}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Legend below the chart */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Below ({threshold}%)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.safe }]} />
          <Text style={styles.legendText}>Safe</Text>
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
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
