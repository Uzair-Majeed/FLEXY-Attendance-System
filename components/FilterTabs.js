import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// Horizontal filter buttons row for selecting categories or tabs
export default function FilterTabs({ options, value, onChange, label, style }) {
  let labelView = null;
  if (label) {
    labelView = <Text style={styles.groupLabel}>{label}</Text>;
  }

  return (
    <View style={style}>
      {labelView}
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = option.id === value;

          let badgeView = null;
          if (typeof option.count === 'number') {
            badgeView = (
              <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                  {option.count}
                </Text>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onChange(option.id)}
              activeOpacity={0.75}
              style={[styles.tab, isSelected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {option.label}
              </Text>
              {badgeView}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
  },
  tabSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  tabText: {
    ...type.small,
    color: colors.textSecondary,
  },
  tabTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  badge: {
    minWidth: 18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  badgeTextSelected: {
    color: colors.onAccent,
  },
});
