import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './routes';
import { useTheme } from '../theme/ThemeProvider';

import { WelcomeScreen } from '../screens/WelcomeScreen';
import { PasteMessageScreen } from '../screens/PasteMessageScreen';
import { ContextConfirmScreen } from '../screens/ContextConfirmScreen';
import { ReplySuggestionsScreen } from '../screens/ReplySuggestionsScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { colors, resolvedMode } = useTheme();
  const navTheme = React.useMemo(() => {
    const base = resolvedMode === 'dark' ? DarkTheme : DefaultTheme;
    // Important: keep `fonts` from the base theme (native-stack expects fonts.regular etc.)
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [colors, resolvedMode]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={Routes.Welcome}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name={Routes.Welcome} component={WelcomeScreen} />
        <Stack.Screen name={Routes.PasteMessage} component={PasteMessageScreen} />
        <Stack.Screen name={Routes.ContextConfirm} component={ContextConfirmScreen} />
        <Stack.Screen name={Routes.ReplySuggestions} component={ReplySuggestionsScreen} />
        <Stack.Screen name={Routes.Paywall} component={PaywallScreen} />
        <Stack.Screen name={Routes.Settings} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


