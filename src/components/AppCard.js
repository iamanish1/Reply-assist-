import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeTokens } from '../theme/useThemeTokens';

export function AppCard({ style, children, ...props }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      padding: t.spacing.lg,
      ...t.shadows.card,
    },
  });

  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}


