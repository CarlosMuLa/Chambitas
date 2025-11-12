import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand, 
  InitiateAuthCommandInput, 
  AuthFlowType  } 
  from "@aws-sdk/client-cognito-identity-provider";


// --- REEMPLAZA ESTO CON TUS DATOS ---
const AWS_REGION = 'us-east-1';
const COGNITO_CLIENT_ID = '3367gg4l912tgspqgp89eoiuhm';

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});


interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const Auth_Context = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
        try {
          let storedTokens : string | null = null;
          if (Platform.OS === 'web') {
            storedTokens = await AsyncStorage.getItem('authTokens');
          } else {
            storedTokens = await SecureStore.getItemAsync('authTokens');
          }
          if (storedTokens) {
            setAccessToken(storedTokens);
          }
        } catch (error) 
          {
            console.error("Error al cargar el token:", error);
          }
      setIsLoading(false);
    };
    loadToken();
  }, []);


  const signIn = async (username: string, password: string) => {
    const authParams: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    
    const command = new InitiateAuthCommand(authParams);

    try {
      const response = await cognitoClient.send(command);
      const token = response.AuthenticationResult;

      if (token && token.AccessToken && token.RefreshToken) {
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('authTokens', token.AccessToken);
          await AsyncStorage.setItem('refreshToken', token.RefreshToken);
        }
        else {
          await SecureStore.setItemAsync('authTokens', token.AccessToken);
          await SecureStore.setItemAsync('refreshToken', token.RefreshToken);
        }
        setAccessToken(token.AccessToken);
      } else {
        throw new Error("Tokens no recibidos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('authTokens');
      await AsyncStorage.removeItem('refreshToken');
    } else {
      await SecureStore.deleteItemAsync('authTokens');
      await SecureStore.deleteItemAsync('refreshToken');
    }
    setAccessToken(null);
  };

  return (
    <Auth_Context.Provider value={{ accessToken, isLoading, signIn, signOut }}>
      {children}
    </Auth_Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Auth_Context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



// Define la estructura del contexto


export default AuthProvider;