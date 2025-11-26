import React from 'react';
import { Input, XStack } from 'tamagui';


interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <XStack style={{ alignItems: 'center', padding: 10 , backgroundColor: '#f0f0f0'}}
        >
            <Input style= {{ flex: 1, height: 40, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#e0e0e0'}}
                placeholder="Buscar chambitas..." 
                // 2. Conectamos las props al Input de Tamagui
                value={value}
                onChangeText={onChangeText}
                borderWidth={0}
            />
        </XStack>
  );
};

export default SearchBar;