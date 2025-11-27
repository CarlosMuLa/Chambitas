import React, { useState, useRef, useEffect, use } from 'react';
import { useRoute } from '@react-navigation/native';
import { YStack, XStack, Input, Button, ScrollView, Text, Spinner, Paragraph, Avatar, getToken } from 'tamagui';
import { useGetMessages, useChatSubscription } from '../api/messagesServices';
import { useCurrentUser } from '../hooks/currentUser';
import { generateClient } from 'aws-amplify/api';
import { useSendMessage } from '../api/messagesServices';
import { useChatSubscriptionManual } from '../api/sockets';
import { RootStackParamList } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';

type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;


// Definir la mutación de envío aquí o importarla si la tienes en services
const client = generateClient();


export default function ChatDetailScreen() {
    const route = useRoute<ChatDetailRouteProp>();
    const { conversationId, name } = route.params;

    console.log("🔍 ChatDetail cargado con conversationId:", conversationId);
    console.log("🔍 ChatDetail cargado con name:", name);
    
    
    const user = useCurrentUser();
    const myUser = user?.username || "Invitado";
    const [text, setText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    if (!conversationId) {
        return (
            <YStack flex={1} style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
                <Text style={{ color: "red", fontSize: 18, marginBottom: 8 }}>
                    ❌ Error: No se proporcionó ID de conversación
                </Text>
                <Text style={{ color: "gray" }}>
                    Por favor, regresa y selecciona un chat válido.
                </Text>
            </YStack>
        );
    }

    // 2. Lógica de carga y suscripción (Lo que tenías, pero ahora con ID real)
    const { data, isLoading, error } = useGetMessages(conversationId);
    useChatSubscriptionManual(conversationId);
    console.log("🔄 Suscripción iniciada para conversationId:", conversationId);

    const sendMessageMutation = useSendMessage(conversationId, text, myUser);

    const handleSendMessage = async () => {
        if (text.trim() === "") return;
        try {
            await sendMessageMutation.mutateAsync();
            setText("");
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    // Auto-scroll al final
    const messages = data || [];
    useEffect(() => {
        if (messages.length) {
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    if(error) {
        return (
            <YStack flex={1} style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
                <Text style={{ color: "red", fontSize: 18 }}>Error al cargar mensajes</Text>
                <Text style={{ color: "gray", marginTop: 8 }}>
                    {error instanceof Error ? error.message : 'Error desconocido'}
                </Text>
            </YStack>
        );
    }

    // ELIMINADO: El return temprano que ocultaba el header
    // if (isLoading) return <Spinner size="large" color="$orange10" />;

    return (
        <YStack flex={1} style={{backgroundColor: "white", padding: 16}} >
            {/* Título del Chat */}
            <Text fontSize="$6" fontWeight="bold" style={{marginBottom: 8,textAlign:"center"}} >
                {name || "Chat"}
            </Text>

            {/* Área de Contenido (Carga, Vacío o Mensajes) */}
            {isLoading ? (
                <YStack  style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Spinner size="large" color="orange" />
                    <Text style={{color: "gray", marginTop: 8}}>Cargando mensajes...</Text>
                </YStack>
            ) : messages.length === 0 ? (
                <YStack style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "gray", fontSize: 16}}>No hay mensajes aún.</Text>
                    <Text style={{color: "gray", fontSize: 12}}>¡Sé el primero en escribir!</Text>
                </YStack>
            ) : (
                <ScrollView 
                    ref={scrollViewRef}
                    flex={1}
                    contentContainerStyle={{ flex: 1, paddingBlockEnd: 20 }}
                >
                    <YStack style={{ gap: 12, padding: 8 }}>
                        {messages.map((msg: any, i: number) => {
                            const isMe = msg.sender === myUser;
                            return (
                                <XStack 
                                    key={i} 
                                    style={{ justifyContent: isMe ? 'flex-end' : 'flex-start', paddingHorizontal: 4 }}
                                >
                                    <YStack
                                    style={{
                                        backgroundColor: isMe ? 'orange' : 'gray',
                                        padding: 12,
                                        borderRadius: 16,
                                        // Estilo extra para dar forma de burbuja de chat
                                        borderBottomRightRadius: isMe ? 0 : 16,
                                        borderBottomLeftRadius: isMe ? 16 : 0,
                                        maxWidth: "80%"}}
                                    >
                                        {!isMe && (
                                            <Text  style={{fontSize: 10, color: "gray", marginBottom: 4}}>
                                                {msg.sender}
                                            </Text>
                                        )}
                                        <Paragraph color={isMe ? 'white' : 'black'}>
                                            {msg.content}
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                            );
                        })}
                    </YStack>
                </ScrollView>
            )}

            {/* Input para Escribir */}
            <XStack borderTopWidth={1} style={{ borderColor: "gray", paddingTop: 8 }}>
                <Input 
                    flex={1} 
                    value={text} 
                    onChangeText={setText} 
                    placeholder="Escribe un mensaje..." 
                    style={{ backgroundColor: "gray", borderRadius: 20 , marginRight: 8}}
                />
                <Button onPress={handleSendMessage} style = {{backgroundColor:"orange", color:"white"}}>
                    Enviar
                </Button>
            </XStack>
        </YStack>
    );
}