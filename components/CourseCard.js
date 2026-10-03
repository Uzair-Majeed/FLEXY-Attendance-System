import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import StatusPill from './StatusPill';
import ProgressBar from './ProgressBar';
import AppButton from './AppButton';
import WhatIfCalculator from './WhatIfCalculator';
import { colors, radius, spacing, tones, type } from '../theme';

// Expandable course card: shows attendance %, present/absent buttons, and what-if check
export default function CourseCard({
  course,
  threshold,
  expanded,
  onToggle,
  onMarkPresent,
  onMarkAbsent,
  onOpenMarks,
}) {
  

    // 1. Get course values
  const { attended, held, totalPlanned } = course;

  // 2. Calculate attendance
  let pct = null;

  if (held > 0) {
    pct = Math.round((attended / held) * 100);
  }

  // Calculate remaining classes using if-else
  let remaining = totalPlanned - held;
  if (remaining < 0) {
    remaining = 0;
  }

  // 3. Variables used by the UI
  let statusTone;
  let statusLabel;
  let statusIcon;
  let adviceTitle;
  let adviceDetail;

  // 4. Choose the status and advice
  if (pct === null) {
    statusTone = 'muted';
    statusLabel = 'No classes yet';
    statusIcon = '–';

    adviceTitle = 'No classes held yet';
    adviceDetail = `Attendance tracking begins after class 1 of ${totalPlanned}.`;
  } else if (pct < threshold) {
    statusTone = 'danger';
    statusLabel = 'Below threshold';
    statusIcon = '▼';

    // How many consecutive classes must the student attend?
    let needed = Math.ceil((threshold * held - 100 * attended) / (100 - threshold));
    if (needed < 0) {
      needed = 0;
    }

    adviceTitle = `Attend next ${needed} classes`;
    adviceDetail = `Attending ${needed} classes in a row brings attendance back to ${threshold}%.`;
  } else {
    // Attendance meets the threshold.
    if (pct < threshold + 5) {
      statusTone = 'warn';
      statusLabel = 'At threshold';
      statusIcon = '●';
    } else {
      statusTone = 'safe';
      statusLabel = 'Above threshold';
      statusIcon = '▲';
    }

    // Maximum total classes allowed with the current attended count
    const maxHeld = (100 * attended) / threshold;

    // Subtract classes already held to find how many can be missed
    let canMiss = Math.floor(maxHeld - held);
    if (canMiss < 0) {
      canMiss = 0;
    }

    adviceTitle = `Can miss ${canMiss} more classes`;
    adviceDetail = `You can miss up to ${canMiss} classes and stay at or above ${threshold}%.`;
  }

  // 5. Get the colors for the selected status
  const tone = tones[statusTone];

  // 6. Pre-calculate UI display values using if-else
  let displayPct = '—';
  let progressValue = 0;
  let progressMarker = null;
  if (pct !== null) {
    displayPct = `${pct}%`;
    progressValue = pct;
    progressMarker = threshold;
  }

  let ratioText = 'no classes';
  if (course.held > 0) {
    ratioText = `${course.attended} / ${course.held}`;
  }

  let chevronIcon = '▾';
  if (expanded) {
    chevronIcon = '▴';
  }

  let remainingNoteText = `All ${course.totalPlanned} classes held`;
  if (remaining > 0) {
    remainingNoteText = `${course.held} of ${course.totalPlanned} classes held · ${remaining} remaining`;
  }

  // Expandable details section built with if-else
  let expandedBody = null;
  if (expanded) {
    expandedBody = (
      <View style={styles.body}>
        <View style={[styles.advice, { backgroundColor: tone.soft, borderColor: tone.solid }]}>
          <Text style={[styles.adviceTitle, { color: tone.solid }]}>{adviceTitle}</Text>
          <Text style={styles.adviceDetail}>{adviceDetail}</Text>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Record today's class</Text>
          <View style={styles.actions}>
            <AppButton
              title="Present"
              icon="✓"
              onPress={onMarkPresent}
              variant="soft"
              tone="safe"
              size="sm"
              style={styles.actionButton}
            />
            <AppButton
              title="Absent"
              icon="✕"
              onPress={onMarkAbsent}
              variant="soft"
              tone="danger"
              size="sm"
              style={styles.actionButton}
            />
          </View>
          <Text style={styles.remainingNote}>{remainingNoteText}</Text>
        </View>

        <WhatIfCalculator course={course} threshold={threshold} />

        <AppButton
          title="View marks breakdown"
          icon="›"
          onPress={onOpenMarks}
          variant="outline"
          size="sm"
        />
      </View>
    );
  }

  return (
    <Card accent={tone.solid} padded={false}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.8}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.identity}>
            <View style={styles.codeRow}>
              <View style={[styles.codeChip, { borderColor: tone.solid }]}>
                <Text style={[styles.code, { color: tone.solid }]}>{course.code}</Text>
              </View>
              <Text style={styles.credits}>{course.creditHours} cr</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {course.name}
            </Text>
            <Text style={styles.instructor} numberOfLines={1}>
              {course.instructor}
            </Text>
          </View>

          <View style={styles.figures}>
            <Text style={[styles.pct, { color: tone.solid }]}>
              {displayPct}
            </Text>
            <Text style={styles.ratio}>
              {ratioText}
            </Text>
          </View>
        </View>

        <ProgressBar
          value={progressValue}
          color={tone.solid}
          marker={progressMarker}
        />

        <View style={styles.headerBottom}>
          <StatusPill tone={statusTone} icon={statusIcon} label={statusLabel} size="sm" />
          <Text style={styles.chevron}>{chevronIcon}</Text>
        </View>
      </TouchableOpacity>

      {expandedBody}
    </Card>
  );
}





const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    paddingLeft: spacing.lg + 3,
    gap: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  identity: {
    flex: 1,
    gap: 3,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  code: {
    ...type.caption,
    fontSize: 10,
  },
  credits: {
    ...type.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  name: {
    ...type.heading,
    color: colors.text,
  },
  instructor: {
    ...type.small,
    fontSize: 12,
    color: colors.textMuted,
  },
  figures: {
    alignItems: 'flex-end',
  },
  pct: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  ratio: {
    ...type.small,
    fontSize: 12,
    color: colors.textMuted,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevron: {
    fontSize: 14,
    color: colors.textMuted,
  },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  advice: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: 3,
  },
  adviceTitle: {
    ...type.heading,
    fontSize: 14,
  },
  adviceDetail: {
    ...type.small,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionLabel: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  remainingNote: {
    ...type.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
