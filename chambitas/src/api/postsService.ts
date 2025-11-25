import {useMutation} from '@tanstack/react-query';


interface Post {
    sub: string;
    title: string;
    description: string;
    price: number;
    city: number;
    imageUri?: string;
    serviceType: number;
}

export const useCreatePost = () => {
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
    });
};