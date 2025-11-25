import React from "react";
import { View, Text, StyleSheet, TextInput, Animated } from "react-native";
import { ScrollView, XStack, YStack, Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import {Offer} from "../components/Offer";
import SearchBar from "../components/SearchBar";
import { usePosts } from "../api/postsService";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateOffer'>;
const Home = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const {data: posts, isLoading, error} = usePosts();
    console.log("DATOS RECIBIDOS EN HOME:", JSON.stringify(posts, null, 2));

    
        const calculateHoursAgo = (dateString: string) => {
            const created = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - created.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            return Math.max(diffHours, 0); 
        };

    return (
        <YStack style={{flex:1}}>
            <SearchBar />
        <ScrollView>
        <XStack $maxMd={{ flexDirection: 'column' }} style={{ marginTop: 10, justifyContent: 'space-around', padding: 10 }}>{/* 4. Mapeo Dinámico */}
                    {posts?.map((post: any) => (
                        <Offer 
                            key={post.offer_id} // Usamos el ID único de la BD
                            title={post.title} 
                            // Calculamos las horas o enviamos 0 si no hay fecha
                            timeStamp={post.created_at ? calculateHoursAgo(post.created_at) : 0} 
                            imageUrl={post.thumbnail || "https://via.placeholder.com/300"} // Imagen por defecto si no hay
                        />
                    ))}
                    
                    {/* Mensaje si no hay posts */}
                    {!isLoading && posts?.length === 0 && (
                        <Text style={{textAlign: "center", marginTop: 16}}>No hay ofertas disponibles aún.</Text>
                    )}
        </XStack>
        </ScrollView>
        <Button circular
            size="$6"
            icon ={Plus}
            theme="accent"
            elevation="$4"
            position ="absolute"
            style={{ right: 20, bottom: insets.bottom + 20 }}
            onPress={() => navigation.navigate('CreateOffer')}
        />
        </YStack>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default Home;
