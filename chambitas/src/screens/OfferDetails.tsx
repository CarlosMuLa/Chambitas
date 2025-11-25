 import { H1, Text, Button, Paragraph, Image, Card, YStack, XStack} from 'tamagui';
 import React from 'react';
 import { useNavigation } from '@react-navigation/native';
 import { RootStackScreenProps } from '../navigation/types';
 import { usePosts } from '../api/postsService';

 type OfferProps = RootStackScreenProps<'MakingOffer'>;



const OfferDetails = ({ route }: { route: any }) => {
    const { id } = route.params;
    const { data: post } = usePosts({ id });

    if (!post || post.length === 0) {
        return <Text>No se encontró la oferta.</Text>;
    }
    const { title, thumbnail: imageUrl, created_at } = post[0];

    const calculateHoursAgo = (dateString: string) => {
        const created = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return Math.max(diffHours, 0); 
    }
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
            <Paragraph>Publicado hace {calculateHoursAgo(created_at)} horas</Paragraph>
            <Paragraph>Aquí van más detalles sobre la oferta de trabajo. Descripción, requisitos, beneficios, etc.</Paragraph>
            <Button hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }} onPress={handleMakeOffer}>Postularse</Button>
        </YStack>
        
    );
};

export default OfferDetails;