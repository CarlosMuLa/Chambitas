import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { createTamagui, PortalProvider } from 'tamagui';
import { TamaguiConfig } from './tamagui.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';

const tamagui = createTamagui(TamaguiConfig);
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamagui}>
        <PortalProvider>
          <AppNavigator />
        </PortalProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}

