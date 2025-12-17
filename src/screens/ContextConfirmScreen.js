import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { Pill } from '../components/Pill';
import { Routes } from '../navigation/routes';
import { useReplyFlow } from '../state/replyFlowStore';
import { generateReplies } from '../mock/mockReplies';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';

const REL_OPTIONS = ['Friend', 'Partner', 'Work', 'Family'];
const MOOD_OPTIONS = ['Calm', 'Upset', 'Angry', 'Neutral'];

export function ContextConfirmScreen({ navigation }) {
  const t = useThemeTokens();
  const { state, dispatch } = useReplyFlow();
  const [editing, setEditing] = useState(false);

  const relationshipLabel = useMemo(() => state.context.relationship, [state.context.relationship]);
  const moodLabel = useMemo(() => state.context.mood, [state.context.mood]);
  const situationLabel = useMemo(() => state.context.situation, [state.context.situation]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
    },
    card: {
      backgroundColor: t.colors.surface,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: t.spacing.sm,
    },
    question: {
      marginTop: t.spacing.md,
      color: t.colors.textMuted,
    },
    editWrap: {
      marginTop: t.spacing.xl,
    },
    sectionTitle: {
      color: t.colors.text,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: t.spacing.md,
    },
    pill: {
      marginRight: t.spacing.sm,
      marginBottom: t.spacing.sm,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomLeft: { flex: 1 },
    bottomRight: { flex: 1, marginLeft: t.spacing.md },
  });

  return (
    <Screen
      bottom={
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            <AppButton
              title="Change"
              variant="secondary"
              onPress={() => setEditing((v) => !v)}
              accessibilityLabel="Change context"
            />
          </View>
          <View style={styles.bottomRight}>
            <AppButton
              title="Yes, looks right"
              onPress={() => {
                const replies = generateReplies({
                  pastedText: state.pastedText,
                  context: state.context,
                });
                dispatch({ type: 'SET_REPLIES', payload: replies });
                navigation.navigate(Routes.ReplySuggestions);
              }}
              accessibilityLabel="Confirm context"
            />
          </View>
        </View>
      }
    >
      <Header
        title="Here’s what I understood"
        onBack={() => navigation.goBack()}
        right={<SettingsButton onPress={() => navigation.navigate(Routes.Settings)} />}
      />

      <View style={styles.container}>
        <AppCard style={styles.card}>
          <View style={styles.row}>
            <AppText variant="label">Relationship</AppText>
            <AppText variant="body">{relationshipLabel}</AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="label">Mood</AppText>
            <AppText variant="body">{moodLabel}</AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="label">Situation</AppText>
            <AppText variant="body">{situationLabel}</AppText>
          </View>
          <AppText variant="small" style={styles.question}>
            Does this look right?
          </AppText>
        </AppCard>

        {editing ? (
          <View style={styles.editWrap}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Relationship
            </AppText>
            <View style={styles.pillsRow}>
              {REL_OPTIONS.map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={state.context.relationship === opt}
                  onPress={() => dispatch({ type: 'SET_CONTEXT', payload: { relationship: opt } })}
                  style={styles.pill}
                />
              ))}
            </View>

            <AppText variant="h3" style={[styles.sectionTitle, { marginTop: t.spacing.xl }]}>
              Mood
            </AppText>
            <View style={styles.pillsRow}>
              {MOOD_OPTIONS.map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={state.context.mood === opt}
                  onPress={() => dispatch({ type: 'SET_CONTEXT', payload: { mood: opt } })}
                  style={styles.pill}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}


