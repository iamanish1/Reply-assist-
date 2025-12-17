import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useThemeTokens } from '../theme/useThemeTokens';

export function Header({ title, onBack, right }) {
  const t = useThemeTokens();
  const styles = StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
      paddingBottom: t.spacing.md,
    },
    left: { width: 44, alignItems: 'flex-start' },
    center: { flex: 1, alignItems: 'center' },
    rightWrap: { width: 44, alignItems: 'flex-end' },
    title: { color: t.colors.text },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: t.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.surface2,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    backPlaceholder: { width: 36, height: 36 },
    pressed: { opacity: 0.85 },
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            style={({ pressed }) => [styles.backBtn, pressed ? styles.pressed : null]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={22} color={t.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      <View style={styles.center}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
      </View>

      <View style={styles.rightWrap}>{right || <View style={styles.backPlaceholder} />}</View>
    </View>
  );
}


