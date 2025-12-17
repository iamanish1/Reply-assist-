import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { ReplyCard } from '../components/ReplyCard';
import { AppButton } from '../components/AppButton';
import { useReplyFlow } from '../state/replyFlowStore';
import { Routes } from '../navigation/routes';
import { makeRepliesShorter, makeRepliesSofter } from '../mock/mockReplies';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';

const FALLBACK_REPLIES = [
  { tone: 'Calm', text: 'Sorry yaar, thoda busy tha. Tum important ho ❤️' },
  { tone: 'Honest', text: "I know I replied late, didn’t mean to ignore you." },
  { tone: 'Short', text: 'Sorry 😔 won’t happen again.' },
];

export function ReplySuggestionsScreen({ navigation }) {
  const t = useThemeTokens();
  const { state, dispatch } = useReplyFlow();
  const [actionCount, setActionCount] = useState(0);

  const replies = useMemo(() => {
    if (state.replies?.length) return state.replies;
    return FALLBACK_REPLIES;
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

  const styles = StyleSheet.create({
    container: { paddingHorizontal: t.spacing.xl, paddingTop: t.spacing.md },
    sub: { color: t.colors.textMuted },
    list: { marginTop: t.spacing.lg },
    item: { marginBottom: t.spacing.lg },
    bottomRow: { flexDirection: 'row', alignItems: 'center' },
    bottomLeft: { flex: 1, marginRight: t.spacing.md },
    bottomRight: { flex: 1 },
  });

  return (
    <Screen
      bottom={
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            <AppButton
              title="Make it softer"
              variant="secondary"
              onPress={() => {
                const next = actionCount + 1;
                setActionCount(next);
                dispatch({ type: 'SET_REPLIES', payload: makeRepliesSofter(replies) });
                maybeShowPaywall(next);
              }}
            />
          </View>
          <View style={styles.bottomRight}>
            <AppButton
              title="Make it shorter"
              variant="secondary"
              onPress={() => {
                const next = actionCount + 1;
                setActionCount(next);
                dispatch({ type: 'SET_REPLIES', payload: makeRepliesShorter(replies) });
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

        <View style={styles.list}>
          {replies.slice(0, 3).map((r, idx) => (
            <View key={`${r.tone}-${idx}`} style={styles.item}>
              <ReplyCard toneLabel={r.tone} text={r.text} onCopy={() => copy(r.text)} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}


