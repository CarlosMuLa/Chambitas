import React from "react";
import { View, Text, StyleSheet, TextInput, Animated } from "react-native";
import { ScrollView, XStack, YStack, Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import {Offer} from "../components/Offer";
import SearchBar from "../components/SearchBar";

import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateOffer'>;
const Home = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    return (
        <YStack style={{flex:1, backgroundColor: '#d3ceceff'}}>
            <SearchBar />
        <ScrollView>
        <XStack $maxMd={{ flexDirection: 'column' }} style={{ marginTop: 10, justifyContent: 'space-around', padding: 10 }}>
            <Offer title="Fontaneria" timeStamp={2} imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
            <Offer title="Jardineria" timeStamp={5} imageUrl="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
                        <Offer title="Jardineria" timeStamp={5} imageUrl="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />

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
