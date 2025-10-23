 import { H1, Text, Button, Paragraph, Image, Card, YStack, XStack} from 'tamagui';
 import React from 'react';


const OfferDetails = ({ route }: { route: any }) => {
    const { title, timeStamp, imageUrl } = route.params;

    return (
        <YStack>
            <Image
                objectFit="contain"
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: 200, borderRadius: 12 }}
            />
        </YStack>
        
    );
};

export default OfferDetails;