import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';



interface Post {
    sub: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    city: number;
    thumbnail: string;
    image1?: string | null;
    image2?: string | null;
    serviceType: number;
}

interface GetPostsArgs {
    cityId?: number;
    category?: number;
    id?: number;
    search?: string;
}


export const useCreatePost = () => {
    const queryClient = useQueryClient();
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();    
return useMutation({
        mutationFn: async (newPost: Post) => {
            const response = await fetch('https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigation.navigate('Main');

        }
    });
};

export const usePosts = (args: GetPostsArgs = {}) => {
    return useQuery({
        queryKey: ['posts', args], 
        queryFn: () => fetchPosts(args),
    });
};


 const fetchPosts = async (args: GetPostsArgs) => {
    const { cityId, category, id, search } = args;
    const queryParams = new URLSearchParams();
    
    // Nota: Asegúrate que tu backend espera 'cityId' o 'city' (tu lambda usaba 'city')
    if (id) queryParams.append('id', id.toString());
    if (cityId) queryParams.append('city', cityId.toString()); // Ajustado a lo que probablemente espera tu Lambda
    if (category) queryParams.append('category', category.toString()); // Ajustado a 'category'
    if (search) queryParams.append('search', search);

    const response = await fetch(`https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/posts?${queryParams.toString()}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};