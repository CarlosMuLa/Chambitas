import React, {useState, useMemo} from "react";
import { ScrollView, XStack, YStack, Button, TextArea, Input, Form, Spinner, Label, getFontSize } from "tamagui";
import DropDownSelect from "../components/DropDownSelect";
import { Check, ChevronDown } from "@tamagui/lucide-icons";

const CreateOffer = () => {
    const categories = [
        { label: 'Plomeria', value: '1' },
        { label: 'Jardineria', value: '2' },
        { label: 'Electricista', value: '3' },
        { label: 'Limpieza', value: '4' }
    ];
    const [selectedCategory, setSelectedCategory] = useState(categories[1].label);
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
                <XStack style={{ alignItems: 'center' }} gap="$2">
                    <Label  style={{ marginRight: 10 }}>Categorias</Label>

                    <DropDownSelect
                        items={categories}
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                        placeholder="Selecciona una categoria"
                        width={200}
                    />
                    </XStack>
                <Form.Trigger asChild disabled = {status!=='off'}>
                <Button icon={status === 'submitting' ? () => <Spinner/> : undefined}>
                    {status === 'submitting' ? 'Creando oferta...' : 'Crear Oferta'}
                </Button>
                </Form.Trigger>
            </YStack>
        </Form>
    );
};

export default CreateOffer;
