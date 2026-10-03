import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, radius, spacing, tones, type } from '../theme';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  tone = 'accent',
  size = 'md',
  disabled = false,
  icon,
  style,
}) {
  let palette = tones.accent;
  if (tones[tone]) {
    palette = tones[tone];
  }

  const small = size === 'sm';

  // Default: primary button
  let backgroundColor = palette.solid;
  let borderColor = palette.solid;
  let textColor = '#ffffff';
  if (tone === 'accent') {
    textColor = colors.onAccent;
  }

  if (variant === 'soft') {
    backgroundColor = palette.soft;
    textColor = palette.solid;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = colors.borderStrong;
    textColor = colors.textSecondary;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    borderColor = 'transparent';
    textColor = colors.accent;
  }

  // Pre-calculate sizing and styling with if-else
  let paddingV = spacing.md;
  let paddingH = spacing.lg;
  let buttonRadius = radius.md;
  let iconFontSize = 14;
  let labelFontSize = 14;

  if (small) {
    paddingV = spacing.sm;
    paddingH = spacing.md;
    buttonRadius = radius.sm;
    iconFontSize = 12;
    labelFontSize = 13;
  }

  let buttonOpacity = 1;
  if (disabled) {
    buttonOpacity = 0.4;
  }

  let iconView = null;
  if (icon) {
    iconView = (
      <Text
        style={{
          color: textColor,
          fontSize: iconFontSize,
          fontWeight: '700',
        }}
      >
        {icon}
      </Text>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          borderRadius: buttonRadius,
          opacity: buttonOpacity,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {iconView}

        <Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: textColor, fontSize: labelFontSize },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...type.body,
    fontWeight: '700',
  },
});