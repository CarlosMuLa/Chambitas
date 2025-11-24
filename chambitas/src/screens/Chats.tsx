import ChatPreview from '../components/ChatPreview';
import React, { useState, useEffect, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, YStack } from 'tamagui';
import { useGetMessages } from '../api/messagesServices';
import { useChatSubscription } from '../api/messagesServices';
import { useCurrentUser } from '../hooks/currentUser';


export default function Chats() {
    const myUser = useCurrentUser();
    const myUserName = myUser?.username || "Invitado"; 
    const myUserId = myUser?.sub;
    const { data, isLoading } = useGetMessages(conversationId);
    useChatSubscription(conversationId);
    const messages = data ? data.getMessages : [];
    // Datos de ejemplo para las vistas previas de chat
    return (
        <View >
            <ScrollView>
                <YStack>
                    <ChatPreview
                        name="Juan Perez"
                        lastMessage="Hola, ¿cómo estás?"
                        timeStamp="10:30 AM"
                        avatarUrl="https://randomuser.me/api/portraits/men/1.jpg"
                    />
                    <ChatPreview
                        name="Maria Lopez"
                        lastMessage="¿Cuándo nos vemos?"
                        timeStamp="9:15 AM"
                        avatarUrl="https://randomuser.me/api/portraits/women/2.jpg"
                    />
                    </YStack>
                    </ScrollView>
                    </View>)};

