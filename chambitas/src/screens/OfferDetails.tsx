 import { H1, Text, Button, Paragraph, Image, Card, YStack, XStack} from 'tamagui';
 import React from 'react';
 import { useNavigation } from '@react-navigation/native';
 import { RootStackScreenProps } from '../navigation/types';

 type OfferProps = RootStackScreenProps<'MakingOffer'>;



const OfferDetails = ({ route }: { route: any }) => {
    const { id,title, timeStamp, imageUrl } = route.params;
    const navigation = useNavigation<OfferProps['navigation']>();

    const handleMakeOffer = () => {
        navigation.navigate('MakingOffer', { id: route.params.id });
    };

    return (
        <YStack>
            <Image
                objectFit="contain"
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: 200, borderRadius: 12 }}
            />
            <H1>{title}</H1>
            <Paragraph>Publicado hace {timeStamp} horas</Paragraph>
            <Paragraph>Aquí van más detalles sobre la oferta de trabajo. Descripción, requisitos, beneficios, etc.</Paragraph>
            <Button hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }} onPress={handleMakeOffer}>Postularse</Button>
        </YStack>
        
    );
};

export default OfferDetails;