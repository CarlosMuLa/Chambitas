import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {Offer} from "../components/Offer";

const Home = () => {
    return (
        <View style={styles.container}>
            <Offer></Offer>
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
