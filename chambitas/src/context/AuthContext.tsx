import React, { createContext, useState, useEffect, ReactNode, useContext} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  accessToken: string | null;
  idToken: string | null;
  isLoading: boolean;
  loginSuccess: (accessToken: any, idToken: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export const Auth_Context = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Archivo encargado de manejar el contexto de autenticación, guardado de tokens, etc.
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const loginSuccess = async (newAccessToken: any, newIdToken: any) => {
    try {
    if (Platform.OS === 'web') {
      await  AsyncStorage.setItem('authTokens',newAccessToken);
      await AsyncStorage.setItem('idTokens', newIdToken);
    } else {
      await SecureStore.setItemAsync('authTokens',JSON.stringify(newAccessToken));
      await SecureStore.setItemAsync('idTokens', JSON.stringify(newIdToken));
    }
      setAccessToken(newAccessToken);
      setIdToken(newIdToken);
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  };

  const signOut = async () => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('authTokens');
        await AsyncStorage.removeItem('idTokens');
      } else {
        await SecureStore.deleteItemAsync('authTokens');
        await SecureStore.deleteItemAsync('idTokens');
      }
      setAccessToken(null);
      setIdToken(null);
    } catch (error) {
      console.error("Error al eliminar el token:", error);  
    }
  };

  useEffect(() => {
    const loadToken = async () => {
        try {
          let storedTokens : string | null = null;
          let storedIdTokens : string | null = null;
          if (Platform.OS === 'web') {
            storedTokens = await AsyncStorage.getItem('authTokens');
            storedIdTokens = await AsyncStorage.getItem('idTokens');
          } else {
            storedTokens = await SecureStore.getItemAsync('authTokens');
            storedIdTokens = await SecureStore.getItemAsync('idTokens');
          }
          if (storedTokens) {
            if(Platform.OS === 'web') 
              {
                setAccessToken(storedTokens);
              } 
              else 
              {
                setAccessToken(JSON.parse(storedTokens));
              }
          }
          if (storedIdTokens) {
            if(Platform.OS === 'web') 
              {
                setIdToken(storedIdTokens);
              } 
              else 
              {
                setIdToken(JSON.parse(storedIdTokens));
              }
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
    <Auth_Context.Provider value={{ accessToken,idToken, isLoading, signOut, loginSuccess }}>
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