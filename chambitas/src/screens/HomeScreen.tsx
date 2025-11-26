import React, {useState } from "react";
import { View, Text, StyleSheet, TextInput, Animated } from "react-native";
import { ScrollView, XStack, YStack, Button, Spinner } from "tamagui";
import { Plus, X } from "@tamagui/lucide-icons";
import {Offer} from "../components/Offer";
import SearchBar from "../components/SearchBar";
import { usePosts } from "../api/postsService";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useDebounce } from "../hooks/useDebounce";
import DropDownSelect from "../components/DropDownSelect";
import { useCurrentUser } from "../hooks/currentUser";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateOffer'>;
const Home = () => {
    const userType = useCurrentUser()?.type;
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const categories = [
        { label: 'Seleccionar categoría', value: '' },
        { label: 'Plomeria', value: '1' },
        { label: 'Jardineria', value: '2'},
        { label: 'Electricista', value: '3' },
        { label: 'Limpieza', value: '4' }
    ];
    const [selectedCategory, setSelectedCategory] = useState(categories[0].label);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const {data: posts, isLoading, error} = usePosts({ search: debouncedSearchQuery, category: selectedCategory ? parseInt(selectedCategory) : undefined });
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
            <XStack style={{padding: 12, gap: 8, alignItems: "center"}}>
                <YStack flex={1}>
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                </YStack>
                <DropDownSelect
                    items={categories}
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    placeholder="Filtro"
                    width={140}
                />
            </XStack>
        <ScrollView>
        {/* Contenedor principal para la cuadrícula de ofertas */}
        {isLoading  && (
            <YStack style={{ padding:20, alignItems: "center"}}>
                <Spinner size="large" color="orange"/>
            </YStack>
        )}
        {error && (
            <YStack style={{ padding:20, alignItems: "center"}}>
                        <Text style={{ color: "red" }}>Error al cargar ofertas</Text>
                    </YStack>
        )}
        <YStack style={{ padding:10}}>
            {/* Usamos flexWrap para crear una cuadrícula que se ajusta automáticamente */}
            {/* CAMBIO: justifyContent="center" para equilibrar los márgenes izquierdo y derecho */}
            <XStack style={{flexWrap: "wrap", gap: "$3", justifyContent: "center"}}>
                {Array.isArray(posts) ? (
                posts?.map((post: any) => (
                    <Offer 
                        key={post.offer_id}
                        id={post.offer_id}
                        title={post.title} 
                        timeStamp={post.created_at ? calculateHoursAgo(post.created_at) : 0} 
                        imageUrl={post.thumbnail || "https://via.placeholder.com/300"}
                        price={post.price.toString()}
                    />
                ))
            ):(
                !isLoading && <Text>No hay ofertas disponibles.</Text>
            )}
            </XStack>
            
            {/* Mensaje si no hay posts */}
            {!isLoading && Array.isArray(posts) && posts.length === 0 && (
                <Text style={{textAlign: "center", marginTop: 16}}>No hay ofertas que coincidan con "{debouncedSearchQuery}".</Text>
            )}
        </YStack>
        </ScrollView>
        {userType === "2" && (
        <Button circular
            size="$6"
            icon ={Plus}
            theme="accent"
            elevation="$4"
            position ="absolute"
            style={{ right: 20, bottom: insets.bottom + 20 }}
            onPress={() => navigation.navigate('CreateOffer')}
        />
        )}
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
