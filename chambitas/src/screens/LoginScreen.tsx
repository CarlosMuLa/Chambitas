import { X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert} from "react-native";
import { XStack, YStack , H2, Paragraph, Label, Input, Button} from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSignIn = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            Alert.alert("Error", "Correo o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

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
                    <Input id="emailInput" placeholder="Ingresa tu correo" size = "$4" width="100%"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                </YStack>
                <YStack>
                    <Label htmlFor="passwordInput">Contraseña</Label>
                    <Input id="passwordInput" placeholder="Ingresa tu contraseña" secureTextEntry size = "$4" width="100%"
                    value={password}
                    onChangeText={setPassword}
                    />
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
                    onPress={handleSignIn}
                    disabled={loading}
                >
                   {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
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