
import React from 'react';
import { Card, Avatar, Text } from 'tamagui';

export function ChatPreview({ name, lastMessage, timeStamp, avatarUrl }: { name: string; lastMessage: string; timeStamp: string; avatarUrl: string }) {
    return (
        <Card width={300} height={150}>
            <Card.Header padded>
                <Avatar circular size = "$10" >
                <Avatar.Image  accessibilityLabel={name} source={{ uri: avatarUrl }} />
                <Avatar.Fallback backgroundColor="$blue10">{name.charAt(0)}</Avatar.Fallback>
                </Avatar>
                <Text fontWeight="bold" fontSize={16}>
                    {name}
                </Text>
                <Text fontSize={12} color="gray">
                    {timeStamp}
                </Text>
            </Card.Header>
            <Card.Footer padded>
                <Text numberOfLines={2} ellipsizeMode="tail">
                    {lastMessage}
                </Text>
            </Card.Footer>
        </Card>
    );
}


export default ChatPreview;
