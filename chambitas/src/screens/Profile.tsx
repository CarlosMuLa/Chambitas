import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
// 1. Agregamos TextArea a los imports de Tamagui
import { Button, YStack , XStack, Spinner, Tabs, SizableText, Separator, H5, Paragraph, AlertDialog, TextArea } from "tamagui"; 
// 2. Agregamos Star a los iconos
import { LogOut, Star } from "@tamagui/lucide-icons";
import Offer from "../components/Offer";
import { useCurrentUser } from "../hooks/currentUser";
import { useAuth } from "../context/AuthContext";
import { useGetOrdersById, usePosts, useSubmitReview } from "../api/postsService";
// import { useGetOrders } from "../api/postsService"; // Descomenta cuando tengas el hook listo


const ProfileScreen = ({route}: {route: any}) => {
    
    const { signOut } = useAuth();
    const currentUser = useCurrentUser();
    let {username} = route.params || {};
    const me = useCurrentUser();
    
    // Lógica para determinar si es el perfil propio o de otro
    let other = false;
    let email = "";
    let picture = "";
    
    // Obtenemos el tipo de usuario. Asumimos que viene como string en custom attributes o number
    // Ajusta 'custom:type' según cómo lo guardes en Cognito (ej. 'custom:userType')
    const userType = parseInt(currentUser?.type || '1'); 

    

    if (username && username !== me?.username) {
        other = true;
    }
    else {
        email = me?.email || "No disponible";
        username = me?.username || "Invitado";
        picture = me?.picture || "";
    }

    const handleSignOut = () => {
        signOut();
    };

    const calculateHoursAgo = (dateString: string) => {
            const created = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - created.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            return Math.max(diffHours, 0); 
    };

    // Hook de Ofertas (Posts)
    const {data: posts, isLoading, error} = usePosts({ cognito_sub: currentUser?.sub });
    const { data: orders, isLoading: ordersLoading } = useGetOrdersById({ cognito_sub: currentUser?.sub });
    const submitReviewMutation = useSubmitReview();

    // 3. ESTADOS PARA LA CALIFICACIÓN
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // Función para abrir el modal de calificación
    const handleOpenRating = (order: any) => {
        setSelectedOrder(order);
        setRating(0);
        setComment("");
        setIsRatingOpen(true);
    };

    // Función para enviar la calificación
    const handleSubmitRating = () => {
        console.log("Enviando calificación:", {
            orderId: selectedOrder?.order_id,
            cognito_sub_client: currentUser?.sub || "",
            cognito_sub_provider: selectedOrder?.provider_sub || "",
            rating,
            comment,
            title_service: selectedOrder?.title_service || ""
        });
        submitReviewMutation.mutate({
            order_id: selectedOrder?.order_id,
            cognito_sub_client: currentUser?.sub || "",
            cognito_sub_provider: selectedOrder?.provider_sub || "",
            rating,
            comment,
            title_service: selectedOrder?.title_service || ""
        });

        setIsRatingOpen(false);

    };

    console.log("POSTS RECIBIDOS EN PERFIL:", JSON.stringify(posts, null, 2));
    console.log("ÓRDENES RECIBIDAS EN PERFIL:", JSON.stringify(orders, null, 2));
    
    
    // TODO: Hook de Órdenes (Descomenta y ajusta cuando tengas el servicio)
    // const { data: orders, isLoading: isLoadingOrders } = useGetOrders({ userId: currentUser?.sub });
    const isLoadingOrders = false; // Placeholder

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!other && (
                <XStack style={{width: "100%", justifyContent: "flex-end", marginBottom: 8}}>
                    <Button 
                        icon={LogOut} 
                        circular 
                        chromeless 
                        size="$4"
                        color="$red10"
                        onPress={handleSignOut}
                    />
                </XStack>
            )}
            <Image
                source={{ uri: picture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                style={styles.avatar}
            />
            <Text style={styles.name}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
            
            {!other && (
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
            )}

            {/* TABS DE TAMAGUI */}
            <YStack flex={1} width="100%">
                <Tabs
                    defaultValue={userType === 2 ? "ofertas" : "ordenes"}
                    orientation="horizontal"
                    flexDirection="column"
                    style={{ borderRadius: 8}}
                    borderWidth={0}
                    overflow="hidden"
                >
                    <Tabs.List separator={<Separator vertical />} disablePassBorderRadius="bottom" aria-label="Manage your account">
                        
                        {/* Pestaña de Ofertas: Solo visible si es Tipo 2 (Empleador) */}
                        {userType === 2 && (
                            <Tabs.Tab flex={1} value="ofertas" style={{ backgroundColor: "white" }}>
                                <SizableText fontFamily="$body">Mis Ofertas</SizableText>
                            </Tabs.Tab>
                        )}

                        {/* Pestaña de Órdenes: Visible para todos */}
                        <Tabs.Tab flex={1} value="ordenes" style={{ backgroundColor: "white" }}>
                            <SizableText fontFamily="$body">Mis Órdenes</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Separator />

                    {/* CONTENIDO: MIS OFERTAS (Solo Tipo 2) */}
                    {userType === 2 && (
                        <Tabs.Content value="ofertas">
                            <YStack style={{ padding: 16, alignItems: "center", minHeight: 200 }}>
                                {isLoading && <Spinner size="large" color="orange"/>}
                                
                                {error && <Text style={{ color: "red" }}>Error al cargar ofertas</Text>}

                                {!isLoading && !error && (
                                    <XStack style={{flexWrap: "wrap", gap: "$3", justifyContent: "center"}}>
                                        {Array.isArray(posts) && posts.length > 0 ? (
                                            posts.map((post: any) => (
                                                <Offer 
                                                    key={post.offer_id}
                                                    id={post.offer_id}
                                                    title={post.title} 
                                                    timeStamp={post.created_at ? calculateHoursAgo(post.created_at) : 0} 
                                                    imageUrl={post.thumbnail || "https://via.placeholder.com/300"}
                                                    price={post.price.toString()}
                                                />
                                            ))
                                        ) : (
                                            <Text style={{ marginTop: 20, color: "gray" }}>No has creado ofertas aún.</Text>
                                        )}
                                    </XStack>
                                )}
                            </YStack>
                        </Tabs.Content>
                    )}

                    {/* CONTENIDO: MIS ÓRDENES */}
                    <Tabs.Content value="ordenes">
                        <YStack style={{ padding: 16, minHeight: 200 }}>
                            {ordersLoading && <Spinner size="large" color="orange"/>}

                            {!ordersLoading && (
                                <YStack width="100%" gap="$3">
                                    {Array.isArray(orders) && orders.length > 0 ? (
                                        orders.map((order: any) => (
                                            <XStack 
                                                key={order.order_id} 
                                                style ={{ backgroundColor: "white", borderRadius: 16, padding: 12, gap: 12, shadowColor: "#000",
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 4,
                                                    elevation: 3,
                                                    alignItems: "center"
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <Image 
                                                    source={{ uri: order.offer_thumbnail || "https://via.placeholder.com/100" }} 
                                                    style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: "#f0f0f0" }}
                                                />
                                                
                                                {/* Info Principal */}
                                                <YStack flex={1} gap="$1">
                                                    <H5 fontSize="$5" fontWeight="bold" numberOfLines={1} style={{color: "$gray12"}}>
                                                        {order.offer_title}
                                                    </H5>
                                                    <Paragraph size="$2" style={{color: "$gray11"}} numberOfLines={1}>
                                                        Prov: {order.provider_name}
                                                    </Paragraph>
                                                    <XStack style = {{alignItems: "center", gap: 8, flexWrap: "wrap"}}>
                                                        <Paragraph size="$1" style={{color: "$gray10"}}>
                                                            📅 {new Date(order.start_time).toLocaleDateString()}
                                                        </Paragraph>
                                                        <Paragraph size="$1" style={{color: "$gray10"}}>
                                                            🕒 {new Date(order.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </Paragraph>
                                                        <Paragraph size="$1" style={{color: "$gray10"}}>
                                                            📍 {order.city_name}
                                                        </Paragraph>
                                                    </XStack>
                                                </YStack>

                                                {/* Precio y Estado */}
                                                <YStack style={{alignItems: "flex-end", gap: 8}}>
                                                    <Paragraph fontWeight="bold" style={{color: "green"}} size="$5">
                                                        💸{order.order_price}
                                                    </Paragraph>
                                                    
                                                    {/* Badge de Estado */}
                                                    <View style={{ 
                                                        backgroundColor: order.status_id === 2 ? "#dcfce7" : "#f3f4f6", 
                                                        paddingHorizontal: 8, 
                                                        paddingVertical: 4, 
                                                        borderRadius: 12 
                                                    }}>
                                                        <Text style={{ 
                                                            fontSize: 10, 
                                                            color: order.status_id === 2 ? "#166534" : "#374151",
                                                            fontWeight: "bold"
                                                        }}>
                                                            {order.status_id === 2 ? "ACTIVA" : "COMPLETADA"}
                                                        </Text>
                                                    </View>

                                                    {/* 4. BOTÓN MODIFICADO: Solo abre el estado, no contiene el Dialog */}
                                                    {order.status_id === 2 && (
                                                        <Button 
                                                            size="$2" 
                                                            style={{ backgroundColor: "#FA812F", borderRadius: 8 }}
                                                            onPress={() => handleOpenRating(order)}
                                                        >
                                                            <Text style={{ color: "white", fontSize: 12 }}>Calificar</Text>
                                                        </Button>
                                                    )}
                                                </YStack>
                                            </XStack>
                                        ))
                                    ) : (
                                        <YStack style={{alignItems: "center", marginTop: 20, gap: 8}}>
                                            <Paragraph size="$5" style={{color: "$gray10"}}>No tienes órdenes activas.</Paragraph>
                                            <Paragraph size="$3" style={{color: "$gray8"}}>¡Busca un servicio y contrátalo!</Paragraph>
                                        </YStack>
                                    )}
                                </YStack>
                            )}
                        </YStack>
                    </Tabs.Content>
                    
                </Tabs>
            </YStack>

            {/* 5. DIÁLOGO DE CALIFICACIÓN (Fuera del map) */}
            <AlertDialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
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
                            { opacity: { overshootClamping: true } },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        x={0}
                        scale={1}
                        opacity={1}
                        y={0}
                    >
                        <YStack gap="$4">
                            <AlertDialog.Title>Calificar Servicio</AlertDialog.Title>
                            <AlertDialog.Description>
                                <YStack gap="$2">
                                    <Paragraph size="$3" style={{color: "$gray11"}}>
                                        ¿Qué tal estuvo el servicio de {selectedOrder?.provider_name}?
                                    </Paragraph>
                                    
                                    {/* ESTRELLAS */}
                                    <XStack style={{justifyContent: "center", gap: 8, paddingVertical: 8}}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                                <Star 
                                                    size="$4" 
                                                    fill={star <= rating ? "#FFD700" : "transparent"}
                                                    color={star <= rating ? "#FFD700" : "gray"} 
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </XStack>

                                    {/* COMENTARIO */}
                                    <TextArea 
                                        placeholder="Escribe un comentario sobre tu experiencia..." 
                                        value={comment}
                                        onChangeText={setComment}
                                        numberOfLines={4}
                                        style={{ backgroundColor: "#e0e0e0", borderRadius: 8, padding: 8 }}
                                    />
                                </YStack>
                            </AlertDialog.Description>

                            <XStack gap="$3" style={{ justifyContent: "flex-end" }}>
                                <Button onPress={() => setIsRatingOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button 
                                    onPress={handleSubmitRating} 
                                    style={{ backgroundColor: "#FA812F", color: "white" }}
                                    disabled={rating === 0}
                                    opacity={rating === 0 ? 0.5 : 1}
                                >
                                    Enviar
                                </Button>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 24,
        paddingTop: 60,
        minHeight: "100%"
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#833636ff",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#833636ff",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 32,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileScreen;