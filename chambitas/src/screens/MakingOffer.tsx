import React, { useState } from 'react'; // Agrupé los imports
import { H1, Text, Button, YStack, TextArea, Label, ScrollView, XStack, AlertDialog, Spinner } from 'tamagui';
import { MyCalendar } from '../components/Calendar';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from '../hooks/currentUser';
import { useCreateConversation } from '../api/messagesServices';
import { usePosts, createOrder, useGetOrdersById } from '../api/postsService';

const MakingOffer = ({ route }: { route: any }) => {
    const { id, sub, title } = route.params;
    
    // 1. TODOS LOS HOOKS PRIMERO
    const user = useCurrentUser();
    const navigation = useNavigation();
    const { data: post, isLoading } = usePosts({ id });
    const { data: orders, isLoading: ordersLoading } = useGetOrdersById({ offer_id: id });
    console.log("ORDENES RECIBIDAS:", JSON.stringify(orders, null, 2));

    // Preparar datos derivados de forma segura (fallback a valores vacíos si no ha cargado)
    const currentPost = post?.[0];
    const participants = (currentPost && user) ? [currentPost.sub, user.sub] : [];
    console.log("PARTICIPANTES PARA LA CONVERSACIÓN:", participants);
    const chatname = currentPost ? `${currentPost.title} + ${id}` : '';

    // Los hooks deben ejecutarse SIEMPRE, incluso si está cargando
    const createConversationMutation = useCreateConversation(participants, chatname);
    const createOrderMutation = createOrder();

    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
    // Estados para controlar el flujo del pago
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // 2. AHORA SÍ, LOS RETURNS CONDICIONALES
    if (isLoading) {
        return (
            <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Spinner size="large" color="orange" />
            </YStack>
        );
    }

    if (!currentPost) {
        return (
            <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
                <Text style={{ textAlign: "center" }}>No se pudo cargar la información del trabajo. Intenta recargar.</Text>
            </YStack>
        );
    }

    // 3. LÓGICA DE LA FUNCIÓN
    const handleSendOffer = async () => {
        if(selectedDate === '') {
            alert("Por favor selecciona una fecha.");
            return;
        }
        try {
            // 1. Crear la orden
            const date = new Date(selectedDate);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            const startTime = date.toISOString();
            console.log("Fecha de inicio formateada:", startTime);
            
            const orderResponse = await createOrderMutation.mutateAsync({
                offer_id: id, 
                cognito_sub: user?.sub, 
                startTime: startTime, 
                price: currentPost.price, // Usar currentPost ya validado
                timeUnit: currentPost.time_unit
            });
            console.log("Orden creada:", orderResponse);
        } catch (error) {
            console.error("Error al crear la orden:", error);
            alert("Error al enviar la oferta. Por favor, intenta de nuevo.");
            return;
        }
        try{
            // 2. Crear la conversación
            const conversationResponse = await createConversationMutation.mutateAsync();
            console.log("Conversación creada:", conversationResponse);
        }
        catch(error){
            console.error("Error al crear la conversación:", error);
            alert("Error al enviar la oferta. Por favor, intenta de nuevo.");
            return;
        }
        console.log("se creo la conversacion");
    };


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
                            <MyCalendar onDateSelect={setSelectedDate} />
                        </YStack>
                    </YStack>

                </XStack>

                {/* Botón de Acción */}
                <AlertDialog native>
                    <AlertDialog.Trigger asChild>
                <Button 
                    size="$5" 
                    style={{ marginTop: 8 }} 
                    hoverStyle={{ scale: 1.02 }} 
                    pressStyle={{ scale: 0.98 }}
                >
                    Enviar Oferta
                </Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <AlertDialog.Title>Enviar Oferta a {currentPost.user_name}</AlertDialog.Title>
            <AlertDialog.Description>
                <YStack>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>¿Estás seguro de que deseas enviar esta oferta para el trabajo "{title}"?</Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>💸{currentPost.price} 🇲🇽</Text>
                <Text style={{ marginTop: 8 , textAlign: 'center' }}>Una vez enviada, se creará una conversación con el empleador para discutir los detalles.</Text>
                </YStack>

            </AlertDialog.Description>

            <XStack gap="$3" style={{ justifyContent: 'flex-end' }}>
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="accent" onPress={handleSendOffer}>Accept</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>

            </YStack>
        </ScrollView>
    );
};

export default MakingOffer;