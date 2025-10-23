import {Card, CardBackground } from 'tamagui';
import { H2, Text, Button, Paragraph, Image } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';

type OfferProps = RootStackScreenProps<'OfferDetails'>;

export function Offer({title, timeStamp, imageUrl}: {title:string, timeStamp:number, imageUrl:string}) {
    const navigation = useNavigation<OfferProps['navigation']>();

    const handleCardPress = () => {
        navigation.navigate('OfferDetails', { title: title, timeStamp: timeStamp, imageUrl: imageUrl });
    }

    return (
        <Card animation={"bouncy"} hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }} width={300} margin={10} borderRadius={12} overflow="hidden" elevation="$8" onPress={handleCardPress}>
            <Card.Header padded>
                <H2>{title}</H2>
                <Paragraph>Publicado hace {timeStamp} horas</Paragraph>
            </Card.Header>
            <Card.Footer padded>
                <Button hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }}>Chambear</Button>
            </Card.Footer>
            <Card.Background>
                <Image
                    objectFit="contain"
                    source=
                    {{ 
                        width:300,
                        height:300,
                        uri: imageUrl,
                    }}
                    style=
                    {{ 
                        width: '100%', height: 200, borderRadius: 12
                    }}
                />
            </Card.Background>
        </Card>
    )
}

export default Offer;