// shared/lib/adapters/specialityAdapters.ts

/**
 * Функция для получения заголовка специальности из slug
 */
export const getSpecialityTitleFromSlug = (slug: string): string => {
    return slug
        ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
        : '';
};
