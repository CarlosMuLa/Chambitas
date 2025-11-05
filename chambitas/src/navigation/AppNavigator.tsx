import React from "react";
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";


import Home from "../screens/HomeScreen";
import ProfileScreen from "../screens/Profile";
import LoginScreen from "../screens/LoginScreen";
import OfferDetails from "../screens/OfferDetails";
import Chats from "../screens/Chats";
import MakingOffer from "../screens/MakingOffer";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [], // Puedes dejarlo vacío para web
    config: {
        screens: {
            Main: {
                path: '', // La ruta base (ej. "/") mostrará las pestañas principales
                screens: {
                    Home: 'home', // -> /home
                    Profile: 'profile', // -> /profile
                    Chats: 'chats', // -> /chats
                },
            },
            OfferDetails: 'offer/:title', // -> /offer/algun-titulo
            MakingOffer: 'make-offer/:id', // -> /make-offer/123
            Login: 'login', // -> /login
        },
    },
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }} // HIDE THE HEADER FOR ALL TABS
        >
             <Tab.Screen name="Home" component={Home} />
             <Tab.Screen name="Chats" component={Chats} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            
        </Tab.Navigator>
    );  
}


const AppNavigator = () => {
    const isLoggedIn = true; // Replace with actual authentication logic

    return (
        <NavigationContainer linking={linking} documentTitle={{formatter: (options,route)=> `${options?.title ?? route?.name} - Chambitas`,}}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <>
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="OfferDetails" component={OfferDetails} options={({ route }) => ({ title: route.params.title })} />
                    <Stack.Screen name="MakingOffer" component={MakingOffer} options={{ title: 'Hacer Oferta' }} />
                    </>
                ) : (
                    // if not logged in, show the login screen
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;