import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// What-If calculator: simulates attendance if missing or attending classes
export default function WhatIfCalculator({ course, threshold }) {
  const [mode, setMode] = useState('miss');
  const [countText, setCountText] = useState('1');

  // Calculate remaining planned classes using if-else
  let remaining = course.totalPlanned - course.held;
  if (remaining < 0) {
    remaining = 0;
  }

  if (remaining === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>What-If Calculator</Text>
        <Text style={styles.note}>All classes have been held for this course.</Text>
      </View>
    );
  }

  // Parse and validate input number using if-else
  let num = parseInt(countText, 10);
  if (isNaN(num) || num < 0) {
    num = 0;
  }

  let validNum = num;
  if (validNum > remaining) {
    validNum = remaining;
  }

  // Calculate simulated attendance using if-else
  let newAttended = course.attended;
  if (mode === 'attend') {
    newAttended = course.attended + validNum;
  }

  const newHeld = course.held + validNum;

  let previewPct = 0;
  if (newHeld > 0) {
    previewPct = Math.round((newAttended / newHeld) * 100);
  }

  const isBelow = previewPct < threshold;

  let statusColor = colors.safe;
  let statusDetail = '✓ Safe';
  if (isBelow) {
    statusColor = colors.danger;
    statusDetail = '⚠️ Below threshold';
  }

  // Build result box using if-else instead of ternary
  let resultDisplay = null;
  if (validNum > 0) {
    resultDisplay = (
      <View style={[styles.resultBox, { borderColor: statusColor }]}>
        <Text style={styles.resultText}>
          Attendance will become:{' '}
          <Text style={{ color: statusColor, fontWeight: '700' }}>{previewPct}%</Text>
        </Text>
        <Text style={styles.resultDetail}>{statusDetail}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What-If Calculator</Text>
      <Text style={styles.subtitle}>Check how missing or attending classes affects your %</Text>

      {/* Mode selection: Miss or Attend */}
      <View style={styles.row}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'miss' && styles.modeBtnActive]}
            onPress={() => setMode('miss')}
          >
            <Text style={[styles.modeText, mode === 'miss' && styles.modeTextActive]}>Miss</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'attend' && styles.modeBtnActive]}
            onPress={() => setMode('attend')}
          >
            <Text style={[styles.modeText, mode === 'attend' && styles.modeTextActive]}>Attend</Text>
          </TouchableOpacity>
        </View>

        {/* Number input */}
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={countText}
          onChangeText={setCountText}
          maxLength={2}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={styles.inputSuffix}>class(es)</Text>
      </View>

      {/* Result Display */}
      {resultDisplay}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...type.heading,
    fontSize: 14,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: radius.sm,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm - 2,
  },
  modeBtnActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    ...type.small,
    color: colors.textMuted,
  },
  modeTextActive: {
    color: colors.onAccent,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    width: 44,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  inputSuffix: {
    ...type.small,
    color: colors.textMuted,
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: 4,
  },
  resultText: {
    ...type.small,
    color: colors.text,
  },
  resultDetail: {
    ...type.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  note: {
    ...type.small,
    color: colors.textMuted,
  },
});
