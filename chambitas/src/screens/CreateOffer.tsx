import React, { useState } from "react";
import { ScrollView, XStack, YStack, Button, TextArea, Input, Form, Spinner, Label, Slider, Image, Text } from "tamagui";
import DropDownSelect from "../components/DropDownSelect";
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreatePost } from "../api/postsService";
import { useCurrentUser } from "../hooks/currentUser";
import { uploadOfferImage } from "../services/s3Service";
import { useAuth } from "../context/AuthContext";
// Iconos para eliminar foto (opcional, usa el que tengas o texto "X")
import { X } from '@tamagui/lucide-icons'; 

const CreateOffer = () => {
    const { idToken } = useAuth();
    // ... (tus arrays de categories y citiesList siguen igual) ...
    const categories = [
        { label: 'Plomeria', value: '1' },
        { label: 'Jardineria', value: '2'},
        { label: 'Electricista', value: '3' },
        { label: 'Limpieza', value: '4' }
    ];

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

    // Estados del formulario
    const [selectedCategory, setSelectedCategory] = useState(categories[1].label);
    const [selectedCity, setSelectedCity] = useState(citiesList[0].label);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState(1);


    
    // 📸 NUEVO ESTADO: Array para guardar múltiples imágenes
    const [images, setImages] = useState<string[]>([]);

    const insets = useSafeAreaInsets();
    const currentUser = useCurrentUser();
    const createPostMutation = useCreatePost();

    // 📸 NUEVA FUNCIÓN: Seleccionar Imágenes
    const pickImages = async () => {
        // Calculamos cuántas faltan para llegar a 3
        const remainingSlots = 3 - images.length;
        if (remainingSlots <= 0) return;

        // Pedimos permisos si es necesario (en nativo)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se necesitan permisos para acceder a la galería.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            // Habilitamos selección múltiple
            allowsMultipleSelection: true, 
            selectionLimit: remainingSlots, // Limitamos a las que faltan
            quality: 0.5,
        });

        if (!result.canceled) {
            // Agregamos las nuevas URIs al array existente
            const newUris = result.assets.map(asset => asset.uri);
            setImages(prev => [...prev, ...newUris].slice(0, 3)); // Aseguramos máx 3
        }
    };

    // 📸 NUEVA FUNCIÓN: Eliminar una imagen seleccionada
    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateOffer = async () => {
        // Validación simple
        if (images.length != 3) 
            {
                alert("Por favor agrega 3 imágenes de tu trabajo.");
                return;
            }
         if (!idToken) 
            {
                alert("Error de sesión. Vuelve a iniciar sesión.");
                return;
            }
        try 
        {
            const uploadedUrls = await Promise.all(
                images.map(uri=> uploadOfferImage(uri,idToken))
            );
            console.log("Imágenes subidas a S3:", uploadedUrls);

        const newPost = {
            sub: currentUser?.sub || '',
            title: title,
            description: description,
            serviceType: Number(selectedCategory), // Ojo: aquí quizás debas buscar el value correspondiente al label
            city: Number(selectedCity),
            price: Number(price),
            duration: Number(duration),
            // Aquí enviamos el array de URIs. 
            // Tu servicio (useCreatePost) tendrá que encargarse de subir las 3 a S3
            thumbnail: uploadedUrls[0],      
            image1: uploadedUrls[1] || null,
            image2: uploadedUrls[2] || null, 
        };
        

        try {
            await createPostMutation.mutateAsync(newPost);
        } catch (error) {
            console.error("Error al crear la oferta:", error);
        }
    } catch (error) {
        console.error("Error subiendo imágenes:", error);
    }
    };
    

    return (
        <ScrollView>
            <Form onSubmit={handleCreateOffer} style={{ backgroundColor: '#d4d3d3ff', paddingBottom: insets.bottom }} disabled={createPostMutation.isPending}>
                <YStack style={{ padding: 16, paddingTop: insets.top + 20 }} gap="$4">
                    
                    <Input id="title" placeholder="Titulo de Oferta" value={title} onChangeText={setTitle} />
                    
                    <TextArea id="description" placeholder="Descripcion de la oferta..." size="$4" value={description} onChangeText={setDescription} />

                    {/* 📸 SECCIÓN DE FOTOS */}
                    <YStack gap="$2">
                        <Label>Fotos del trabajo ({images.length}/3)</Label>
                        
                        <XStack gap="$2" flexWrap="wrap">
                            {/* Renderizamos las fotos seleccionadas */}
                            {images.map((uri, index) => (
                                <YStack key={index} width={80} height={80} position="relative">
                                    <Image 
                                        source={{ uri }} 
                                        width="100%" 
                                        height="100%" 
                                        borderRadius="$2" 
                                    />
                                    {/* Botón X para borrar */}
                                    <Button 
                                        size="$2" 
                                        circular 
                                        style={{ 
                                        position: "absolute", 
                                        top: -5, 
                                        right: -5, 
                                        backgroundColor: "red", 
                                        color: "white"}}
                                        onPress={() => removeImage(index)}
                                        icon={<X size={12} />} 
                                    />
                                </YStack>
                            ))}

                            {/* Botón de "Agregar +" (Solo si hay espacio) */}
                            {images.length < 3 && (
                                <Button style={{ borderRadius: 8 , backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }} 
                                    width={80} 
                                    height={80}
                                    onPress={pickImages}
                                >
                                    <Text fontSize={24} style = {{color: "$gray10"}}>+</Text>
                                </Button>
                            )}
                        </XStack>
                    </YStack>

                    {/* ... RESTO DE TU FORMULARIO (Igual que antes) ... */}
                    <XStack gap="$3">
                        {/* ... Selects de Categoría y Ciudad ... */}
                        <YStack flex={1} gap="$2">
                            <Label>Categorias</Label>
                            <DropDownSelect
                                items={categories}
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                placeholder="Selecciona"
                                width="100%"
                            />
                        </YStack>
                        <YStack flex={1} gap="$2">
                            <Label>Ubicación</Label>
                            <DropDownSelect 
                                items={citiesList}
                                value={selectedCity}
                                onValueChange={setSelectedCity}
                                placeholder="Selecciona"
                                width="100%"
                            />
                        </YStack>
                    </XStack>

                    <YStack gap="$2">
                        <XStack style={{ justifyContent: "space-between" }}>
                            <Label>Tiempo estimado:</Label>
                            <Label fontWeight="bold" color="$blue10">
                                {duration === 1 ? '30 min' : `${duration / 2} ${duration === 2 ? 'Hora' : 'Horas'}`}
                            </Label>
                        </XStack>
                        <Slider
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={[1]}
                            onValueChange={(val) => setDuration(val[0])}
                        >
                            <Slider.Track>
                                <Slider.TrackActive />
                            </Slider.Track>
                            <Slider.Thumb circular index={0} />
                        </Slider>
                    </YStack>

                    <XStack style={{ alignItems: 'center' }} gap="$2">
                        <Label style={{ marginRight: 10 }}>Estoy dispuesto a pagar:</Label>
                        <Input placeholder="Precio en MXN" keyboardType="numeric" width={150} value={price} onChangeText={setPrice} />
                    </XStack>
                </YStack>

                <Form.Trigger asChild disabled={createPostMutation.isPending}>
                    <Button icon={createPostMutation.isPending ? <Spinner /> : undefined} style={{ paddingBottom: insets.bottom + 20, margin: 16, backgroundColor: "#FA812F", color: "white" }}>
                        {createPostMutation.isPending ? 'Creando oferta...' : 'Crear Oferta'}
                    </Button>
                </Form.Trigger>
            </Form>
        </ScrollView>
    );
};

export default CreateOffer;