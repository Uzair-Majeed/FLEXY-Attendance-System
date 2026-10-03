import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// Header component with title, subtitle, and back button
export default function ScreenHeader({ title, subtitle, onBack, right }) {
  let backButtonView = null;
  if (onBack) {
    backButtonView = (
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.backButton}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
    );
  }

  let subtitleView = null;
  if (subtitle) {
    subtitleView = (
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    );
  }

  let rightView = null;
  if (right) {
    rightView = <View style={styles.right}>{right}</View>;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {backButtonView}
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitleView}
        </View>
      </View>
      {rightView}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.text,
    marginTop: -2,
  },
  titles: {
    flex: 1,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  subtitle: {
    ...type.small,
    color: colors.textMuted,
    marginTop: 1,
  },
  right: {
    flexShrink: 0,
  },
});
