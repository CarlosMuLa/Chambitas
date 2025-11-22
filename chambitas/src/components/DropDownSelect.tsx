import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Select, Adapt, Sheet, YStack, Label } from "tamagui";
import React, { useMemo } from "react";

// Allows passing simple strings OR objects with label/value
export type SelectItem = string | { label: string; value: string } | { label: number; value: string };

interface DropDownSelectProps {
    items: SelectItem[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    width?: number | string;
}

export const DropDownSelect = ({ 
    items, 
    value, 
    onValueChange, 
    placeholder = "Selecciona una opción", 
    label,
    width = "100%"
}: DropDownSelectProps) => {

    const normalizedItems = useMemo(() => {
        return items.map((item) => {
            if (typeof item === 'string') {
                return { label: item, value: item };
            }
            return item;
        });
    }, [items]);

    return (
        <YStack gap="$2" style={{width}}>
            {label && <Label>{label}</Label>}
            
            <Select 
                value={value} 
                onValueChange={onValueChange} 
                disablePreventBodyScroll
            >
                <Select.Trigger iconAfter={ChevronDown}>
                    <Select.Value placeholder={placeholder} />
                </Select.Trigger>

                {/* 
                    IMPORTANTE: Restauramos el Adapt.
                    En móviles, esto convierte el menú en un "Sheet" (hoja deslizante).
                    Sin esto, la lista se renderiza "inline" rompiendo el diseño.
                */}
                <Adapt when="sm" platform="touch">
                    <Sheet
                        modal
                        dismissOnSnapToBottom
                        snapPoints={[50]}
                        snapPointsMode="percent"
                        animationConfig={{
                            type: 'spring',
                            damping: 20,
                            mass: 1.2,
                            stiffness: 250,
                        }}
                    >
                        <Sheet.Frame>
                            <Sheet.ScrollView>
                                <Adapt.Contents />
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                    </Sheet>
                </Adapt>

                <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton style={{alignItems: "center", justifyContent: "center", position: "relative", width: "100%"}}>
                        <ChevronUp size={20} />
                    </Select.ScrollUpButton>

                    <Select.Viewport style={{minWidth: 200}}>
                        <Select.Group>
                            {normalizedItems.map((item, i) => (
                                <Select.Item index={i} key={item.value} value={item.value}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                        <Check size={16} />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Viewport>

                    <Select.ScrollDownButton style={{alignItems: "center", justifyContent: "center", position: "relative", width: "100%"}}>
                        <ChevronDown size={20} />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select>
        </YStack>
    );
};

export default DropDownSelect;



