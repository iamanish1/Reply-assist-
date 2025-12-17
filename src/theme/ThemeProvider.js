import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from './palettes';
import { tokens } from './tokens';

const STORAGE_KEY = 'replyassistant.themeMode'; // 'system' | 'light' | 'dark'

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (cancelled) return;
        if (saved === 'light' || saved === 'dark' || saved === 'system') setMode(saved);
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedMode = mode === 'system' ? (systemScheme || 'light') : mode;
  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const setThemeMode = useCallback(async (nextMode) => {
    setMode(nextMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (e) {
      // If storage fails, keep in-memory mode.
    }
  }, []);

  const toggleDark = useCallback(() => {
    setThemeMode(resolvedMode === 'dark' ? 'light' : 'dark');
  }, [resolvedMode, setThemeMode]);

  // Keep native Appearance in sync when user explicitly selects light/dark.
  useEffect(() => {
    if (mode === 'system') return;
    Appearance.setColorScheme(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode, // user selection
      resolvedMode, // effective mode
      colors,
      tokens,
      hydrated,
      setMode: setThemeMode,
      toggleDark,
    }),
    [mode, resolvedMode, colors, hydrated, setThemeMode, toggleDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


