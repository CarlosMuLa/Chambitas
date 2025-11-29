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
    cognito_sub?: string;
}

interface Order 
{
    offer_id?: string;
    cognito_sub?: string;
    startTime?: string;
    price?: number;
    timeUnit?: string;
}

interface Review {
    order_id: string;
    cognito_sub_client: string;
    cognito_sub_provider: string;
    rating: number;
    title_service: string;
    comment?: string;
}

interface GetReviewsArgs {
    cognito_sub_provider?: string;
    offer_id?: string;
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
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
    });
};


 const fetchPosts = async (args: GetPostsArgs) => {
    const { cityId, category, id, search , cognito_sub} = args;
    const queryParams = new URLSearchParams();
    
    // Nota: Asegúrate que tu backend espera 'cityId' o 'city' (tu lambda usaba 'city')
    if (id) queryParams.append('id', id.toString());
    if (cityId) queryParams.append('city', cityId.toString()); // Ajustado a lo que probablemente espera tu Lambda
    if (category) queryParams.append('category', category.toString()); // Ajustado a 'category'
    if (search) queryParams.append('search', search);
    if (cognito_sub) queryParams.append('cognito_sub', cognito_sub);

    const response = await fetch(`https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/posts?${queryParams.toString()}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};


export const createOrder = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();    
    return useMutation({
        mutationFn: async (newOrder: Order) => {
            const response = await fetch ('https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/createOffer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            return response.json();
        },
    })
};

export const getOrdersById = async (args: Order) =>{
    const { offer_id, cognito_sub } = args;
    const queryParams = new URLSearchParams();
    
    if (offer_id) queryParams.append('offer_id', offer_id.toString());
    if (cognito_sub) queryParams.append('cognito_sub', cognito_sub.toString());
    const response = await fetch(`https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/getOffer?${queryParams.toString()}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
}

export const useGetOrdersById = (args: Order) => {
    return useQuery({
        queryKey: ['orders', args],
        queryFn: () => getOrdersById(args),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
    });
}

export const useSubmitReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newReview: Review) => {
            const response = await fetch('https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/createReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            return response.json();
        },
        onSuccess: () => {
            console.log("Review submitted successfully");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });
};


export const getReviewsByOfferId = async (args: GetReviewsArgs) =>{
    const { offer_id } = args;
    const queryParams = new URLSearchParams();
    
    if (offer_id) queryParams.append('offer_id', offer_id.toString());
    const response = await fetch(`https://k1b6y3wq9f.execute-api.us-east-2.amazonaws.com/getReviews?${queryParams.toString()}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

export const useGetReviewsByOfferId = (args: GetReviewsArgs) => {
    return useQuery({
        queryKey: ['reviewsRating', args],
        queryFn: () => getReviewsByOfferId(args),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
    });
};
