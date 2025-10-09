import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { XStack } from "tamagui";
import Offer from "../components/Offer";

const offersHistory = [
    {
        id: "1",
        title: "Fontanería en baño",
        timeStamp: 2,
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
        id: "2",
        title: "Jardinería en casa",
        timeStamp: 5,
        imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
        id: "3",
        title: "Electricidad cocina",
        timeStamp: 12,
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
];

const ProfileScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{ uri: "https://randomuser.me/api/portraits/women/28.jpg" }}
                style={styles.avatar}
            />
            <Text style={styles.name}>CLaudia Sheinbaum</Text>
            <Text style={styles.email}>claudia@email.com</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
            <Text style={styles.historyTitle}>Historial de ofertas</Text>
            <XStack
                flexWrap="wrap"
                gap={12}
                $maxMd={{ flexDirection: "column", alignItems: "center" }}
                style={styles.offersList}
            >
                {offersHistory.map((offer) => (
                    <Offer
                        key={offer.id}
                        title={offer.title}
                        timeStamp={offer.timeStamp}
                        imageUrl={offer.imageUrl}
                    />
                ))}
            </XStack>
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