import React from 'react';
import { Card, Avatar, Text, XStack, YStack } from 'tamagui';

export function ChatPreview({ name, lastMessage, timeStamp, avatarUrl }: { name: string; lastMessage: string; timeStamp: string; avatarUrl: string }) {
    return (
        <Card bordered p="$3" m="$2" pressStyle={{ backgroundColor: '$backgroundHover' }}>
            <XStack >
                <Avatar circular size="$5" padding="$2" marginRight="$3">
                    <Avatar.Image accessibilityLabel={name} source={{ uri: avatarUrl }} />
                    <Avatar.Fallback backgroundColor="$blue10">{name.charAt(0)}</Avatar.Fallback>
                </Avatar>

                <YStack flex={1}>
                        <Text fontWeight="bold" fontSize={16}>
                            {name}
                        </Text>
                        <Text fontSize={12} color="green">
                            {timeStamp}
                        </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" color="green">
                        {lastMessage}
                    </Text>
                </YStack>
            </XStack>
        </Card>
    );
}


export default ChatPreview;
