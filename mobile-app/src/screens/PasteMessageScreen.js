import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { AppButton } from '../components/AppButton';
import { Routes } from '../navigation/routes';
import { useReplyFlow } from '../state/replyFlowStore';
import { inferContextFromText } from '../mock/mockNlu';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';

export function PasteMessageScreen({ navigation }) {
  const t = useThemeTokens();
  const { state, dispatch } = useReplyFlow();
  const [text, setText] = useState(state.pastedText);

  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
    },
    helperTop: {
      color: t.colors.textMuted,
      marginBottom: t.spacing.md,
    },
    input: {
      minHeight: 220,
      paddingTop: t.spacing.md,
    },
    example: {
      marginTop: t.spacing.md,
      color: t.colors.textSubtle,
    },
    helper: {
      marginTop: t.spacing.sm,
    },
  });

  return (
    <Screen
      keyboardAvoiding
      bottom={
        <AppButton
          title="Get reply"
          disabled={!canSubmit}
          onPress={() => {
            dispatch({ type: 'SET_PASTED_TEXT', payload: text });
            dispatch({ type: 'SET_CONTEXT', payload: inferContextFromText(text) });
            dispatch({ type: 'SET_REPLIES', payload: [] });
            navigation.navigate(Routes.ContextConfirm);
          }}
        />
      }
    >
      <Header
        title="Paste message"
        onBack={() => navigation.goBack()}
        right={<SettingsButton onPress={() => navigation.navigate(Routes.Settings)} />}
      />

      <View style={styles.container}>
        <AppText variant="body" style={styles.helperTop}>
          Paste the last message or short chat here…
        </AppText>

        <AppTextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Paste the last message or short chat here…"
          style={styles.input}
          textAlignVertical="top"
          autoCorrect
        />

        <AppText variant="tiny" style={styles.example}>
          Example: “Tum hamesha late reply karte ho…”
        </AppText>

        <AppText variant="small" style={styles.helper}>
          Last message is usually enough.
        </AppText>
      </View>
    </Screen>
  );
}


