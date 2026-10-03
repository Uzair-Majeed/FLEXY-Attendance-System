import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';
import Stepper from '../components/Stepper';
import EmptyState from '../components/EmptyState';
import { colors, radius, spacing, tones, type } from '../theme';
import { DEFAULT_TARGET_OVERALL } from '../config';
import { getGrade } from '../constants/lists';

const TARGET_MIN = 40;
const TARGET_MAX = 95;
const TARGET_STEP = 5;

// Marks screen: course assessment breakdown and target grade calculator
export default function MarksScreen({ courses, selectedCourseId, onSelectCourse, onBack }) {
  const [target, setTarget] = useState(DEFAULT_TARGET_OVERALL);

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  if (!course) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader title="Marks" onBack={onBack} />
        <EmptyState
          icon="▦"
          title="No courses yet"
          message="Marks appear once your semester has at least one course."
        />
      </ScrollView>
    );
  }

  // Calculate weighted marks
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
  const remainingWeight = Math.max(0, totalWeight - gradedWeight);
  const percentOfGraded = gradedWeight > 0 ? Math.round((earned / gradedWeight) * 100) : null;
  const gradeInfo = getGrade(percentOfGraded);
  const isSafe = percentOfGraded === null ? true : percentOfGraded >= 50;
  const assessedPct = totalWeight > 0 ? Math.round((gradedWeight / totalWeight) * 100) : 0;
  const pendingCount = (course.assessments || []).filter(
    (a) => a.obtained === null || a.obtained === undefined
  ).length;

  // Target score needed on remaining assessments
  let targetStatus = 'possible';
  let targetRequired = 0;
  if (remainingWeight <= 0) {
    targetStatus = 'complete';
  } else {
    targetRequired = Math.round(((target - earned) / remainingWeight) * 100);
    if (targetRequired <= 0) targetStatus = 'secured';
    else if (targetRequired > 100) targetStatus = 'impossible';
    else targetStatus = 'possible';
  }

  // Target explanation message
  let targetLabel = `${targetRequired}% needed`;
  let targetTone = targetRequired >= 85 ? 'warn' : 'safe';
  let targetBody = `Average ${targetRequired}% across remaining ${pendingCount} assessment(s) to finish at ${target}%.`;

  if (targetStatus === 'complete') {
    targetLabel = 'All Marked';
    targetTone = 'muted';
    targetBody = `All work in ${course.code} has been graded.`;
  } else if (targetStatus === 'secured') {
    targetLabel = 'Goal Secured';
    targetTone = 'safe';
    targetBody = `You have already banked enough marks to reach ${target}%!`;
  } else if (targetStatus === 'impossible') {
    targetLabel = 'Unreachable';
    targetTone = 'danger';
    targetBody = `Even 100% on the remaining ${remainingWeight}% won't reach ${target}%.`;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader title="Marks & Grades" subtitle={course.name} onBack={onBack} />

      {/* Course selection tabs */}
      <FilterTabs
        label="Select Course"
        options={courses.map((c) => ({ id: c.id, label: c.code }))}
        value={course.id}
        onChange={onSelectCourse}
      />

      {course.assessments.length === 0 ? (
        <EmptyState
          icon="▦"
          title="No assessments listed"
          message={`${course.code} has no grading breakdown available.`}
        />
      ) : (
        <>
          {/* Summary Stat Cards */}
          <View style={styles.tiles}>
            <StatCard
              label="Marks Banked"
              value={earned}
              unit={`/${totalWeight}`}
              caption="total weighted score"
              tone="primary"
            />
            <StatCard
              label="Graded Score"
              value={percentOfGraded !== null ? percentOfGraded : '—'}
              unit={percentOfGraded !== null ? '%' : ''}
              caption={
                gradedWeight > 0
                  ? `in ${gradedWeight}% marked`
                  : 'nothing marked'
              }
              tone={gradedWeight > 0 ? 'safe' : 'muted'}
            />
            <StatCard
              label="Current Grade"
              value={percentOfGraded !== null ? gradeInfo.grade : '—'}
              caption={
                percentOfGraded !== null
                  ? `${gradeInfo.gpa} GPA · ${isSafe ? 'Safe' : 'At Risk'}`
                  : 'awaiting grades'
              }
              tone={isSafe ? 'safe' : 'danger'}
            />
          </View>

          {/* Progress Bar of graded weight */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Course Evaluated</Text>
            <ProgressBar value={assessedPct} color={colors.primary} />
            <Text style={styles.cardDetail}>
              {gradedWeight}% of {course.code} has been graded.{' '}
              {remainingWeight > 0
                ? `${remainingWeight}% remaining across ${pendingCount} assessment(s).`
                : 'All assessments graded.'}
            </Text>
          </Card>

          {/* Assessment Table */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Assessment Breakdown</Text>

            <View style={styles.tableHead}>
              <Text style={[styles.th, styles.colName]}>Assessment</Text>
              <Text style={[styles.th, styles.colScore]}>Score</Text>
              <Text style={[styles.th, styles.colWeighted]}>Weight</Text>
            </View>

            {course.assessments.map((assessment) => {
              const graded =
                assessment.obtained !== null && assessment.obtained !== undefined;
              const contribution = graded
                ? Math.round((assessment.obtained / assessment.total) * assessment.weight * 10) / 10
                : null;

              return (
                <View key={assessment.id} style={styles.tr}>
                  <View style={styles.colName}>
                    <Text style={styles.cellName}>{assessment.title}</Text>
                    <Text style={styles.cellWeight}>{assessment.weight}% weightage</Text>
                  </View>
                  <Text
                    style={[styles.cell, styles.colScore, !graded && styles.cellPending]}
                  >
                    {graded ? `${assessment.obtained} / ${assessment.total}` : 'Pending'}
                  </Text>
                  <Text
                    style={[styles.cell, styles.colWeighted, !graded && styles.cellPending]}
                  >
                    {graded ? `${contribution}%` : '—'}
                  </Text>
                </View>
              );
            })}
          </Card>

          {/* Target Grade Calculator */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Target Grade Calculator</Text>
            <Text style={styles.cardDetail}>
              What score do you need in the remaining assessments to reach your goal?
            </Text>

            <Stepper
              label="Target Overall Percentage"
              value={target}
              onChange={setTarget}
              min={TARGET_MIN}
              max={TARGET_MAX}
              step={TARGET_STEP}
              suffix="%"
            />

            <View
              style={[
                styles.result,
                { backgroundColor: tones[targetTone].soft, borderColor: tones[targetTone].solid },
              ]}
            >
              <StatusPill tone={targetTone} label={targetLabel} size="sm" />
              <Text style={styles.resultBody}>{targetBody}</Text>
            </View>
          </Card>
        </>
      )}
    </ScrollView>
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
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  cardTitle: {
    ...type.heading,
    color: colors.text,
  },
  cardDetail: {
    ...type.small,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  th: {
    ...type.caption,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colName: {
    flex: 1,
    gap: 1,
  },
  colScore: {
    width: 80,
    textAlign: 'right',
  },
  colWeighted: {
    width: 60,
    textAlign: 'right',
  },
  cellName: {
    ...type.body,
    color: colors.text,
  },
  cellWeight: {
    ...type.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  cell: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
  },
  cellPending: {
    fontWeight: '500',
    color: colors.textMuted,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  resultBody: {
    ...type.small,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
