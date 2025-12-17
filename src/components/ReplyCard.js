import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { useThemeTokens } from '../theme/useThemeTokens';

export function ReplyCard({ toneLabel, text, onCopy }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    card: {
      padding: t.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tonePill: {
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.xs,
      backgroundColor: t.colors.surface2,
      borderRadius: t.radii.pill,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    toneText: { color: t.colors.textMuted },
    replyText: {
      marginTop: t.spacing.md,
      color: t.colors.text,
    },
    actions: {
      marginTop: t.spacing.lg,
    },
    copyBtn: {
      height: 46,
      borderRadius: t.radii.xl,
    },
  });

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.tonePill}>
          <AppText variant="label" style={styles.toneText}>
            {toneLabel}
          </AppText>
        </View>
      </View>

      <AppText variant="body" style={styles.replyText}>
        {text}
      </AppText>

      <View style={styles.actions}>
        <AppButton
          title="Copy"
          variant="secondary"
          onPress={onCopy}
          left={<Ionicons name="copy-outline" size={16} color={t.colors.textMuted} />}
          accessibilityLabel={`Copy reply: ${toneLabel}`}
          style={styles.copyBtn}
        />
      </View>
    </AppCard>
  );
}


