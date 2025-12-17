import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useThemeTokens } from '../theme/useThemeTokens';

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  bottom,
  keyboardAvoiding = false,
}) {
  const t = useThemeTokens();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? {
        contentContainerStyle: [{ paddingBottom: t.spacing.xxxl }, contentContainerStyle],
        keyboardShouldPersistTaps: 'handled',
        showsVerticalScrollIndicator: false,
      }
    : { style: [styles.nonScrollContent, contentContainerStyle] };

  const safeStyle = { flex: 1, backgroundColor: t.colors.background };
  const bottomStyle = {
    paddingHorizontal: t.spacing.xl,
    paddingBottom: t.spacing.lg,
    paddingTop: t.spacing.md,
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.background,
  };

  const main = (
    <SafeAreaView style={safeStyle} edges={['top', 'bottom']}>
      <Body {...bodyProps}>{children}</Body>
      {bottom ? <View style={bottomStyle}>{bottom}</View> : null}
    </SafeAreaView>
  );

  if (!keyboardAvoiding) return main;

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {main}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  nonScrollContent: { flex: 1 },
});


