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
    getClinicReviews: (clinicSlug: string, page: number = 1, pageSize: number = 10) => {
        let url = `patients_endpoints/clinics/${clinicSlug}/reviews/?page=${page}&page_size=${pageSize}`;
        return apiGet<ReviewResponse>(url);
    },
    getDoctorReviews: (doctorSlug: string, page: number = 1, pageSize: number = 10) => {
        let url = `patients_endpoints/doctors/${doctorSlug}/reviews/?page=${page}&page_size=${pageSize}`;
        return apiGet<ReviewResponse>(url);
    },
} as const;
