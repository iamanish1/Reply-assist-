import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppCard } from '../components/AppCard';
import { AppText } from '../components/AppText';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeTokens } from '../theme/useThemeTokens';

export function SettingsScreen({ navigation }) {
  const { mode, setMode, resolvedMode } = useTheme();
  const t = useThemeTokens();

  const isDark = resolvedMode === 'dark';
  const isSystem = mode === 'system';

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
    },
    card: {
      padding: t.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowText: {
      flex: 1,
      paddingRight: t.spacing.lg,
    },
    hint: {
      marginTop: t.spacing.sm,
      color: t.colors.textMuted,
    },
    separator: {
      height: 1,
      backgroundColor: t.colors.border,
      marginVertical: t.spacing.lg,
    },
  });

  return (
    <Screen>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="h3">Theme</AppText>
              <AppText variant="small" style={styles.hint}>
                Switch between light and dark whenever you want.
              </AppText>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="body">Use system setting</AppText>
              <AppText variant="tiny" style={styles.hint}>
                Follows your phone’s theme.
              </AppText>
            </View>
            <Switch
              value={isSystem}
              onValueChange={(v) => setMode(v ? 'system' : resolvedMode)}
              trackColor={{ false: t.colors.borderStrong, true: t.colors.accentSoft }}
              thumbColor={isSystem ? t.colors.accent : t.colors.textSubtle}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="body">Dark mode</AppText>
              <AppText variant="tiny" style={styles.hint}>
                Easier on the eyes at night.
              </AppText>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => setMode(v ? 'dark' : 'light')}
              trackColor={{ false: t.colors.borderStrong, true: t.colors.accentSoft }}
              thumbColor={isDark ? t.colors.accent : t.colors.textSubtle}
            />
          </View>
        </AppCard>
      </View>
    </Screen>
  );
}


