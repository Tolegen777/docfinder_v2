// shared/api/proceduresApi.ts
import { apiGet } from '@/shared/api';

export interface Description {
    id: number;
    title: string;
    content: string;
}

export interface Category {
    id: number;
    title: string;
    slug: string;
}

export interface ProcedureDetails {
    medical_procedure_id: number;
    medical_procedure_title: string;
    medical_procedure_slug: string;
    descriptions: Description[];
    categories: Category[];
}

export const ProcedureDetailsAPI = {
    getProcedureDetails: (procedureSlug: string) =>
        apiGet<ProcedureDetails>(`/patients_endpoints/procedures/${procedureSlug}/`),
} as const;
