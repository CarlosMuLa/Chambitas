interface LoginCredentials {
    username: string;
    password: string;
}

interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
    cellphone: string;
}

interface ConfirmCredentials {
    username: string;
    code: string;
}

interface ResendCodeCredentials {
    username: string;
}

import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand,
  AuthFlowType,
  ResendConfirmationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";// O donde tengas tus consts
const AWS_REGION = 'us-east-2';
const COGNITO_CLIENT_ID = '';

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });

export const authService = {
  // Función pura: solo recibe datos y devuelve promesa
  signIn: async ({ username, password }: LoginCredentials) => {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: username, PASSWORD: password },
    });
    const response = await cognitoClient.send(command);
    return response.AuthenticationResult; // Devuelve los tokens
  },

  signUp: async ({ username, email, password, cellphone }: SignUpCredentials) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanNumber = cellphone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanNumber.startsWith('52') 
      ? `+${cleanNumber}` 
      : `+52${cleanNumber}`;
    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: cleanEmail },
        { Name: 'phone_number', Value: formattedPhone },
      ],
    });
    return await cognitoClient.send(command);
  },

  confirmUser: async ({ username, code }: ConfirmCredentials) => {
    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    });
    return await cognitoClient.send(command);
  },

  resendCode: async ({ username }: ResendCodeCredentials) => {
    const command = new ResendConfirmationCodeCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
    });
    return await cognitoClient.send(command);
  }
};