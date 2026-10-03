import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function Card({ children, accent, padded = true, style }) {
  let accentBar = null;
  if (accent) {
    accentBar = <View style={[styles.accent, { backgroundColor: accent }]} />;
  }

  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {accentBar}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.lg,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});
