import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { createTamagui } from 'tamagui';
import { TamaguiConfig } from './tamagui.config';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const tamagui = createTamagui(TamaguiConfig);

export default function App() {
  return (
    <TamaguiProvider config={tamagui}>
      <AppNavigator />
    </TamaguiProvider>
  );
}

