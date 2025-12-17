import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppCard } from '../components/AppCard';
import { ReplyCard } from '../components/ReplyCard';
import { AppButton } from '../components/AppButton';
import { useReplyFlow } from '../state/replyFlowStore';
import { Routes } from '../navigation/routes';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';
import { fetchReplySuggestions } from '../services/replyApi';

function toApiRelationship(rel) {
  const v = (rel || '').toLowerCase();
  if (!v) return 'personal';
  return v;
}

function toApiTone(mood) {
  const v = (mood || '').toLowerCase();
  if (!v) return 'calm';
  if (v === 'angry' || v === 'upset') return 'calm';
  return v;
}

export function ReplySuggestionsScreen({ navigation }) {
  const t = useThemeTokens();
  const { state, dispatch } = useReplyFlow();
  const [actionCount, setActionCount] = useState(0);
  const [tuning, setTuning] = useState(false);

  const replies = useMemo(() => {
    if (state.replies?.length) return state.replies;
    return [];
  }, [state.replies]);

  async function copy(text) {
    try {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === 'android') ToastAndroid.show('Copied', ToastAndroid.SHORT);
    } catch (e) {
      Alert.alert('Could not copy', 'Please try again.');
    }
  }

  function maybeShowPaywall(nextCount) {
    if (nextCount >= 3) navigation.navigate(Routes.Paywall);
  }

  async function regenerate({ toneOverride }) {
    try {
      setTuning(true);
      const nextReplies = await fetchReplySuggestions({
        message: state.pastedText,
        context: {
          relationship: toApiRelationship(state.context.relationship),
          tone: toneOverride || toApiTone(state.context.mood),
        },
      });
      dispatch({ type: 'SET_REPLIES', payload: nextReplies });
    } catch (e) {
      const msg =
        typeof e?.message === 'string' && e.message.trim()
          ? e.message
          : 'Something went wrong. Please try again.';
      if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.LONG);
      else Alert.alert('Please try again', msg);
    } finally {
      setTuning(false);
    }
  }

  const styles = StyleSheet.create({
    container: { paddingHorizontal: t.spacing.xl, paddingTop: t.spacing.md },
    sub: { color: t.colors.textMuted },
    list: { marginTop: t.spacing.lg },
    item: { marginBottom: t.spacing.lg },
    bottomRow: { flexDirection: 'row', alignItems: 'center' },
    bottomLeft: { flex: 1, marginRight: t.spacing.md },
    bottomRight: { flex: 1 },
    emptyCard: { padding: t.spacing.lg, marginTop: t.spacing.lg }
  });

  return (
    <Screen
      bottom={
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            <AppButton
              title="More gentle"
              variant="secondary"
              disabled={tuning || replies.length === 0}
              onPress={() => {
                const next = actionCount + 1;
                setActionCount(next);
                regenerate({ toneOverride: 'soft' });
                maybeShowPaywall(next);
              }}
            />
          </View>
          <View style={styles.bottomRight}>
            <AppButton
              title="More direct"
              variant="secondary"
              disabled={tuning || replies.length === 0}
              onPress={() => {
                const next = actionCount + 1;
                setActionCount(next);
                regenerate({ toneOverride: 'firm' });
                maybeShowPaywall(next);
              }}
            />
          </View>
        </View>
      }
    >
      <Header
        title="Suggested replies"
        onBack={() => navigation.goBack()}
        right={<SettingsButton onPress={() => navigation.navigate(Routes.Settings)} />}
      />

      <View style={styles.container}>
        <AppText variant="small" style={styles.sub}>
          Pick one that feels like you.
        </AppText>

        {replies.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <AppText variant="body">No replies yet.</AppText>
            <AppText variant="tiny" style={[styles.sub, { marginTop: t.spacing.sm }]}>
              Go back and try generating again. If you’re on a phone, set your backend URL in Settings.
            </AppText>
            <View style={{ marginTop: t.spacing.lg }}>
              <AppButton title="Go back" variant="secondary" onPress={() => navigation.goBack()} />
            </View>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {replies.slice(0, 3).map((text, idx) => (
              <View key={`reply-${idx}`} style={styles.item}>
                <ReplyCard
                  toneLabel={idx === 0 ? 'Best' : idx === 1 ? 'Softer' : 'Firmer'}
                  text={text}
                  onCopy={() => copy(text)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}


