import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, tones, type } from '../theme';

// Stat card component: displays a single numeric metric and label
export default function StatCard({ label, value, unit, caption, tone = 'muted', style }) {
  let palette = tones.muted;
  if (tones[tone]) {
    palette = tones[tone];
  }

  let unitView = null;
  if (unit) {
    unitView = <Text style={[styles.unit, { color: palette.solid }]}>{unit}</Text>;
  }

  let captionView = null;
  if (caption) {
    captionView = (
      <Text style={styles.caption} numberOfLines={2}>
        {caption}
      </Text>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: palette.solid }]}>{value}</Text>
        {unitView}
      </View>
      {captionView}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 140,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
  label: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 15,
  },
});
