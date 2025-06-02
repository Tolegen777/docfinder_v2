// shared/api/proceduresApi.ts
import { apiGet } from '@/shared/api';

export interface TopLevelCategory {
    procedure_category_id: number;
    procedure_category_title: string;
    procedure_category_slug: string;
}

export interface ChildCategory {
    procedure_category_id: number;
    procedure_category_title: string;
    procedure_category_slug: string;
}

export interface Procedure {
    medical_procedure_id: number;
    medical_procedure_title: string;
    medical_procedure_slug: string;
}

export interface ColumnCategory {
    procedure_category_id: number;
    procedure_category_title: string;
    procedure_category_slug: string;
    child_categories: ChildCategory[];
    procedures: Procedure[];
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
    child_procedure_categories_columns: ColumnCategory[];
    medical_procedures_list: Procedure[];
}

export const ProceduresAPI = {
    getTopLevelCategories: () =>
        apiGet<TopLevelCategory[]>('/patients_endpoints/procedures/categories/top-level/'),

    getCategoryDetails: (categoryId: number) =>
        apiGet<CategoryDetails>(`/patients_endpoints/procedures/categories/${categoryId}/`),
} as const;

export interface AllProcedure {
    id: number;
    title: string;
    slug: string;
    is_for_children: boolean;
    child_age_from: string;
    child_age_to: string;
}

export const AllProceduresAPI = {
    getAllProcedures: () =>
        apiGet<AllProcedure[]>('/patients_endpoints/all-procedures/'),
} as const;
