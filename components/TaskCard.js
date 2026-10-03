import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Card from './Card';
import StatusPill from './StatusPill';
import { colors, radius, spacing, tones, type } from '../theme';
import { PRIORITY_TONE } from '../constants/lists';

// Task card component: displays task info, checkbox, and delete button
export default function TaskCard({ task, course, onToggle, onDelete }) {
  // Simple urgency calculation
  const now = new Date();
  const due = new Date(task.dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  let urgencyTone = 'safe';
  let urgencyLabel = 'Upcoming';
  let urgencyIcon = '○';

  if (task.completed) {

    urgencyTone = 'muted';
    urgencyLabel = 'Completed';
    urgencyIcon = '✓';

  } 
  
  else if (diffDays < 0) {

    urgencyTone = 'danger';
    urgencyLabel = 'Overdue';
    urgencyIcon = '!';

  } 
  
  else if (diffDays <= 3) {
    urgencyTone = 'warn';
    urgencyLabel = 'Due soon';
    urgencyIcon = '●';
  }

  const tone = tones[urgencyTone];
  const priorityTone = tones[PRIORITY_TONE[task.priority]] || tones.muted;

  let relativeText = `in ${diffDays} days`;
  if (diffDays === 0) {
    relativeText = 'Today';
  } else if (diffDays === 1) {
    relativeText = 'Tomorrow';
  } else if (diffDays < 0) {
    relativeText = `${Math.abs(diffDays)} days overdue`;
  }

  let priorityLabel = 'Medium';
  if (task.priority) {
    priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  }

  let courseCode = '—';
  if (course) {
    courseCode = course.code;
  }

  let dueSubtitle = task.dueDate;
  if (!task.completed) {
    dueSubtitle = `${task.dueDate} · ${relativeText}`;
  }

  let checkmarkView = null;
  if (task.completed) {
    checkmarkView = <Text style={styles.checkmark}>✓</Text>;
  }

  const confirmDelete = () => {
    Alert.alert('Delete task?', `"${task.title}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Card accent={tone.solid} padded={false}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        >
          {checkmarkView}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[styles.title, task.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.courseChip}>
              <Text style={styles.courseCode}>{courseCode}</Text>
            </View>
            <View style={styles.priority}>
              <View style={[styles.dot, { backgroundColor: priorityTone.solid }]} />
              <Text style={styles.priorityText}>{priorityLabel}</Text>
            </View>
          </View>

          <View style={styles.dueRow}>
            <StatusPill
              tone={urgencyTone}
              icon={urgencyIcon}
              label={urgencyLabel}
              size="sm"
            />
            <Text style={styles.due} numberOfLines={1}>
              {dueSubtitle}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={confirmDelete}
          activeOpacity={0.7}
          style={styles.delete}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    gap: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onAccent,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  courseChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseCode: {
    ...type.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  priority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    ...type.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  due: {
    ...type.caption,
    color: colors.textMuted,
    flex: 1,
  },
  delete: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  deleteIcon: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
