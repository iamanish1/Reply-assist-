import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useThemeTokens } from '../theme/useThemeTokens';

/**
 * Replaceable logo placeholder.
 * Later you can swap this component to render an <Image source={...}/> or an SVG.
 */
export function LogoMark({ size = 56, label = 'RA', animated = true }) {
  const t = useThemeTokens();
  const styles = useStyles(t);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, scale]);

  const boxStyle = useMemo(
    () => [
      styles.box,
      { width: size, height: size, borderRadius: Math.round(size * 0.32) },
    ],
    [styles, size]
  );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={boxStyle}>
        <View style={styles.innerGlow} />
        <AppText variant="h3" style={styles.text}>
          {label}
        </AppText>
      </View>
    </Animated.View>
  );
}

function useStyles(t) {
  return StyleSheet.create({
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: t.colors.surface,
      borderWidth: 2,
      borderColor: t.colors.accent,
    },
    innerGlow: {
      position: 'absolute',
      top: -20,
      left: -20,
      width: 60,
      height: 60,
      borderRadius: 999,
      backgroundColor: t.colors.accentSoft,
    },
    text: {
      color: t.colors.accent,
      fontSize: 16,
      letterSpacing: 0.5,
    },
  });
}


