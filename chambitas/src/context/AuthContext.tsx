import React, { createContext, useState, useEffect, ReactNode, useContext} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  loginSuccess: (token: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export const Auth_Context = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Archivo encargado de manejar el contexto de autenticación, guardado de tokens, etc.
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const loginSuccess = async (token: any) => {
    try {
    if (Platform.OS === 'web') {
      await  AsyncStorage.setItem('authTokens',token);
    } else {
      await SecureStore.setItemAsync('authTokens',token);
    }
      setAccessToken(token);
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  };

  const signOut = async () => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('authTokens');
      } else {
        await SecureStore.deleteItemAsync('authTokens');
      }
      setAccessToken(null);
    } catch (error) {
      console.error("Error al eliminar el token:", error);  
    }
  };

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


  return (
    <Auth_Context.Provider value={{ accessToken, isLoading, signOut, loginSuccess }}>
      {children}
    </Auth_Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Auth_Context);
  if(!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};


export default AuthProvider;