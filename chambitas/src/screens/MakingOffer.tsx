import React from 'react';
import { H1, Text, Button, YStack, TextArea, Label, ScrollView, XStack } from 'tamagui';
import { MyCalendar } from '../components/Calendar';

const MakingOffer = ({ route }: { route: any }) => {
    const { id } = route.params;

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <YStack flex={1}  style={{ padding: 16 }} gap="$5">
                
                {/* Encabezado */}
                <YStack style={{ marginTop: 16 }}>
                    <H1 size="$8" style={{ textAlign: 'center' }}>Hacer una Oferta</H1>
                    <Text style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>
                        Trabajo ID: {id}
                    </Text>
                </YStack>

                {/* Contenedor Horizontal para Texto y Calendario */}
                <XStack gap="$4" flexWrap="wrap"> {/* flexWrap ayuda en pantallas muy pequeñas */}
                    
                    {/* Columna Izquierda: Descripción */}
                    <YStack style={{ flex: 1, minWidth: 300 }} gap="$2">
                        <Label fontSize="$5" fontWeight="bold">Detalles de tu propuesta:</Label>
                        <TextArea 
                            size="$4"
                            height={350} // Aumenté la altura para igualar al calendario visualmente
                            placeholder="Describe tu oferta, incluyendo salario, beneficios y por qué eres el indicado..."
                            style={{ borderWidth: 1 , borderColor: "$gray8" }} 
                            focusStyle={{ borderColor: "$blue10" }}
                        />
                    </YStack>

                    {/* Columna Derecha: Calendario */}
                    <YStack style={{ flex: 1, minWidth: 300 }} gap="$2">
                        <Label fontSize="$5" fontWeight="bold">Fecha de inicio propuesta:</Label>
                        <YStack 
                            borderWidth={1} 
                            style={{borderColor: "#gray8", borderRadius:20, padding: 8}}
                            overflow="hidden"
                            height={350} // Altura fija para consistencia
                        >
                            <MyCalendar />
                        </YStack>
                    </YStack>

                </XStack>

                {/* Botón de Acción */}
                <Button 
                    size="$5" 
                    style={{ marginTop: 8 }} 
                    hoverStyle={{ scale: 1.02 }} 
                    pressStyle={{ scale: 0.98 }}
                >
                    Enviar Oferta
                </Button>

            </YStack>
        </ScrollView>
    );
};

export default MakingOffer;