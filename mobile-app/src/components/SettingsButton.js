import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeTokens } from '../theme/useThemeTokens';

export function SettingsButton({ onPress }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    btn: {
      width: 36,
      height: 36,
      borderRadius: t.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.surface2,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    pressed: { opacity: 0.85 },
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Settings"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed ? styles.pressed : null]}
      hitSlop={10}
    >
      <Ionicons name="settings-outline" size={18} color={t.colors.text} />
    </Pressable>
  );
}


