import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { useCurrentUser } from '../hooks/currentUser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = generateClient();
const API_URL = process.env.PUBLIC_EXPO_GRAPHQL_API_URL;

// La definición de la suscripción GraphQL
const ON_NEW_MESSAGE = `
  subscription OnNewMessage($conversationId: ID!) {
    onNewMessage(conversationId: $conversationId) {
      id
      content
      sender
      createdAt
    }
  }
`;

const GET_MESSAGES = `query GetMessages($conversationId: ID!) {
    getMessages(conversationId: $conversationId) {
      id
      content
      sender
      createdAt
    }
  }
`;

const GET_MY_CONVERSATIONS = `
  query GetMyConversations($userId: String!) {
    getMyConversations(userId: $userId) {
      id
      name
      lastMessage
      updatedAt
      participants
    }
  }
`;

const SEND_MESSAGE = `
  mutation SendMessage($conversationId: ID!, $content: String!, $sender: String!) {
    sendMessage(conversationId: $conversationId, content: $content, sender: $sender) {
      id
      content
      sender
      createdAt
    }
  }
`;  

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('authTokens');
  }
  return await SecureStore.getItemAsync('authTokens');
};

export const useMyConversations = () => {
  const user = useCurrentUser();
  const userId = user?.sub;

  console.log("Buscando chats para usuario:", userId); // 👀 Agrega este log para depurar

  return useQuery({
    queryKey: ['myConversations', userId],
    queryFn: async () => {
      if (!userId) return [];
      const token = await getToken();

      if(!API_URL) {
        console.error("API_URL no está definido");
        return [];
      }

      try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token || '',
              // Agrega aquí el token de autenticación si es necesario
            },
            body: JSON.stringify({
              query: GET_MY_CONVERSATIONS,
              variables: { userId }
            })
          });
          const result = await response.json();
          if (result.errors) {
            console.error("Errores en la respuesta GraphQL:", result.errors);
            return [];
          }
          return result.data.getMyConversations;
      } catch (error) {
          console.error("Error cargando chats:", error);
          return [];
      }
    },
    enabled: !!userId, // Solo se ejecuta si hay usuario
  });
};


export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      // Usamos el mismo cliente de Amplify pero como Promesa (Query)
      const response = await (client.graphql({
        query: GET_MESSAGES,
        variables: { conversationId }
      }) as any); // 'as any' por el tema de tipos que vimos
      
      return response.data; // Devolvemos todo el objeto data
    }
  });
};

export const useChatSubscription = (conversationId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Iniciar la suscripción con Amplify
    const sub = (client.graphql({
      query: ON_NEW_MESSAGE,
      variables: { conversationId }
    })as any).subscribe({
      next: ({ data }: any) => {
        const newMessage = data.onNewMessage;
        console.log("¡Nuevo mensaje recibido!", newMessage);
        queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
          if (!oldData || !oldData.getMessages) return oldData;
          
          return {
            ...oldData,
            getMessages: [...oldData.getMessages, newMessage] // Agregamos al final
          };
        });
      },
      error: (error:any) => console.warn("Error en suscripción:", error)
    });

    // 3. Limpieza al salir de la pantalla
    return () => sub.unsubscribe();
  }, [conversationId, queryClient]);
};


export const useSendMessage = (conversationId: string, content: string, sender: string) => {
  return useMutation({
    mutationFn: async () => {
      // Obtenemos el token manual
      const token = await getToken();
      if(!API_URL) {
        throw new Error("API_URL no está definido");
      }
      // Hacemos la petición HTTP directa a AppSync
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '' 
        },
        body: JSON.stringify({
          query: SEND_MESSAGE,
          variables: { conversationId, content, sender }
        })
      });

      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }

      return json.data.sendMessage;
    }
  });
};