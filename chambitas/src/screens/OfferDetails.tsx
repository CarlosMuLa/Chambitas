import { H1, Text, Button, Paragraph, Image, Card, YStack, XStack, Spinner } from 'tamagui';
import { ChevronLeft, ChevronRight, Star } from '@tamagui/lucide-icons'; // 1. Importamos los iconos
import React, { useState, useRef } from 'react'; // 2. Importamos useRef
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { usePosts, useGetReviewsByOfferId } from '../api/postsService';
import { Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions } from 'react-native';
import { useCurrentUser } from '../hooks/currentUser';

type OfferProps = RootStackScreenProps<'MakingOffer'>;


const OfferDetails = ({ route }: { route: any }) => {
    const { width } = useWindowDimensions(); 
    const user = useCurrentUser();
    const { id } = route.params;
    const { data: post, isLoading } = usePosts({ id });
    const { data: reviews } = useGetReviewsByOfferId({ offer_id: id });

    const avgRating = reviews?.avg_rating ? parseFloat(reviews.avg_rating) : 0;
    console.log("REVIEWS RECIBIDAS:", JSON.stringify(avgRating, null, 2));
    
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null); // 3. Referencia al ScrollView
    const navigation = useNavigation<OfferProps['navigation']>();
    const postSub = post && post.length > 0 ? post[0].cognito_sub : null;

    if (isLoading) {
        return (
            <YStack style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="large" color="orange" />
            </YStack>
        );
    }

    console.log("DETALLES DE LA OFERTA RECIBIDA:", JSON.stringify(post, null, 2));

    if (!post || post.length === 0) {
        return <Text>No se encontró la oferta.</Text>;
    }
    
    const { title, thumbnail: imageUrl, created_at, image1, image2, price, city_name, category_name, description, cognito_sub } = post[0];

    const carouselImages = [imageUrl, image1, image2].filter(img => img);

    const calculateHoursAgo = (dateString: string) => {
        const created = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return Math.max(diffHours, 0); 
    }

    const handleMakeOffer = () => {
        navigation.navigate('MakingOffer', { id: route.params.id, sub: postSub, title: title });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    // 4. Funciones para los botones
    const handleNext = () => {
        if (activeIndex < carouselImages.length - 1) {
            scrollViewRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            scrollViewRef.current?.scrollTo({ x: (activeIndex - 1) * width, animated: true });
        }
    };

    return (
        <YStack style={{ flex: 1 , backgroundColor: "$background"}}>
            {/* 3. Carrusel de Imágenes */}
            <YStack height={300} position="relative">
                <ScrollView
                    ref={scrollViewRef} // Conectamos la referencia
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    // Aseguramos que el scroll funcione definiendo tamaños explícitos
                    style={{ width: width, height: 300 }}
                    contentContainerStyle={{ width: width * carouselImages.length }}
                >
                    {carouselImages.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img }}
                            width={width}
                            height={100 + '%'}
                            objectFit="cover"
                        />
                    ))}
                </ScrollView>
                
                {/* 5. Botones de Navegación (Flechas) */}
                {activeIndex > 0 && (
                    <Button
                        position="absolute"
                        style={{ left: 10 , top :150, backgroundColor: "rgba(0,0,0,0.5)", zIndex:10}}
                        y={-20} // Ajuste para centrar verticalmente
                        circular
                        size="$3"
                        icon={ChevronLeft}
                        onPress={handlePrev}
                        color="white"
                        chromeless // Quita bordes extraños
                    />
                )}

                {activeIndex < carouselImages.length - 1 && (
                    <Button
                        position="absolute"
                        style={{ right: 10 , top :150, backgroundColor: "rgba(0,0,0,0.5)", zIndex:10}}
                        y={-20}
                        circular
                        size="$3"
                        icon={ChevronRight}
                        onPress={handleNext}
                        color="white"
                        chromeless
                    />
                )}

                {/* 4. Indicadores (Puntos) */}
                <XStack 
                    position="absolute" 
                    style={{ bottom: 15, alignSelf: 'center', backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal:10, paddingVertical:5, borderRadius:20 }}
                    gap="$2"
                >
                    {carouselImages.map((_, index) => (
                        <YStack
                            key={index}
                            width={8}
                            height={8}
                            style={{ borderRadius: 4, backgroundColor: index === activeIndex ? 'white' : 'rgba(255,255,255,0.5)' }}
                        />
                    ))}
                </XStack>
            </YStack>

            <YStack style={{ padding: 16 }} gap="$3">
                <H1>{title}</H1>
                <XStack style = {{alignItems: "center", gap: "$2"}}>
                    <XStack gap="$1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                size={30} 
                                // Rellenamos si el promedio es mayor o igual a la estrella actual
                                fill={star <= Math.round(avgRating) ? "#FFD700" : "transparent"} 
                                color={star <= Math.round(avgRating) ? "#FFD700" : "gray"} 
                            />
                        ))}
                    </XStack>
                    <Paragraph size="$3" color="gray" fontWeight="bold">
                        {avgRating > 0 ? avgRating.toFixed(1) : "Sin calificaciones"}
                    </Paragraph>
                </XStack>
                <XStack gap="$3" style={{ alignItems: "center" , flexWrap: "wrap", paddingEnd: 100}}>
                    <Paragraph style={{ color: "$gray10", fontSize: 20 }} >📍 {city_name}</Paragraph>
                    <Paragraph style={{ color: "$gray10", fontSize: 20 }}>🏷️ {category_name}</Paragraph>
                    <Paragraph style={{ color: "green", fontSize: 20 , fontWeight: "bold"}}>💲{price} 🇲🇽</Paragraph>
                </XStack>

                <Paragraph style={{ color: "$gray10" }}>Publicado hace {calculateHoursAgo(created_at)} horas</Paragraph>
                
                <Paragraph size="$4" lineHeight="$5">
                    {description || "Aquí van más detalles sobre la oferta de trabajo. Descripción, requisitos, beneficios, etc."}
                </Paragraph>
                {user?.sub !== cognito_sub && (
                <Button 
                    style={{ marginTop: 16 }} 
                    hoverStyle={{ scale: 1.02 }} 
                    pressStyle={{ scale: 0.98 }} 
                    onPress={handleMakeOffer}
                >
                    Postularse
                </Button>
                )}
            </YStack>
        </YStack>
    );
};

export default OfferDetails;