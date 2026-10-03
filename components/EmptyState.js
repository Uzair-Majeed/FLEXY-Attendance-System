import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import { colors, radius, spacing, type } from '../theme';

// Empty state placeholder displayed when lists have no content
export default function EmptyState({ icon = '○', title, message, actionLabel, onAction }) {
  let messageView = null;
  if (message) {
    messageView = <Text style={styles.message}>{message}</Text>;
  }

  let actionButtonView = null;
  if (actionLabel && onAction) {
    actionButtonView = (
      <AppButton
        title={actionLabel}
        onPress={onAction}
        variant="soft"
        size="sm"
        style={styles.action}
      />
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {messageView}
      {actionButtonView}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 20,
    color: colors.textMuted,
  },
  title: {
    ...type.heading,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...type.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 19,
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.lg,
  },
});
