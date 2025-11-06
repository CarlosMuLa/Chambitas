import React, {useState, useMemo} from "react";
import { ScrollView, XStack, YStack, Button, TextArea, Input, Form, Spinner, Select, Label, Sheet, Adapt, getFontSize } from "tamagui";
import { Check, ChevronDown } from "@tamagui/lucide-icons";

const CreateOffer = () => {
    const categories = ['Fontaneria', 'Jardineria', 'Limpieza', 'Construccion', 'Electricidad'];
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
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

                    <Select 
                    id="category-select" 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                    defaultValue={categories[0]}
                    >
                        <Select.Trigger width={200} iconAfter={ChevronDown}>
                            <Select.Value placeholder="Selecciona una categoria" />
                        </Select.Trigger>
                        <Adapt when="sm" platform="native">
                            <Sheet modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView>
                                        <Adapt.Contents />
                                    </Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                        </Adapt>
                            <Select.Content>
                                <Select.Viewport>
                                    {categories.map((category, index) => (
                                        <Select.Item index={index} key={category} value={category}>
                                            <Select.ItemText>{category}</Select.ItemText>
                                            <Select.ItemIndicator marginLeft="auto">
                                                <Check size={16} />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select>
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
