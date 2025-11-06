import ChatPreview from '../components/ChatPreview';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, YStack } from 'tamagui';



const Chats = () => {
    // Datos de ejemplo para las vistas previas de chat
    return (
        <View style={{ backgroundColor: '#e6e3e3ff' }}>
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

export default Chats;