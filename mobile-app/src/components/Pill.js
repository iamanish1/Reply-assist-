import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useThemeTokens } from '../theme/useThemeTokens';

export function Pill({ label, selected, onPress, style }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    base: {
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radii.pill,
      borderWidth: 1,
    },
    selected: {
      backgroundColor: t.colors.accentSoft,
      borderColor: t.colors.accent,
    },
    unselected: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.borderStrong,
    },
    pressed: {
      opacity: 0.9,
    },
    textSelected: {
      color: t.colors.text,
    },
    textUnselected: {
      color: t.colors.textMuted,
    },
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      <AppText variant="small" style={selected ? styles.textSelected : styles.textUnselected}>
        {label}
      </AppText>
    </Pressable>
  );
}


