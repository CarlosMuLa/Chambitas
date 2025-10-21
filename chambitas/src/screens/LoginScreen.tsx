import { X } from "@tamagui/lucide-icons";
import React from "react";
import { View, Text, StyleSheet, TextInput} from "react-native";
import { XStack, YStack , H2, Paragraph, Label, Input, Button} from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";

const LoginScreen = () => {
    return (
        <YStack style={styles.container} gap="$2">
            <H2 
                style={styles.title}
                color="transparent"      // 1. Hacemos el color del texto transparente
                backgroundClip="text"  // 2. Recortamos el fondo con la forma del texto
                // 3. Creamos el gradiente para el fondo
                backgroundImage="linear-gradient(to bottom, #DD0303, #FA812F)"
            >
                Bienvenido a Grinder
            </H2>
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
                <Button 
                    size="$4" 
                    mt="$4" 
                    background="#FEF3E2" 
                    color="#DD0303" 
                    hoverStyle={{ background: '#FADFB2' }}
                    pressStyle={{ background: '#FADFB2' }}
                    borderWidth={1}
                    borderColor="#FA812F"
                >Iniciar Sesión</Button>
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
        backgroundColor: "#FEF3E2",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
});

export default LoginScreen;