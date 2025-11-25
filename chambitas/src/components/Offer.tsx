import {Card } from 'tamagui';
import { H2, Text, Button, Paragraph, Image,XStack,Label } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';

type OfferProps = RootStackScreenProps<'OfferDetails'>;

export function Offer({id,title, timeStamp, imageUrl,price}: Readonly<{id:string, title:string, timeStamp:number, imageUrl:string, price:string}>) {
    const navigation = useNavigation<OfferProps['navigation']>();

    const handleCardPress = () => {
        navigation.navigate('OfferDetails', { id:id });
    }

    return (
        <Card animation={"bouncy"} hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }} width={300} margin={10} borderRadius={12} overflow="hidden" elevation="$8" onPress={handleCardPress}>
            <Card.Header padded>
                <H2>{title}</H2>
                <Paragraph style={{ fontStyle: "italic", fontSize: 14, fontWeight:"bolder" }}>Publicado hace {timeStamp} horas</Paragraph>
            </Card.Header>
            <Card.Footer padded>
                <XStack style={{justifyContent: "flex-end"}}>
                <Button hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }}>Chambear</Button>
                <Text style={{ marginLeft: 10 , fontSize: 16, fontWeight: "bold" , color:"green", fontFamily: "Arial", paddingTop: 18}}> {price} </Text>
                </XStack>
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