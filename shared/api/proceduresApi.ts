// shared/api/proceduresApi.ts
import { apiGet } from '@/shared/api';

export interface TopLevelCategory {
    procedure_category_id: number;
    procedure_category_title: string;
    procedure_category_slug: string;
}

export interface Description {
    id: number;
    title: string;
    content: string;
}

export interface MedicalProcedure {
    medical_procedure_id: number;
    medical_procedure_title: string;
    medical_procedure_slug: string;
    is_for_children: boolean;
    child_age_from: any;
    child_age_to: any;
    descriptions: Description[];
}

export interface CategoryDetails {
    procedure_category_id: number;
    procedure_category_title: string;
    procedure_category_slug: string;
    child_procedure_categories_list: {
        procedure_category_id: number;
        procedure_category_title: string;
        procedure_category_slug: string;
    }[];
    medical_procedures_list: MedicalProcedure[];
}

export const ProceduresAPI = {
    getTopLevelCategories: () =>
        apiGet<TopLevelCategory[]>('/patients_endpoints/procedures/categories/top-level/'),

    getCategoryDetails: (categoryId: number) =>
        apiGet<CategoryDetails>(`/patients_endpoints/procedures/categories/${categoryId}/`),
} as const;
