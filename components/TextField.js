import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// Form input component with label, error message, and placeholder
export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  autoCapitalize = 'sentences',
  returnKeyType,
  onSubmitEditing,
  suffix,
}) {
  const invalid = Boolean(error);

  let counterView = null;
  if (maxLength && value) {
    counterView = (
      <Text style={styles.counter}>
        {value.length}/{maxLength}
      </Text>
    );
  }

  let labelRowView = null;
  if (label) {
    labelRowView = (
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {counterView}
      </View>
    );
  }

  let suffixView = null;
  if (suffix) {
    suffixView = <Text style={styles.suffix}>{suffix}</Text>;
  }

  let messageView = null;
  if (invalid) {
    messageView = <Text style={styles.error}>{error}</Text>;
  } else if (hint) {
    messageView = <Text style={styles.hint}>{hint}</Text>;
  }

  return (
    <View style={styles.wrap}>
      {labelRowView}

      <View style={[styles.field, invalid && styles.fieldInvalid]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={colors.accent}
          style={[styles.input, multiline && styles.inputMultiline]}
          accessibilityLabel={label}
        />
        {suffixView}
      </View>

      {messageView}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  counter: {
    ...type.caption,
    color: colors.textMuted,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  fieldInvalid: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  input: {
    flex: 1,
    ...type.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  suffix: {
    ...type.small,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  error: {
    ...type.small,
    fontSize: 12,
    color: colors.danger,
  },
  hint: {
    ...type.small,
    fontSize: 12,
    color: colors.textMuted,
  },
});
