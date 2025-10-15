import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { createTamagui } from 'tamagui';
import { TamaguiConfig } from './tamagui.config';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';

const tamagui = createTamagui(TamaguiConfig);
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamagui}>
        <AppNavigator />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}

