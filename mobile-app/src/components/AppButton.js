import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useThemeTokens } from '../theme/useThemeTokens';

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  left,
  right,
  style,
  accessibilityLabel,
}) {
  const t = useThemeTokens();
  const effectiveVariant = disabled ? 'disabled' : variant;

  const stylesByVariant = StyleSheet.create({
    primary: {
      backgroundColor: t.colors.accent,
      borderColor: t.colors.accent,
    },
    secondary: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.borderStrong,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: t.colors.border,
      borderColor: t.colors.border,
    },
  });

  const textByVariant = StyleSheet.create({
    primary: { color: t.colors.onAccent },
    secondary: { color: t.colors.text },
    ghost: { color: t.colors.textMuted },
    disabled: { color: t.colors.textSubtle },
  });

  const base = StyleSheet.create({
    base: {
      height: 52,
      borderRadius: t.radii.xl,
      borderWidth: 1,
      paddingHorizontal: t.spacing.xl,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    pressed: { opacity: 0.9 },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    side: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBase: { textAlign: 'center' },
  });

  const containerStyle = useMemo(
    () => [base.base, stylesByVariant[effectiveVariant], style],
    [base, stylesByVariant, effectiveVariant, style]
  );

  const textStyle = useMemo(
    () => [base.textBase, textByVariant[effectiveVariant]],
    [base, textByVariant, effectiveVariant]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [containerStyle, pressed && !disabled ? base.pressed : null]}
    >
      <View style={base.content}>
        {left ? <View style={base.side}>{left}</View> : null}
        <AppText variant="h3" style={textStyle}>
          {title}
        </AppText>
        {right ? <View style={base.side}>{right}</View> : <View style={base.side} />}
      </View>
    </Pressable>
  );
}


