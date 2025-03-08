// stores/useProceduresStore.ts
import { create } from 'zustand';

interface ProceduresState {
    activeCategoryId: number | null;
    activeColumnId: number | null;
    activeChildCategoryId: number | null;
    setActiveCategory: (id: number) => void;
    setActiveColumn: (id: number) => void;
    setActiveChildCategory: (id: number) => void;
}

export const useProceduresStore = create<ProceduresState>((set) => ({
    activeCategoryId: null,
    activeColumnId: null,
    activeChildCategoryId: null,
    setActiveCategory: (id) => set({
        activeCategoryId: id,
        activeColumnId: null,
        activeChildCategoryId: null
    }),
    setActiveColumn: (id) => set({
        activeColumnId: id,
        activeChildCategoryId: null
    }),
    setActiveChildCategory: (id) => set({ activeChildCategoryId: id }),
}));
