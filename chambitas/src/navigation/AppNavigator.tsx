import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import Home from "../screens/HomeScreen";
import ProfileScreen from "../screens/Profile";
import LoginScreen from "../screens/LoginScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
    const isLoggedIn = false; // Replace with actual authentication logic

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    // if logged in, show the main app
                    <Stack.Screen name="Main" component={MainTabs} />
                ) : (
                    // if not logged in, show the login screen
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;