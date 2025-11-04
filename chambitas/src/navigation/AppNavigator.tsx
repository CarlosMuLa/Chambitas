import React from "react";
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";


import Home from "../screens/HomeScreen";
import ProfileScreen from "../screens/Profile";
import LoginScreen from "../screens/LoginScreen";
import OfferDetails from "../screens/OfferDetails";


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
                },
            },
            OfferDetails: 'offer/:title', // -> /offer/algun-titulo
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