import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, tones, type } from '../theme';

// Badge component: displays a small colored status label with optional icon
export default function StatusPill({ tone = 'muted', icon, label, size = 'md' }) {
  let palette = tones.muted;
  if (tones[tone]) {
    palette = tones[tone];
  }

  const small = size === 'sm';

  let iconView = null;
  if (icon) {
    iconView = (
      <Text style={[styles.icon, { color: palette.solid }, small && styles.textSmall]}>
        {icon}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: palette.soft, borderColor: palette.solid },
        small && styles.pillSmall,
      ]}
    >
      {iconView}
      <Text style={[styles.label, { color: palette.solid }, small && styles.textSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 5,
  },
  pillSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  icon: {
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    ...type.caption,
    fontSize: 11,
  },
  textSmall: {
    fontSize: 10,
  },
});
