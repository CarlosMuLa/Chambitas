import React from 'react';
import { H1, Text, Button, Paragraph, Image, Card, YStack, XStack, TextArea} from 'tamagui';


const MakingOffer = ({route}: {route: any}) => {
    const {id} = route.params;
    return (
        <YStack style={{ alignItems: 'center', padding: 20 }}>
            <H1 style = {{marginEnd: 10, fontSize: 32, marginTop: 40}}>Haciendo oferta para el trabajo {id}</H1>
            <TextArea 
            style = {{ height: 150, width: '45%', marginBottom: 20, marginTop: 20 }}
            placeholder="Aquí puedes detallar tu oferta, incluyendo salario, beneficios y otros detalles relevantes." />
            <Button size='$5' style={{ marginTop: 20 }} hoverStyle={{ scale: 1.02 }} pressStyle={{ scale: 0.98 }}>Enviar Oferta</Button>
        </YStack>
    );
};

export default MakingOffer;