import React from "react";
import { View, Text, StyleSheet, TextInput, Animated } from "react-native";
import { ScrollView, XStack, YStack } from "tamagui";
import { Search } from "@tamagui/lucide-icons";
import {Offer} from "../components/Offer";
import SearchBar from "../components/SearchBar";
import ChatPreview from "../components/ChatPreview";

const Home = () => {
    return (
    <View style = {{ flex:1,  backgroundColor: "#f5f5f5" }}>
        <YStack>
            <SearchBar />
        <Animated.View style={styles.container}>
        </Animated.View>
        <ScrollView>
        <XStack $maxMd={{ flexDirection: 'column' }} style={{ marginTop: 10, justifyContent: 'space-around', padding: 10 }}>
            <Offer title="Fontaneria" timeStamp={2} imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
            <Offer title="Jardineria" timeStamp={5} imageUrl="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
                        <Offer title="Jardineria" timeStamp={5} imageUrl="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />

        </XStack>
        </ScrollView>
        </YStack>
        </View>
        
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
