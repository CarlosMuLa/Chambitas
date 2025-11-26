import React, { useState, useRef, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { YStack, XStack, Input, Button, ScrollView, Text, Spinner, Paragraph, Avatar } from 'tamagui';
import { useGetMessages, useChatSubscription } from '../api/messagesServices';
import { useCurrentUser } from '../hooks/currentUser';
import { useMutation } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';

// Definir la mutación de envío aquí o importarla si la tienes en services
const client = generateClient();
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

export default function ChatDetailScreen() {
    const route = useRoute();
    // 1. Recibimos el ID de la conversación desde la navegación
    // (Si TS se queja, usa 'any' temporalmente en route.params)
    const { conversationId, name } = route.params as { conversationId: string; name: string };
    
    const user = useCurrentUser();
    const myUser = user?.username || "Invitado";
    const [text, setText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    // 2. Lógica de carga y suscripción (Lo que tenías, pero ahora con ID real)
    const { data, isLoading } = useGetMessages(conversationId);
    useChatSubscription(conversationId);

    // 3. Mutación para enviar mensaje
    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            await client.graphql({
                query: SEND_MESSAGE,
                variables: { conversationId, content: text, sender: myUser }
            });
            setText(""); // Limpiar input
        } catch (e) {
            console.error("Error enviando:", e);
        }
    };

    // Auto-scroll al final
    const messages = data?.getMessages || [];
    useEffect(() => {
        if (messages.length) {
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    if (isLoading) return <Spinner size="large" color="$orange10" />;

    return (
        <YStack flex={1} style={{backgroundColor: "white", padding: 16}} >
            {/* Título del Chat */}
            <Text fontSize="$6" fontWeight="bold" style={{marginBottom: 8,textAlign:"center"}} >
                {name || "Chat"}
            </Text>

            {/* Área de Mensajes (Burbujas) */}
            <ScrollView 
                ref={scrollViewRef}
                flex={1}
                contentContainerStyle={{ paddingBlockEnd: 20 }}
            >
                <YStack space="$3">
                    {messages.map((msg: any, i: number) => {
                        const isMe = msg.sender === myUser;
                        return (
                            <XStack key={i} style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                <YStack
                                    style={{
                                    backgroundColor: isMe ? '$orange9' : '$gray4', padding: 8, borderRadius: 16, maxWidth: "80%" }}
                                >
                                    {!isMe && <Text fontSize={10} style={{ color: "$gray11" }}>{msg.sender}</Text>}
                                    <Paragraph color={isMe ? 'white' : 'black'}>{msg.content}</Paragraph>
                                </YStack>
                            </XStack>
                        );
                    })}
                </YStack>
            </ScrollView>

            {/* Input para Escribir */}
            <XStack borderTopWidth={1} style={{ borderColor: "$gray4", paddingTop: 8 }}>
                <Input 
                    flex={1} 
                    value={text} 
                    onChangeText={setText} 
                    placeholder="Escribe un mensaje..." 
                />
                <Button onPress={sendMessage} style={{ backgroundColor: "$orange10", color: "white" }}>
                    Enviar
                </Button>
            </XStack>
        </YStack>
    );
}