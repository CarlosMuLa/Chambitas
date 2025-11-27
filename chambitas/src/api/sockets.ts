import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GRAPHQL_ENDPOINT = process.env.PUBLIC_EXPO_GRAPHQL_API_URL || '';
const AWS_REGION = process.env.PUBLIC_EXPO_AWS_REGION || 'us-east-2';

// Convertir HTTP endpoint a WebSocket endpoint
const getWebSocketUrl = (httpUrl: string) => {
  // De: https://xxxxx.appsync-api.us-east-2.amazonaws.com/graphql
  // A:  wss://xxxxx.appsync-realtime-api.us-east-2.amazonaws.com/graphql
  return httpUrl
    .replace('https://', 'wss://')
    .replace('appsync-api', 'appsync-realtime-api')
    .replace('http://', 'ws://');
};

const getToken = async () => {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem('idTokens');
  }
  return await SecureStore.getItemAsync('idTokens');
};

export const useChatSubscriptionManual = (conversationId: string) => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionIdRef = useRef<string>('');

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let isIntentionalClose = false;

    const connect = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("❌ No hay token para WebSocket");
          return;
        }

        console.log("🔌 Conectando WebSocket...");

        // Preparar headers para AppSync
        const header = {
          host: GRAPHQL_ENDPOINT.replace('https://', '').replace('/graphql', ''),
          Authorization: token
        };

        const base64Header = btoa(JSON.stringify(header));
        const base64Payload = btoa(JSON.stringify({}));

        // Construir URL con parámetros
        const wsUrl = `${getWebSocketUrl(GRAPHQL_ENDPOINT)}?header=${base64Header}&payload=${base64Payload}`;

        const ws = new WebSocket(wsUrl, ['graphql-ws']);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("✅ WebSocket conectado!");
          
          // Enviar mensaje de inicialización
          ws.send(JSON.stringify({
            type: 'connection_init'
          }));
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log("📨 Mensaje WS recibido:", message);

          switch (message.type) {
            case 'connection_ack':
              console.log("✅ Conexión confirmada, suscribiendo...");
              
              // Ahora sí, suscribirse a los mensajes
              const subscriptionMessage = {
                id: `subscription-${Date.now()}`,
                type: 'start',
                payload: {
                  data: JSON.stringify({
                    query: `
                      subscription OnNewMessage($conversationId: ID!) {
                        onNewMessage(conversationId: $conversationId) {
                          id
                          content
                          sender
                          createdAt
                        }
                      }
                    `,
                    variables: {
                      conversationId: conversationId
                    }
                  }),
                  extensions: {
                    authorization: {
                      Authorization: token,
                      host: header.host
                    }
                  }
                }
              };
              
              subscriptionIdRef.current = subscriptionMessage.id;
              ws.send(JSON.stringify(subscriptionMessage));
              console.log("📤 Suscripción enviada con ID:", subscriptionMessage.id);
              break;

            case 'start_ack':
              console.log("✅ Suscripción confirmada!");
              break;

            case 'data':
              // ¡Nuevo mensaje recibido!
              const newMessage = message.payload.data.onNewMessage;
              console.log("✅ ¡Nuevo mensaje recibido!", newMessage);
              
              // Actualizar React Query
              queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
                if (!oldData) return [newMessage];
                
                const exists = oldData.some((msg: any) => msg.id === newMessage.id);
                if (exists) return oldData;
                
                return [...oldData, newMessage];
              });
              break;

            case 'error':
              console.error("❌ Error en WebSocket:", message);
              break;

            case 'ka':
              // Keep-alive, ignorar
              break;

            default:
              console.log("🤷 Mensaje desconocido:", message);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ Error de WebSocket:", error);
        };

        ws.onclose = (event) => {
          console.log("🔌 WebSocket cerrado", event.code, event.reason);
          
          // Reconectar si no fue cierre intencional
          if (!isIntentionalClose) {
            console.log("🔄 Reconectando en 3 segundos...");
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

      } catch (error) {
        console.error("❌ Error al conectar WebSocket:", error);
      }
    };

    connect();

    // Limpieza
    return () => {
      isIntentionalClose = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      
      if (wsRef.current) {
        if (subscriptionIdRef.current) {
          // Desuscribirse antes de cerrar
          wsRef.current.send(JSON.stringify({
            type: 'stop',
            id: subscriptionIdRef.current
          }));
        }
        wsRef.current.close();
      }
    };
  }, [conversationId, queryClient]);
};