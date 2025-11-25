import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';


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
    serviceTypeId?: number;
    id?: number;
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
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
    const { cityId, serviceTypeId, id } = args;
    const queryParams = new URLSearchParams();
    
    // Nota: Asegúrate que tu backend espera 'cityId' o 'city' (tu lambda usaba 'city')
    if (id) queryParams.append('id', id.toString());
    if (cityId) queryParams.append('city', cityId.toString()); // Ajustado a lo que probablemente espera tu Lambda
    if (serviceTypeId) queryParams.append('category', serviceTypeId.toString()); // Ajustado a 'category'

    const response = await fetch(`https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/posts?${queryParams.toString()}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};