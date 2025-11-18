import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { YStack, H2, Paragraph, Label, Input, Button, Form, Spinner } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/AuthServices';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';



const ConfirmationCode = ({route}: { route: any }) => {
    const { username } = route.params;
    type ConfirmationCodeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConfirmationCode'>;
    const navigation = useNavigation<ConfirmationCodeNavigationProp>();
    const [code, setCode] = useState('');
    const { loginSuccess } = useAuth();

    const codeConfirmationMutation = useMutation({
        mutationFn: authService.confirmUser,
        onSuccess: (data) => {
            loginSuccess(data);
        },
        onError: (error) => {
            console.error("Error al confirmar el código:", error);
            Alert.alert("Error", "Código de confirmación incorrecto");
        }
    });

    const resendCodeMutation = useMutation({
        mutationFn: authService.resendCode,
        onSuccess: () => {
            Alert.alert("Éxito", "Código de confirmación reenviado");
        },
        onError: (error) => {
            console.error("Error al reenviar el código:", error);
            Alert.alert("Error", "No se pudo reenviar el código de confirmación");
        }
    });

    const handleConfirmCode = () => {
        if (!code || code.length !== 6) {
            Alert.alert("Error", "Por favor, ingresa el código de confirmación de 6 dígitos.");
            return;
        }
        codeConfirmationMutation.mutate({ username, code });
    }

    return (
        <Form onSubmit={handleConfirmCode}>
            <YStack gap="$2">
                <H2>Confirma tu cuenta</H2>
                <Paragraph>Ingresa el código de confirmación enviado a tu correo electrónico.</Paragraph>
                <Input
                    id="codeInput"
                    placeholder="Código de Confirmación"
                    value={code}
                    onChangeText={setCode}
                />
                <Form.Trigger asChild disabled={codeConfirmationMutation.isPending}>
                    <Button icon={codeConfirmationMutation.isPending ? <Spinner /> : undefined}>
                        {codeConfirmationMutation.isPending ? 'Confirmando...' : 'Confirmar Código'}
                    </Button>
                </Form.Trigger>
                <Paragraph>No has recibido el código? Reenviar código</Paragraph>
                <Button onPress={() => resendCodeMutation.mutate({ username })} disabled={resendCodeMutation.isPending}>
                    {resendCodeMutation.isPending ? 'Reenviando...' : 'Reenviar Código'}
                </Button>
            </YStack>
        </Form>
    )
};

export default ConfirmationCode;