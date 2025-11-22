import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { TamaguiProvider,createTamagui } from 'tamagui';
import {  PortalProvider } from '@tamagui/portal';
import { TamaguiConfig } from './tamagui.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import AuthProvider from './src/context/AuthContext';

const tamagui = createTamagui(TamaguiConfig);
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamagui}>
        <PortalProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </PortalProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}

