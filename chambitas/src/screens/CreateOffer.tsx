import React, {useState, useMemo} from "react";
import { ScrollView, XStack, YStack, Button, TextArea, Input, Form, Spinner, Label, getFontSize , Slider} from "tamagui";
import DropDownSelect from "../components/DropDownSelect";
import { MyCalendar } from "../components/Calendar";
import * as ImagePicker from 'expo-image-picker';

const CreateOffer = () => {
    const categories = [
        { label: 'Plomeria', value: '1' },
        { label: 'Jardineria', value: '2' },
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
    const [selectedCategory, setSelectedCategory] = useState(categories[1].label);
    const [selectedCity, setSelectedCity] = useState(citiesList[0].label);

    const handleDateSelect = (date: string) => {
    console.log("Día seleccionado:", date);
    // Aquí podrías filtrar tus ofertas por fecha
  };
    
    // 1. Creamos el estado para la duración (valor inicial 1 = 30 Minutos)
    const [duration, setDuration] = useState(1);

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
     React.useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])
    return (
        <Form onSubmit={() => { setStatus('submitting')}} style={{ backgroundColor: '#d4d3d3ff' }}>
            <YStack style={{  padding: 16 }} gap="$4">
                <Input placeholder="Titulo de Oferta" />
                <TextArea placeholder="Descripcion de la oferta..." size="$4" />
                
                {/* Usamos un XStack contenedor */}
                <XStack gap="$3">
                    {/* Columna 1: Categoría (ocupa el 50% gracias a flex={1}) */}
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

                    {/* Columna 2: Ubicación (ocupa el 50% gracias a flex={1}) */}
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
                    {/* 2. Mostramos el título y el valor dinámico en la misma línea */}
                    <XStack style={{justifyContent: "space-between"}}>
                        <Label>Tiempo estimado:</Label>
                        <Label fontWeight="bold" color="$blue10">
                            {duration === 1 ? '30 min' : `${duration / 2} ${duration === 2 ? 'Hora' : 'Horas'}`}
                        </Label>
                    </XStack>

                    {/* 3. Conectamos el Slider al estado */}
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
                    <Label  style={{ marginRight: 10 }}>Estoy dispuesto a pagar:</Label>
                    <Input placeholder="Precio en MXN" keyboardType="numeric" width={150} />

                </XStack>
                <MyCalendar onDateSelect={handleDateSelect} />
                </YStack>
                <Form.Trigger asChild disabled = {status!=='off'}>
                <Button icon={status === 'submitting' ? () => <Spinner/> : undefined}>
                    {status === 'submitting' ? 'Creando oferta...' : 'Crear Oferta'}
                </Button>
                </Form.Trigger>
        </Form>
    );
};

export default CreateOffer;
