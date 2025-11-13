import React, { useState} from 'react';
import  {Platform} from 'react-native';
import { YStack, Label, Input, Form, Avatar} from 'tamagui';
import * as ImagePicker from 'expo-image-picker';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleImagePick = async () => {
        if (Platform.OS !== 'web') 
        {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Se requieren permisos para acceder a las fotos.');
                return;
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
};

    return ( 
        <Form>
            <YStack style = {{ padding: 16 }} gap="$4">
                <Avatar circular size="$20" alignSelf="center" marginBottom="$4">
                    <Avatar.Image source={{ uri: 'https://example.com/default-avatar.png' }} />
                    <Avatar.Fallback backgroundColor="gray">U</Avatar.Fallback>
                </Avatar>
                <Label> Ingresa Tu Email</Label>
                <Input 
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Label> Ingresa Tu Numero de Celular</Label>
                <Input 
                    placeholder="Celular"
                    value={cellphone}
                    onChangeText={setCellphone}
                />
                <Label> Crea Una Contraseña</Label>
                <Input 
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Label> Confirma Tu Contraseña</Label>
                <Input 
                    placeholder="Confirma Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </YStack>
        </Form>
        )
    }
