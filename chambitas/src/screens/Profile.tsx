import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Button, YStack , XStack, Spinner} from "tamagui";
import { LogOut } from "@tamagui/lucide-icons";
import Offer from "../components/Offer";
import { useCurrentUser } from "../hooks/currentUser";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../api/postsService";


const ProfileScreen = ({route}: {route: any}) => {
    
    const { signOut } = useAuth();
    const currentUser = useCurrentUser();
    let {username} = route.params || {};
    const me = useCurrentUser();
    let other = false;
    let email = "";
    let picture = "";
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
    const {data: posts, isLoading, error} = usePosts({ cognito_sub: currentUser?.sub });
    console.log("DATOS RECIBIDOS EN PROFILE:", JSON.stringify(posts, null, 2));
    console.log("USUARIO ACTUAL EN PROFILE:", JSON.stringify(currentUser, null, 2));

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
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
            <Text style={styles.historyTitle}>Historial de ofertas</Text>
            <YStack style={{ padding:10}}>
                {isLoading && (
                    <YStack style={{ padding:20, alignItems: "center"}}>
                        <Spinner size="large" color="orange"/>
                    </YStack>
                )}
                {error && (
                    <YStack style={{ padding:20, alignItems: "center"}}>
                        <Text style={{ color: "red" }}>Error al cargar ofertas</Text>
                    </YStack>
                )}
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
                            <Text style={{textAlign: "center", marginTop: 16}}>No has creado ofertas.</Text>
                        )}
                    </YStack>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 24,
        paddingTop: 60,
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
    historyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        alignSelf: "flex-start",
    },
    offersList: {
        width: "100%",
        justifyContent: "center",
        marginBottom: 24,
    },
});

export default ProfileScreen;