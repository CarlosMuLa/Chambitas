import { X } from "@tamagui/lucide-icons";
import React from "react";
import { View, Text, StyleSheet, TextInput} from "react-native";
import { XStack, YStack , H2, Paragraph, Label, Input, Button} from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";

const LoginScreen = () => {
    return (
        <YStack style={styles.container} gap="$2">
            <LinearGradient
                colors= {['#d6ef75ff', '#3b5998']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                >
            <H2 style={styles.title}>Bienvenido a Grinder</H2>
            </LinearGradient>
            <Paragraph>Inicia sesión para continuar</Paragraph>
            <YStack>
                <YStack >
                    <Label htmlFor="emailInput">Correo Electrónico</Label>
                    <Input id="emailInput" placeholder="Ingresa tu correo" size = "$4" width="100%" />
                </YStack>
                <YStack>
                    <Label htmlFor="passwordInput">Contraseña</Label>
                    <Input id="passwordInput" placeholder="Ingresa tu contraseña" secureTextEntry size = "$4" width="100%"/>
                </YStack>
                <Button size="$4" theme="accent" mt="$4">Iniciar Sesión</Button>
                <Text style={{ marginTop: 20, textAlign: 'center' }}>¿No tienes una cuenta? Regístrate</Text>
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