import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { YStack, Text, Avatar, XStack, Spinner, H2 } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useMyConversations } from '../api/messagesServices';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ChatsListScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { data: conversations, isLoading } = useMyConversations();

  if (isLoading) {
    return <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Spinner size="large" color="$orange10"/></YStack>;
  }

  return (
    <YStack style={{ flex: 1, backgroundColor: "$background", padding: 16 }}>
      <H2 style={{ marginBottom: 16 }}>Mis Mensajes</H2>
      
      <ScrollView>
        <YStack gap="$3">
          {conversations && conversations.length > 0 && conversations.map((chat: any) => (
    <TouchableOpacity 
      key={chat.id}
      onPress={() => navigation.navigate('ChatDetail', { 
        conversationId: chat.id,
        name: chat.name || 'Usuario'
      })}
    >
              <XStack style={{ backgroundColor: "white", padding: 16, borderRadius: 8, gap: 12, alignItems: "center", elevation: 2 }}>
                <Avatar circular size="$4">
                  <Avatar.Image source={{ uri: 'https://via.placeholder.com/100' }} />
                  <Avatar.Fallback  style={{ backgroundColor: "$gray5" }} />
                </Avatar>
                
                <YStack flex={1}>
                  <XStack style={{ justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{chat.name || "Chat sin nombre"}</Text>
                    <Text style={{ color: "$gray10", fontSize: 12 }}>
                      {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </Text>
                  </XStack>
                  
                  <Text style={{ color: "$gray11" }} numberOfLines={1}>
                    {chat.lastMessage || "Haz clic para escribir..."}
                  </Text>
                </YStack>
              </XStack>
            </TouchableOpacity>
          ))}

          {(!conversations || conversations.length === 0) && (
            <YStack flex={1} style={{ justifyContent: "center", alignItems: "center", marginTop: 40 }}>
        <Text style={{ color: "$gray10", textAlign: "center" }}>
            No tienes conversaciones aún.
        </Text>
        <Text style={{ color: "$gray8", fontSize: 12, textAlign: "center", marginTop: 8 }}>
            (O quizás necesitas iniciar sesión de nuevo para refrescar tu ID)
        </Text>
    </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default ChatsListScreen;