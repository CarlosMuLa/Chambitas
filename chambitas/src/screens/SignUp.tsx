import React, { useState} from 'react';
import  {Platform} from 'react-native';
import { YStack, Label, Input, Form, Avatar, Button, ScrollView, H2, Paragraph, Spinner, Switch, XStack} from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/AuthServices';
import { useNavigation } from '@react-navigation/native';
import { uploadProfilePicture } from '../services/s3Service';
import DropDownSelect from '../components/DropDownSelect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from '@tamagui/lucide-icons';



const SignUp = () => {

    const citiesList = [
        {label: 'Benito Juárez', value: '1'},
        {label: 'Cuauhtémoc', value: '2'},
        {label: 'Colima', value: '3'},
        {label: 'Villa de Alvarez', value: '4'},
        {label: 'Tehuacán', value: '5'},
        {label: 'Guadalajara', value: '6'},
        {label: 'Zapopan', value: '7'},
        {label: 'Monterrey', value: '8'}
    ];
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState(citiesList[0].value);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [type, setType] = useState(1); // 1 para trabajador, 2 para empleador
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const insets = useSafeAreaInsets();
    


    const navigation = useNavigation();
    
    const signUpMutation = useMutation({
        mutationFn: authService.signUp,
        onSuccess: (data) => {
            navigation.navigate('ConfirmationCode', { username });
        },
        onError: (error) => {
            console.error("Error al registrarse:", error);
            alert("Error al registrarse. Por favor, intenta de nuevo.");
        }
    });

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
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
};

const handleSignUp =  async () => {
    if(!email || !password || !cellphone || !username || !confirmPassword || !address || !city) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return false;
    }
    let photoUrl = "";
    setIsRegistering(true);
    if (imageUri) {
        try {
            
            const cleanFileName = email.replace(/[^a-zA-Z0-9]/g, "");
                console.log("Subiendo foto...");
                photoUrl = await uploadProfilePicture(imageUri, cleanFileName);
                console.log("Foto subida:", photoUrl);
        } catch (error) {
            console.error("Error al subir la foto:", error);
            alert("Error al subir la foto. Por favor, intenta de nuevo.");
            setIsRegistering(false);
            return;
        }
    }
    signUpMutation.mutate({ username, email, password, cellphone, address, city, type, imageUri: photoUrl});

};
    return (
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#d4d3d3ff'  }}>
            <Form onSubmit={handleSignUp} disabled = {signUpMutation.isPending} style={{ paddingBottom: insets.bottom + 20, paddingTop: 20 }}>
                <YStack style={{ alignItems: 'center',gap:"$2", marginBottom:"$4" }} >
                    <H2>Crea tu cuenta</H2>
                    <Paragraph style ={{color: "#gray10"}}>Completa tus datos para empezar</Paragraph>
                    <Avatar circular size="$10" alignSelf="center" onPress={handleImagePick} elevation="$2" style= {{marginTop: "$4", backgroundColor: "gray"}}>
                        <Avatar.Image source={{ uri: imageUri || 'https://example.com/default-avatar.png' }} />
                        <Avatar.Fallback style = {{backgroundColor: "white", alignItems: 'center', justifyContent: 'center'}}>
                            <Paragraph>Subir Foto</Paragraph>
                        </Avatar.Fallback>
                    </Avatar>
                </YStack>

                <YStack>
                    <Label htmlFor="email">Ingresa Tu Email</Label>
                    <Input 
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Label htmlFor="username">Ingresa Tu Nombre de Usuario</Label>
                    <Input 
                        id="username"
                        placeholder="Nombre de Usuario"
                        value={username}
                        onChangeText={setUsername}
                    />
                </YStack>
                <YStack >
                    <Label htmlFor="cellphone">Ingresa Tu Numero de Celular</Label>
                    <Input 
                        id="cellphone"
                        placeholder="Celular"
                        value={cellphone}
                        onChangeText={setCellphone}
                        
                    />
                </YStack>
                <YStack>
                    <Label htmlFor="password">Crea Una Contraseña</Label>
                    <Input 
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </YStack>
                <YStack >
                    <Label htmlFor="confirmPassword">Confirma Tu Contraseña</Label>
                    <Input 
                        id="confirmPassword"
                        placeholder="Confirma Contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </YStack>
                <YStack>
                    <Label>
                            Tipo de cuenta:
                    </Label>
                    <XStack style={{alignItems: "center", justifyContent: "space-between", marginTop: "$4"}}>
                        <Label>¿Eres empleador?</Label>
                        <Switch size = "$4" onCheckedChange ={(val: any) => setType(val ? 2 : 1)} checked={type === 2}>
                            <Switch.Thumb animation="bouncy" />
                        </Switch>
                    </XStack>
                </YStack>
                <YStack>
                    <Label>
                        Ingresa tu direccion de residencia (opcional):
                    </Label>
                    <Input id = "address" 
                    placeholder="Direccion"
                    value={address}
                    onChangeText={setAddress}
                    />
                </YStack>

                <YStack style={{ marginTop: 20 }} >
                    <XStack style={{ alignItems: 'center', gap:10 , marginTop: "$4"}} >
                        <Label>Ciudad:</Label>
                        <DropDownSelect
                            items={citiesList}
                            value={city}
                            onValueChange={setCity}
                            placeholder="Selecciona una ciudad"
                        />
                    </XStack>
                </YStack>

                <Form.Trigger asChild disabled={signUpMutation.isPending}>
                    <Button 
                        style={{ marginTop: 20 , 
                        backgroundColor:"#FA812F",
                        color:"white"}}
                        icon={signUpMutation.isPending ?  <Spinner /> : undefined}
                    >
                        {signUpMutation.isPending ? 'Creando cuenta...' : 'Registrarse'}
                    </Button>
                </Form.Trigger>
            </Form>
        </ScrollView>
        )
};

export default SignUp;
