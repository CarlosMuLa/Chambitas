import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRequest, makeRedirectUri, exchangeCodeAsync, TokenResponse } from 'expo-auth-session';

// Cierra la ventana del navegador automáticamente
WebBrowser.maybeCompleteAuthSession();

// --- REEMPLAZA ESTO CON TUS DATOS ---
const COGNITO_DOMAIN = 'https://chambitas-app.auth.us-east-1.amazoncognito.com';
const COGNITO_CLIENT_ID = 'fr3qa25o4fbgj51sh9h18cejc';
// ---------------------------------

// Descubre automáticamente las URLs de Cognito
const discovery = {
  authorizationEndpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
  tokenEndpoint: `${COGNITO_DOMAIN}/oauth2/token`,
};

// Define la estructura del contexto
interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- El Proveedor (Provider) ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. URL de redirección (usando el proxy de Expo)
  const redirectUri = AuthSession.makeRedirectUri();

  // 2. Configura el hook de autenticación
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: COGNITO_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

  // 3. Maneja la respuesta del login
  useEffect(() => {
    const exchangeToken = async (code: string) => {
      try {
        const tokenResult = await exchangeCodeAsync(
          {
            clientId: COGNITO_CLIENT_ID,
            code,
            redirectUri,
            extraParams: {
              grant_type: 'authorization_code',
            },
          },
          discovery
        );
        setTokens(tokenResult);
        await SecureStore.setItemAsync('authTokens', JSON.stringify(tokenResult));
      } catch (error) {
        console.error("Error al intercambiar el código:", error);
      }
    };

    if (response?.type === 'success') {
      exchangeToken(response.params.code);
    }
  }, [response]);

  // 4. Carga los tokens guardados al iniciar la app
  useEffect(() => {
    const loadTokens = async () => {
      const storedTokens = await SecureStore.getItemAsync('authTokens');
      if (storedTokens) {
        setTokens(JSON.parse(storedTokens));
      }
      setIsLoading(false);
    };
    loadTokens();
  }, []);

  const signIn = () => {
    promptAsync();
  };

  const signOut = async () => {
    // Aquí deberías añadir la lógica para revocar el token con Cognito si es necesario
    await SecureStore.deleteItemAsync('authTokens');
    setTokens(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken: tokens?.accessToken || null, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- El Hook personalizado ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

async function saveTokensToStorage(tokens: TokenResponse) {
    const 
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));

export default AuthProvider;