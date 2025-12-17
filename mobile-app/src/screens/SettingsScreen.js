import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppCard } from '../components/AppCard';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { AppButton } from '../components/AppButton';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeTokens } from '../theme/useThemeTokens';
import { clearApiBaseUrlOverride, getApiBaseUrl, getDefaultApiBaseUrl, setApiBaseUrlOverride } from '../config/apiBaseUrl';

export function SettingsScreen({ navigation }) {
  const { mode, setMode, resolvedMode } = useTheme();
  const t = useThemeTokens();
  const [apiUrl, setApiUrl] = useState('');
  const [apiUrlPlaceholder, setApiUrlPlaceholder] = useState('');
  const [testing, setTesting] = useState(false);

  const isDark = resolvedMode === 'dark';
  const isSystem = mode === 'system';

  useEffect(() => {
    let mounted = true;
    (async () => {
      const current = await getApiBaseUrl();
      if (mounted) setApiUrl(current);
      if (mounted) setApiUrlPlaceholder(getDefaultApiBaseUrl());
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
    input: {
      marginTop: t.spacing.md,
    },
    btnRow: {
      flexDirection: 'row',
      marginTop: t.spacing.md,
    },
    btnLeft: { flex: 1 },
    btnRight: { flex: 1, marginLeft: t.spacing.md },
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

        {__DEV__ ? (
          <View style={{ marginTop: t.spacing.lg }}>
            <AppCard style={styles.card}>
              <AppText variant="h3">Backend (dev)</AppText>
              <AppText variant="tiny" style={styles.hint}>
                Set your backend URL for local testing. In production builds, use EXPO_PUBLIC_API_BASE_URL.
              </AppText>

              <AppTextInput
                value={apiUrl}
                onChangeText={setApiUrl}
                placeholder={apiUrlPlaceholder || 'http://localhost:3001'}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={styles.input}
              />

              <View style={styles.btnRow}>
                <View style={styles.btnLeft}>
                  <AppButton
                    title="Save"
                    onPress={async () => {
                      try {
                        const res = await setApiBaseUrlOverride(apiUrl);
                        if (!res.ok) {
                          Alert.alert('Invalid URL', res.error);
                          return;
                        }
                        Alert.alert('Saved', `Using ${res.value}`);
                      } catch {
                        Alert.alert('Error', 'Please try again.');
                      }
                    }}
                  />
                </View>
                <View style={styles.btnRight}>
                  <AppButton
                    title="Reset"
                    variant="secondary"
                    onPress={async () => {
                      try {
                        await clearApiBaseUrlOverride();
                        const next = getDefaultApiBaseUrl();
                        setApiUrl(next);
                        Alert.alert('Reset', `Using ${next}`);
                      } catch {
                        Alert.alert('Error', 'Please try again.');
                      }
                    }}
                  />
                </View>
              </View>

              <View style={{ marginTop: t.spacing.md }}>
                <AppButton
                  title={testing ? 'Testing…' : 'Test backend'}
                  variant="secondary"
                  disabled={testing}
                  onPress={async () => {
                    try {
                      setTesting(true);
                      const baseUrl = await getApiBaseUrl();
                      const controller = new AbortController();
                      const timeoutId = setTimeout(() => controller.abort(), 4000);
                      const res = await fetch(`${baseUrl}/health`, { signal: controller.signal });
                      const text = await res.text();
                      clearTimeout(timeoutId);
                      if (res.ok) {
                        Alert.alert('Connected', `OK: ${baseUrl}\n${text}`);
                      } else {
                        Alert.alert('Not connected', `Status ${res.status}\n${baseUrl}\n${text}`);
                      }
                    } catch (e) {
                      Alert.alert(
                        'Not connected',
                        `Can’t reach backend.\nTry setting: http://YOUR_PC_IP:3001\n\n${e?.message || ''}`
                      );
                    } finally {
                      setTesting(false);
                    }
                  }}
                />
              </View>
            </AppCard>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}


