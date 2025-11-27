import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { useCurrentUser } from '../hooks/currentUser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const API_URL = process.env.PUBLIC_EXPO_GRAPHQL_API_URL;
const REAL_TIME_API_URL = process.env.PUBLIC_EXPO_REALTIME_API_URL;

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

const CREATE_CONVERSATION = `
mutation CreateConversation($participants: [String!]!, $name: String) {
    createConversation(participants: $participants, name: $name) {
      id
      name
      participants
    }
  }
`;

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('idTokens');
  }
  return await SecureStore.getItemAsync('idTokens');
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
      const token = await getToken(); // Obtenemos token manual

      if(!API_URL) {
        throw new Error("API_URL no está definido");
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          query: GET_MESSAGES,
          variables: { conversationId }
        })
      });

      const json = await response.json();
      
      if (json.errors) {
        console.error("Error GraphQL:", json.errors);
        throw new Error(json.errors[0].message);
      }

      // Devuelve directamente response.data (que contiene getMessages)
      return json.data.getMessages; 
    },
    // Opcional: Evita recargas constantes si te sales y entras del chat
    staleTime: 1000 * 10, 
  });
};

export const useChatSubscription = (conversationId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let subscription: any = null;
    
    const setupSubscription = async () => {
      try {
        // Verificar que tenemos token antes de suscribirnos
        const token = await getToken();
        if (!token) {
          console.error("❌ No hay token disponible para la suscripción");
          return;
        }

        console.log("🔌 Iniciando suscripción para conversación:", conversationId);
        console.log("🔑 Token (primeros 50 chars):", token.substring(0, 50));
                
        const client = generateClient();
        
        // Iniciar la suscripción
        subscription = (client.graphql({
          query: ON_NEW_MESSAGE,
          variables: { conversationId },
          authMode: 'userPool'
        }) as any).subscribe({
          next: ({ data }: any) => {
            const newMessage = data.onNewMessage;
            console.log("✅ ¡Nuevo mensaje recibido!", newMessage);
            
            // Actualizar la caché de React Query
            queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
              if (!oldData) return [newMessage];
              
              // Evitar duplicados
              const exists = oldData.some((msg: any) => msg.id === newMessage.id);
              if (exists) return oldData;
              
              return [...oldData, newMessage];
            });
          },
          error: (error: any) => {
            console.error("❌ Error en suscripción:", error);
            console.error("📋 Error completo:", JSON.stringify(error, null, 2));

            
            // Mostrar detalles del error
            if (error.errors) {
              error.errors.forEach((err: any, index: number) => {
                console.error(`  Error ${index + 1}:`, err.message);
                console.error(`  Detalles completos:`, JSON.stringify(err, null, 2));
              });
            }
          }
        });

        console.log("✅ Suscripción iniciada correctamente");
        
      } catch (error) {
        console.error("❌ Error al configurar suscripción:", error);
      }
    };

    setupSubscription();

    // Limpieza al desmontar
    return () => {
      if (subscription) {
        console.log("🔌 Cerrando suscripción para:", conversationId);
        subscription.unsubscribe();
      }
    };
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

export const useCreateConversation = (participants: string[], name?: string) => {
    const queryClient = useQueryClient();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if(!API_URL) {
        throw new Error("API_URL no está definido");
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '' 
        },
        body: JSON.stringify({
          query: CREATE_CONVERSATION,
          variables: { participants, name }
        })
      });

      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }

      return json.data.createConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myConversations'] });
      navigation.navigate('Main');
    }
  });
};