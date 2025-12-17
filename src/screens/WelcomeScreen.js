import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Routes } from '../navigation/routes';
import { LogoMark } from '../components/LogoMark';
import { useThemeTokens } from '../theme/useThemeTokens';
import { SettingsButton } from '../components/SettingsButton';

export function WelcomeScreen({ navigation }) {
  const t = useThemeTokens();
  const styles = makeStyles(t);
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(10)).current;
  const previewIn1 = useRef(new Animated.Value(0)).current;
  const previewIn2 = useRef(new Animated.Value(0)).current;
  const previewFade = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const scenarios = useMemo(
    () => [
      {
        key: 'whatsapp',
        incoming: 'Tum hamesha late reply karte ho…',
        outgoing: 'Sorry 😔 I didn’t mean to ignore you.',
      },
      {
        key: 'instagram',
        incoming: 'Seen pe chhod diya? 😅',
        outgoing: 'Arre nahi, missed it. Replying now.',
      },
      {
        key: 'email',
        incoming: 'Following up on the update you promised.',
        outgoing: 'Thanks for the reminder. I’ll share an update by EOD today.',
      },
    ],
    []
  );

  const active = scenarios[scenarioIndex % scenarios.length];

  function playBubblesIn() {
    previewIn1.setValue(0);
    previewIn2.setValue(0);
    Animated.sequence([
      Animated.timing(previewIn1, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.delay(140),
      Animated.timing(previewIn2, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();

    playBubblesIn();

    intervalRef.current = setInterval(() => {
      // Fade the preview, swap content, then animate bubbles back in.
      Animated.timing(previewFade, { toValue: 0, duration: 180, useNativeDriver: true }).start(
        () => {
          setScenarioIndex((i) => (i + 1) % scenarios.length);
          Animated.timing(previewFade, { toValue: 1, duration: 220, useNativeDriver: true }).start(
            () => playBubblesIn()
          );
        }
      );
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fade, rise, previewFade, scenarios]);

  return (
    <Screen
      bottom={
        <View>
          <View style={styles.bottomMeta}>
            <View style={styles.metaChip}>
              <AppText variant="tiny" style={styles.metaText}>
                ⚡ No sign-up required
              </AppText>
            </View>
          </View>
          <AppButton
            title="Try it now"
            variant="secondary"
            onPress={() => navigation.navigate(Routes.PasteMessage)}
            right={<Ionicons name="arrow-forward" size={18} color={t.colors.text} />}
            accessibilityLabel="Try Reply Assistant now"
            style={styles.cta}
          />
        </View>
      }
    >
      <Animated.View style={[styles.container, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <LogoMark size={36} />
            <View style={styles.heroRight}>
              <AppText variant="label" style={styles.brandText}>
                Reply Assistant
              </AppText>
              <AppText variant="tiny" style={styles.tagline}>
                Your reply assistant
              </AppText>
            </View>
          </View>
          <SettingsButton onPress={() => navigation.navigate(Routes.Settings)} />
        </View>

        <AppText variant="h1" style={styles.heroTitle}>
          Stuck on what to reply?
        </AppText>

        <AppText variant="body" style={styles.reassurance}>
          Helps you reply without sounding awkward.
        </AppText>

        <AppText variant="small" style={styles.subtext}>
          Paste any message and get a ready-to-send reply in seconds.
        </AppText>

        <Animated.View style={[styles.previewCard, { opacity: previewFade }]} pointerEvents="none">
          <View style={styles.bubbles}>
            <Animated.View
              style={[
                styles.bubbleIncoming,
                {
                  opacity: previewIn1,
                  transform: [
                    {
                      translateY: previewIn1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <AppText variant="small" numberOfLines={2} style={styles.bubbleTextMuted}>
                {active.incoming}
              </AppText>
            </Animated.View>

            <Animated.View
              style={[
                styles.bubbleOutgoing,
                {
                  opacity: previewIn2,
                  transform: [
                    {
                      translateY: previewIn2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <AppText variant="small" numberOfLines={2} style={styles.bubbleText}>
                {active.outgoing}
              </AppText>
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.trustInline}>
          <View style={styles.trustInlineRow}>
            <Ionicons name="lock-closed" size={16} color={t.colors.textMuted} />
            <AppText variant="small" style={styles.trustInlineText}>
              We don’t read your chats
            </AppText>
          </View>
          <View style={styles.trustInlineRow}>
            <Ionicons name="paper-plane" size={16} color={t.colors.textMuted} />
            <AppText variant="small" style={styles.trustInlineText}>
              Nothing is sent without you
            </AppText>
          </View>
        </View>
      </Animated.View>
    </Screen>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: t.spacing.xxxl,
    },
    heroLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroRight: {
      marginLeft: t.spacing.md,
    },
    brandText: {
      color: t.colors.text,
    },
    tagline: {
      marginTop: 2,
      color: t.colors.textMuted,
    },
    heroTitle: {
      marginTop: 0,
      color: t.colors.text,
      fontSize: 29,
      lineHeight: 34,
    },
    reassurance: {
      marginTop: t.spacing.md,
      color: t.colors.text,
    },
    subtext: {
      marginTop: t.spacing.sm,
      color: t.colors.textMuted,
    },
    bottomMeta: {
      alignItems: 'center',
      marginBottom: t.spacing.sm,
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radii.pill,
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    metaText: {
      color: t.colors.textMuted,
    },
    cta: {
      borderWidth: 2,
      borderColor: t.colors.borderStrong,
    },
    previewCard: {
      marginTop: t.spacing.md,
      padding: t.spacing.md,
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radii.lg,
      opacity: 0.72,
    },
    bubbles: {
      marginTop: 0,
    },
    bubbleIncoming: {
      alignSelf: 'flex-start',
      maxWidth: '88%',
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radii.lg,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.xs,
      marginBottom: t.spacing.sm,
    },
    bubbleOutgoing: {
      alignSelf: 'flex-end',
      maxWidth: '88%',
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radii.lg,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.xs,
    },
    bubbleText: {
      color: t.colors.text,
    },
    bubbleTextMuted: {
      color: t.colors.textMuted,
    },
    trustInline: {
      marginTop: t.spacing.md,
      paddingHorizontal: t.spacing.xs,
    },
    trustInlineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: t.spacing.xs,
    },
    trustInlineText: {
      marginLeft: t.spacing.sm,
      color: t.colors.textMuted,
    },
  });


