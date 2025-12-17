import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from './palettes';
import { tokens } from './tokens';

const STORAGE_KEY = 'replyassistant.themeMode'; // 'system' | 'light' | 'dark'

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState('system');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (cancelled) return;
        if (saved === 'light' || saved === 'dark' || saved === 'system') setModeState(saved);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedMode = mode === 'system' ? (systemScheme || 'light') : mode;
  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const setMode = useCallback(async (nextMode) => {
    setModeState(nextMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (e) {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      colors,
      tokens,
      setMode,
    }),
    [mode, resolvedMode, colors, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


