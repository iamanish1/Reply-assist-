import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ReplyFlowProvider } from './src/state/replyFlowStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { resolvedMode } = useTheme();
  return (
    <ReplyFlowProvider>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </ReplyFlowProvider>
  );
}
