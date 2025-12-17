import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useThemeTokens } from '../theme/useThemeTokens';

export function AppTextInput({ style, ...props }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: t.colors.border,
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.lg,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.md,
      color: t.colors.text,
      fontSize: t.typography.fontSizes.body,
      lineHeight: t.typography.lineHeights.body,
    },
  });

  return (
    <TextInput
      placeholderTextColor={t.colors.textSubtle}
      {...props}
      style={[styles.input, style]}
    />
  );
}


