// shared/api/clinicsApi.ts
import { apiGet } from '@/shared/api';
import axios from "axios";

// Define Doctor detail API interface based on the provided structure
interface DoctorDetail {
    id: number;
    full_name: string;
    slug: string;
    specialities: {
        id: number;
        title: string;
        slug: string;
        procedures: {
            id: number;
            title: string;
            slug: string;
        }[];
    }[];
    description_fragments: {
        id: number;
        title: string;
        content: string;
    }[];
    work_schedule: {
        date: string;
        clinic_title: string;
        clinic_address: string;
        working_hours: {
            start_time: string;
            end_time: string;
        }[];
    }[];
    review_count: number;
    average_rating: number;
    procedures: {
        title: string;
        slug: string;
        current_price: {
            default_price: number;
            discount: number;
            final_price: number;
        };
    }[];
    consultations: {
        title: string;
        slug: string;
        current_price: {
            default_price: number;
            discount: number;
            final_price: number;
        };
    }[];
    clinic_today_longitude: number | null;
    clinic_today_latitude: number | null;
    clinic_today_maps_links: any;
}

export const DoctorDetailsAPI = {
    getDoctorBySlug: (doctorSlug: string) =>
        apiGet<DoctorDetail>(`/patients_endpoints/doctors/${doctorSlug}/`),
} as const;
