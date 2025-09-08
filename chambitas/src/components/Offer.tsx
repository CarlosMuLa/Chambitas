import {Card, CardBackground } from 'tamagui';
import { H2, Text, Button, Paragraph, Image } from 'tamagui';



export function Offer() {
    return (
        <Card>
            <Card.Header padded>
                <H2>Arreglar Fugas de Agua</H2>
                <Paragraph>Publicado hace 2 horas</Paragraph>
            </Card.Header>
            <Card.Footer padded>
                <Button>Chambear</Button>
            </Card.Footer>
            <Card.Background>
                <Image
                    objectFit="contain"
                    alignSelf="center"
                    source=
                    {{ 
                        width:300,
                        height:300,
                        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    }}
                />
            </Card.Background>
        </Card>
    )
}

export default Offer;