import { X } from "@tamagui/lucide-icons";
import React from "react";
import { View, Text, StyleSheet, TextInput} from "react-native";
import { XStack, YStack , H2, Paragraph, Label, Input, Button} from "tamagui";

const LoginScreen = () => {
    return (
        <YStack style={styles.container} gap="$2">
            <H2 style={styles.title}>Bienvenido a Grinder</H2>
            <Paragraph>Inicia sesión para continuar</Paragraph>
            <YStack>
                <YStack >
                    <Label htmlFor="emailInput">Correo Electrónico</Label>
                    <Input id="emailInput" placeholder="Ingresa tu correo electrónico" size = "$4" />
                </YStack>
                <YStack>
                    <Label htmlFor="passwordInput">Contraseña</Label>
                    <Input id="passwordInput" placeholder="Ingresa tu contraseña" secureTextEntry size = "$4"/>
                </YStack>
                <Button size="$4" theme="accent" mt="$4">Iniciar Sesión</Button>
            </YStack>
        </YStack>
    );
}

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

export default LoginScreen;