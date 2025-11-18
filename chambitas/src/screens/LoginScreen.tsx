import { X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert} from "react-native";
import { XStack, YStack , H2, Paragraph, Label, Input, Button, Spinner} from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/AuthServices";

const LoginScreen = () => {
    const { loginSuccess} = useAuth();
    type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginMutation = useMutation({
        mutationFn: authService.signIn,
        onSuccess: (data) => {
            loginSuccess(data);
        },
        onError: (error) => {
            console.error("Error al iniciar sesión:", error);
            Alert.alert("Error", "Correo o contraseña incorrectos");
        }
    });
    
    const handleSignIn = async () => {
        if (!email || !password) return;
        loginMutation.mutate({ username: email, password });
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
                    disabled={loginMutation.isPending}
                    icon={loginMutation.isPending ? <Spinner /> : undefined}
                >
                   {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                <Paragraph style={{ textAlign: 'center', marginTop: 20 }}>
                    <Text>
                    ¿No tienes una cuenta?{' '}
                    </Text>
                    <Text 
                    style={{ marginTop: 20, textAlign: 'center', color:"#DD0303" , fontWeight: "bold" }} 
                    onPress={() => navigation.navigate('SignUp')}>
                    Registrate
                    </Text>
                </Paragraph>
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