import ChatPreview from '../components/ChatPreview';
import React, { useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, YStack } from 'tamagui';
import { generateClient } from 'aws-amplify/api'

const client = generateClient();
    const GET_MESSAGES = `query GetMessages($conversationId: ID!) 
    {
        getMessages(conversationId: $conversationId) 
        {
            id
            content
            sender
        }
    }`;

    const OnNewMessage = `subscription OnNewMessage($conversationId: ID!)
    {
        onNewMessage(conversationId: $conversationId){
        id
        content
        sender
        }
    }`;


export default function Chats() {

    const [messages, setMessages] = useState([]);

    useEffect()
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

