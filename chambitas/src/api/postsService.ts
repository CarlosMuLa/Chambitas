import {useMutation} from '@tanstack/react-query';


interface Post {
    sub: string;
    title: string;
    description: string;
    category: string;
    price: number;
    city: number;
    imageUri?: string;
    datePosted: string;
    serviceType: number;
}