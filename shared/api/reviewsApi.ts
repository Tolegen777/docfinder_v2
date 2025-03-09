// shared/api/reviewsApi.ts
import { apiGet } from '@/shared/api';

export interface ReviewResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Review[];
}

export interface Review {
    id: number;
    author_name: string;
    text: string;
    rating: number;
    created_at: string;
}

export const ReviewsAPI = {
    getClinicReviews: (clinicSlug: string, page: number = 1, pageSize: number = 10, sortBy: string = '') => {
        let url = `patients_endpoints/clinics/${clinicSlug}/reviews/?page=${page}&page_size=${pageSize}`;
        if (sortBy) {
            url += `&ordering=${sortBy}`;
        }
        return apiGet<ReviewResponse>(url);
    },
} as const;
