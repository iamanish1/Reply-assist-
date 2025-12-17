import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';
import { Routes } from '../navigation/routes';

export function PaywallScreen({ navigation }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    container: { paddingHorizontal: t.spacing.xl, paddingTop: t.spacing.md },
    headline: { color: t.colors.text },
    card: { marginTop: t.spacing.xl, backgroundColor: t.colors.surface2 },
    benefit: { marginTop: t.spacing.sm, color: t.colors.textMuted },
    divider: { height: 1, backgroundColor: t.colors.border, marginVertical: t.spacing.lg },
    price: { color: t.colors.text },
    note: { marginTop: t.spacing.sm },
  });

  return (
    <Screen
      bottom={
        <View>
          <AppButton
            title="Upgrade"
            onPress={() => Alert.alert('Upgrade', 'Payments will be added later.')}
          />
          <View style={{ height: t.spacing.md }} />
          <AppButton title="Maybe later" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      }
    >
      <Header
        title="Upgrade"
        onBack={() => navigation.goBack()}
        right={<SettingsButton onPress={() => navigation.navigate(Routes.Settings)} />}
      />

      <View style={styles.container}>
        <AppText variant="h2" style={styles.headline}>
          Want replies that sound more like YOU?
        </AppText>

        <AppCard style={styles.card}>
          <AppText variant="body" style={styles.benefit}>
            • Unlimited replies
          </AppText>
          <AppText variant="body" style={styles.benefit}>
            • Save your style
          </AppText>
          <AppText variant="body" style={styles.benefit}>
            • Relationship-specific tones
          </AppText>

          <View style={styles.divider} />

          <AppText variant="h2" style={styles.price}>
            ₹149 / month
          </AppText>
          <AppText variant="small" style={styles.note}>
            Cancel anytime.
          </AppText>
        </AppCard>
      </View>
    </Screen>
  );
}


