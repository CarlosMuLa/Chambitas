import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';

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