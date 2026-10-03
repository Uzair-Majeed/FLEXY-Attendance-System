import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// Counter / Stepper: plus and minus buttons to adjust a numeric value
export default function Stepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  label,
}) {
  const decrement = () => {
    let nextValue = value - step;
    if (nextValue < min) {
      nextValue = min;
    }
    onChange(nextValue);
  };

  const increment = () => {
    let nextValue = value + step;
    if (nextValue > max) {
      nextValue = max;
    }
    onChange(nextValue);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  let labelView = null;
  if (label) {
    labelView = <Text style={styles.label}>{label}</Text>;
  }

  return (
    <View style={styles.wrap}>
      {labelView}
      <View style={styles.control}>
        <TouchableOpacity
          onPress={decrement}
          disabled={atMin}
          activeOpacity={0.7}
          style={[styles.button, atMin && styles.buttonDisabled]}
        >
          <Text style={[styles.buttonText, atMin && styles.buttonTextDisabled]}>−</Text>
        </TouchableOpacity>

        <Text style={styles.value}>
          {value}
          {suffix}
        </Text>

        <TouchableOpacity
          onPress={increment}
          disabled={atMax}
          activeOpacity={0.7}
          style={[styles.button, atMax && styles.buttonDisabled]}
        >
          <Text style={[styles.buttonText, atMax && styles.buttonTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    gap: 2,
  },
  button: {
    width: 32,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginTop: -2,
  },
  buttonTextDisabled: {
    color: colors.textMuted,
  },
  value: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
    minWidth: 44,
    textAlign: 'center',
  },
});
