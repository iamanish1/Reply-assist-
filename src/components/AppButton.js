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

  const styles = StyleSheet.create({
    base: {
      height: 52,
      borderRadius: t.radii.xl,
      borderWidth: 1,
      paddingHorizontal: t.spacing.xl,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    pressed: {
      opacity: 0.9,
    },
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
    textBase: {
      textAlign: 'center',
    },
  });

  const containerStyle = useMemo(
    () => [styles.base, stylesByVariant[effectiveVariant], style],
    [styles, stylesByVariant, effectiveVariant, style]
  );

  const textStyle = useMemo(
    () => [styles.textBase, textByVariant[effectiveVariant]],
    [styles, textByVariant, effectiveVariant]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <View style={styles.content}>
        {left ? <View style={styles.side}>{left}</View> : null}
        <AppText variant="h3" style={textStyle}>
          {title}
        </AppText>
        {right ? <View style={styles.side}>{right}</View> : <View style={styles.side} />}
      </View>
    </Pressable>
  );
}


