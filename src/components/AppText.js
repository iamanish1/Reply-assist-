import React from 'react';
import { Text } from 'react-native';
import { useThemeTokens } from '../theme/useThemeTokens';

export function AppText({
  variant = 'body',
  style,
  children,
  ...props
}) {
  const t = useThemeTokens();
  const typography = t?.typography || {};
  const fontFamilies = typography.fontFamilies || {};
  const fontSizes = typography.fontSizes || {};
  const lineHeights = typography.lineHeights || {};
  const safeFont = (key) => fontFamilies[key];
  const safeSize = (key, fallback) => (fontSizes[key] ?? fallback);
  const safeLine = (key, fallback) => (lineHeights[key] ?? fallback);

  const stylesByVariant = {
    h1: {
      fontSize: safeSize('h1', 26),
      lineHeight: safeLine('h1', 32),
      fontFamily: safeFont('semibold'),
      color: t.colors.text,
    },
    h2: {
      fontSize: safeSize('h2', 20),
      lineHeight: safeLine('h2', 26),
      fontFamily: safeFont('semibold'),
      color: t.colors.text,
    },
    h3: {
      fontSize: safeSize('h3', 16),
      lineHeight: safeLine('h3', 22),
      fontFamily: safeFont('medium'),
      color: t.colors.text,
    },
    body: {
      fontSize: safeSize('body', 15),
      lineHeight: safeLine('body', 22),
      fontFamily: safeFont('regular'),
      color: t.colors.text,
    },
    small: {
      fontSize: safeSize('small', 13),
      lineHeight: safeLine('small', 18),
      fontFamily: safeFont('regular'),
      color: t.colors.textMuted,
    },
    tiny: {
      fontSize: safeSize('tiny', 12),
      lineHeight: safeLine('tiny', 16),
      fontFamily: safeFont('regular'),
      color: t.colors.textSubtle,
    },
    label: {
      fontSize: safeSize('tiny', 12),
      lineHeight: safeLine('tiny', 16),
      fontFamily: safeFont('medium'),
      color: t.colors.textMuted,
    },
  };

  return (
    <Text {...props} style={[stylesByVariant[variant], style]}>
      {children}
    </Text>
  );
}


