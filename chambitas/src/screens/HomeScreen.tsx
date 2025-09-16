import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {Offer} from "../components/Offer";

const Home = () => {
    return (
        <View style={styles.container}>
            <Offer title="Arreglar Fugas de Agua" timeStamp={2} imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default Home;
