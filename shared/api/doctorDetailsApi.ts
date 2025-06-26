// shared/api/clinicsApi.ts
import { apiGet } from '@/shared/api';
import {Doctor} from "@/shared/api/doctorsApi";

export const DoctorDetailsAPI = {
    getDoctorBySlug: (doctorSlug: string) =>
        apiGet<Doctor>(`/patients_endpoints/doctors/${doctorSlug}/`),
} as const;
