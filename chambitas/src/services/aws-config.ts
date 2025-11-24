import { Amplify } from 'aws-amplify';

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
      endpoint: process.env.PUBLIC_EXPO_GRAPHQL_API_URL, // URL de tu AppSync
      region: 'us-east-2',
      defaultAuthMode: 'userPool' // 'userPool' porque usas Cognito
    }
  }
};

export const configureAmplify = () => {
  Amplify.configure(amplifyConfig as any);
}