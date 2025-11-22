import { Check, ChevronDown, X } from "@tamagui/lucide-icons";
import { YStack, Label, XStack, Text, Button, Separator, Theme } from "tamagui";
import React, { useMemo, useState } from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from "react-native";

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
    const [open, setOpen] = useState(false);

    const normalizedItems = useMemo(() => {
        return items.map((item) => {
            if (typeof item === 'string') {
                return { label: item, value: item };
            }
            return item;
        });
    }, [items]);

    const selectedItem = normalizedItems.find(item => item.value === value);

    return (
        <YStack gap="$2" style={{ width }}>
            {label && <Label>{label}</Label>}
            
            {/* Este es el "Trigger" que se ve como un input */}
            <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.8}>
                <XStack style={{
                    borderWidth: 1,
                    borderColor: "$borderColor",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Text color={selectedItem ? "$color" : "$placeholderColor"} numberOfLines={1}>
                        {selectedItem ? selectedItem.label : placeholder}
                    </Text>
                    <ChevronDown size={20} color="$color" />
                </XStack>
            </TouchableOpacity>

            {/* Modal Nativo - Funciona siempre sin dependencias de animación complejas */}
            <Modal
                visible={open}
                transparent
                animationType="slide" // O 'slide' si prefieres que suba
                onRequestClose={() => setOpen(false)}
            >
                {/* Fondo oscuro semitransparente */}
                <TouchableOpacity 
                    style={{ flex: 1, justifyContent: 'flex-end' }} 
                    activeOpacity={1} 
                    onPress={() => setOpen(false)}
                >
                    {/* Contenedor de la lista (Simula el Sheet) */}
                    <TouchableWithoutFeedback>
                        <YStack style={{
                            backgroundColor: "white",
                            borderTopLeftRadius: 20, 
                            borderTopRightRadius: 20, 
                            paddingBottom: 32, // Espacio para el safe area
                            maxHeight: "60%"
                        }}
                        >
                            {/* Cabecera del Modal */}
                            <XStack  style={{ padding: 16, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderColor: "white" }}>
                                <Text fontSize="$5" fontWeight="bold">{label || "Seleccionar"}</Text>
                                <Button size="$3" circular icon={X} onPress={() => setOpen(false)} chromeless />
                            </XStack>

                            {/* Lista de opciones */}
                            <FlatList
                                data={normalizedItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => {
                                    const isSelected = item.value === value;
                                    return (
                                        <TouchableOpacity 
                                            onPress={() => {
                                                onValueChange(item.value);
                                                setOpen(false);
                                            }}
                                        >
                                            <XStack style={{
                                                paddingVertical: 16,
                                                paddingHorizontal: 16,
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                backgroundColor: "transparent"
                                            }}>
                                                <Text fontSize="$4" color={isSelected ? "$colorFocus" : "$color"}>
                                                    {item.label}
                                                </Text>
                                                {isSelected && <Check size={20} color="$colorFocus" />}
                                            </XStack>
                                            <Separator />
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </YStack>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </YStack>
    );
};

export default DropDownSelect;