import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { useCurrentUser } from '../hooks/currentUser';

const client = generateClient();

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

export const useMyConversations = () => {
  const user = useCurrentUser();
  const userId = user?.sub;

  console.log("Buscando chats para usuario:", userId); // 👀 Agrega este log para depurar

  return useQuery({
    queryKey: ['myConversations', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
          const response = await (client.graphql({
            query: GET_MY_CONVERSATIONS,
            variables: { userId }
          }) as any);
          return response.data.getMyConversations;
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