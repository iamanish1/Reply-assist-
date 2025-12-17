import { useMemo } from 'react';
import { useTheme } from './ThemeProvider';

export function useThemeTokens() {
  const { colors, tokens, resolvedMode } = useTheme();
  return useMemo(
    () => ({
      colors,
      ...tokens,
      mode: resolvedMode,
    }),
    [colors, tokens, resolvedMode]
  );
}


