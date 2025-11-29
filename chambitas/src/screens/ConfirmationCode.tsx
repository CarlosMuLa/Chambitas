import React, { useContext, useState, useEffect } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native'; // Importamos herramientas nativas
import { useAuth } from '../context/AuthContext';
import { YStack, H2, Paragraph, Label, Input, Button, Form, Spinner } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/AuthServices';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useRoute } from '@react-navigation/native';

const ConfirmationCode = ({route}: { route: any }) => {
    const { username, password } = route.params;
    type ConfirmationCodeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConfirmationCode'>;
    const navigation = useNavigation<ConfirmationCodeNavigationProp>();
    const [code, setCode] = useState('');
    const { loginSuccess } = useAuth();

    // Estado para el temporizador
    const [countdown, setCountdown] = useState(0);

    // Lógica del Temporizador
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [countdown]);

    // Función auxiliar para mostrar mensajes nativos

    const codeConfirmationMutation = useMutation({
        mutationFn: authService.confirmUser,
        onSuccess: async () => {
            
            if(password){
                try {
                    const tokens = await authService.signIn({username, password});
                    if (tokens && tokens.AccessToken && tokens.IdToken) {
                        await loginSuccess(tokens.AccessToken, tokens.IdToken);
                    }
                }
                catch (error) {
                    console.error("Error al iniciar sesión después de la confirmación:", error);
                    alert( 'Cuenta verificada, pero debes iniciar sesión manualmente.');
                }
            }
        },
        onError: (error: any) => {
            console.error("Error al confirmar el código:", error);
            
            // Manejo específico de errores de Cognito
            let errorMessage = 'Ocurrió un error al verificar el código.';

            if (error.name === 'CodeMismatchException' || error.toString().includes('Invalid verification code')) {
                errorMessage = 'Código incorrecto. Si pediste varios, usa solo el más reciente.';
            } else if (error.name === 'ExpiredCodeException') {
                errorMessage = 'El código ha expirado. Por favor solicita uno nuevo.';
            } else if (error.name === 'LimitExceededException') {
                errorMessage = 'Demasiados intentos. Espera un momento.';
            }

            alert(errorMessage);
        }
    });

    const resendCodeMutation = useMutation({
        mutationFn: authService.resendCode,
        onSuccess: () => {
            setCountdown(60); // Iniciar temporizador de 60 segundos
            alert( "Código de confirmación reenviado.");
        },
        onError: (error) => {
            console.error("Error al reenviar el código:", error);
            alert( "No se pudo reenviar el código.");
        }
    });

    const handleConfirmCode = () => {
        // Limpiamos espacios en blanco antes de validar
        const cleanCode = code.trim();

        if (!cleanCode || cleanCode.length !== 6) {
            alert( "Por favor, ingresa el código de 6 dígitos.");
            return;
        }
        // Enviamos el código limpio
        codeConfirmationMutation.mutate({ username, code: cleanCode });
    }

    return (
        <Form onSubmit={handleConfirmCode} style={{ padding: 16, flex: 1, justifyContent: 'center' }}>
            <YStack gap="$4">
                <YStack gap="$2">
                    <H2 style={{ textAlign: "center" }}>Confirma tu cuenta</H2>
                    <Paragraph style={{ textAlign: "center" }}>Ingresa el código de confirmación enviado a tu correo electrónico.</Paragraph>
                </YStack>
                
                <Input
                    id="codeInput"
                    placeholder="Código de Confirmación"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={{ textAlign: "center" }}
                    fontSize="$6"
                />
                
                <Form.Trigger asChild disabled={codeConfirmationMutation.isPending}>
                    <Button 
                        icon={codeConfirmationMutation.isPending ? <Spinner /> : undefined}
                    >
                        {codeConfirmationMutation.isPending ? 'Confirmando...' : 'Confirmar Código'}
                    </Button>
                </Form.Trigger>
                
                <YStack  style={{ alignItems: "center", marginTop: 16 }} gap="$2">
                    <Paragraph size="$2" style={{ color: "$gray10" }}>¿No has recibido el código?</Paragraph>
                    <Button 
                        size="$3"
                        variant="outlined"
                        onPress={() => resendCodeMutation.mutate({ username })} 
                        disabled={resendCodeMutation.isPending || countdown > 0}
                        opacity={countdown > 0 ? 0.5 : 1}
                    >
                        {resendCodeMutation.isPending 
                            ? 'Reenviando...' 
                            : countdown > 0 
                                ? `Reenviar en ${countdown}s` 
                                : 'Reenviar Código'}
                    </Button>
                </YStack>
            </YStack>
        </Form>
    )
};

export default ConfirmationCode;