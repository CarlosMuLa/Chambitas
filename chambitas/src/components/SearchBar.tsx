import React, { useState } from 'react';
import { View, TextInput, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';

// Simulación de una llamada a la API
const searchServicesAPI = async (query: string) => {
  if (!query) {
    return []; // No busques si el query está vacío
  }
  // En una app real, aquí harías: fetch(`https://tuapi.com/services?q=${query}`)
  console.log(`Buscando en API: "${query}"`);
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
  if (!response.ok) {
    throw new Error('Error en la red');
  }
  return response.json();
};

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Usamos el hook para obtener el término de búsqueda "retrasado"
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Espera 500ms

  const { data, isLoading, isError, error } = useQuery({
    // La 'queryKey' es única. TanStack la usa para el cache.
    // Cambia cuando 'debouncedSearchTerm' cambia, lo que dispara una nueva búsqueda.
    queryKey: ['searchServices', debouncedSearchTerm],
    // La función que se ejecuta para obtener los datos.
    queryFn: () => searchServicesAPI(debouncedSearchTerm),
    // enabled: !!debouncedSearchTerm // Opcional: solo ejecuta si hay un término
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar plomero, electricista..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {isError && <Text style={styles.error}>Error: {error.message}</Text>}

      {data && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  }
});

export default SearchBar;