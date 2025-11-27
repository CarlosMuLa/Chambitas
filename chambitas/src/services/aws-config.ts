import { Amplify } from 'aws-amplify';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('authTokens');
  }
  return await SecureStore.getItemAsync('authTokens');
};

// Aquí pones los IDs de los recursos que YA CREASTE en la consola
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.PUBLIC_EXPO_USER_POOL_ID, // Tu User Pool ID actual
      userPoolClientId: process.env.PUBLIC_EXPO_COGNITO_CLIENT_ID, // Tu App Client ID Público actual
      loginWith: {
        email: true,
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.PUBLIC_EXPO_GRAPHQL_API_URL, 
      region: process.env.PUBLIC_EXPO_AWS_REGION || 'us-east-2',
      defaultAuthMode: 'userPool'
    }
  }
};

export const configureAmplify = () => {

  console.log("AAAAAAAAAAAAConfigurando Amplify con:");
  console.log(amplifyConfig);
  Amplify.configure(amplifyConfig as any,{
    API: {
      GraphQL:{
        headers: async () => {
          const token = await getToken();
          return { Authorization: token || '' };
        }
      }
    }
  });
  console.log("Amplify configurado con:", amplifyConfig);
}