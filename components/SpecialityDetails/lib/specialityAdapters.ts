// shared/lib/adapters/specialityAdapters.ts

import { Doctor, MedicalCategory, Schedule, Procedure } from '@/shared/api/doctorsApi';
import {SpecialityDoctor} from "@/shared/api/specialityApi";

/**
 * Адаптер для преобразования данных врача из API специальностей в формат,
 * совместимый с компонентом DoctorCard
 */
export const adaptSpecialityDoctorToCardFormat = (doctor: SpecialityDoctor): Doctor => {
    // Преобразуем еженедельное расписание в формат, который ожидает DoctorCard
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    // Форматирование дат для сравнения с API
    const formatDateForComparison = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const todayDate = formatDateForComparison(today);
    const tomorrowDate = formatDateForComparison(tomorrow);
    const dayAfterDate = formatDateForComparison(dayAfter);

    // Находим расписание на нужные дни
    const scheduleToday = doctor.weekly_schedule.find(s => s.date === todayDate);
    const scheduleTomorrow = doctor.weekly_schedule.find(s => s.date === tomorrowDate);
    const scheduleDayAfter = doctor.weekly_schedule.find(s => s.date === dayAfterDate);

    // Преобразуем time_slots в working_hours
    const transformSchedule = (schedule: typeof doctor.weekly_schedule[0] | undefined): Schedule[] => {
        if (!schedule) return [];

        // Преобразуем формат расписания
        return [{
            clinic_title: schedule.clinic_title,
            clinic_address: doctor.today_clinic_address,
            clinic_id: schedule.clinic_id.toString(),
            maps_links: doctor.clinic_today_maps_links || { yandex: '', google: '', "2gis": '' },
            working_hours: schedule.time_slots.map(slot => ({
                id: slot.time_slot_id,
                start_time: slot.start_time,
                end_time: slot.end_time
            }))
        }];
    };

    // Создаем объект процедуры на основе данных
    const procedures: Procedure[] = doctor.procedure_name ? [{
        title: doctor.procedure_name,
        slug: '',
        current_price: {
            default_price: doctor.procedure_price || 0,
            discount: doctor.procedure_discount || 0,
            final_price: doctor.final_price || 0
        },
        medical_procedure_id: ''
    }] : [];

    // Формируем объект с медицинскими категориями
    const medical_categories: MedicalCategory[] = doctor.categories.map((category, index) => ({
        medical_category_title: category,
        medical_category_id: `cat-${index}`
    }));


    return {
        id: doctor.id,
        full_name: doctor.full_name,
        slug: doctor?.slug ?? '',
        first_name: doctor.full_name.split(' ')[0] || '',
        last_name: doctor.full_name.split(' ')[1] || '',
        middle_name: doctor.full_name.split(' ')[2] || '',
        gender: '',
        medical_categories: medical_categories,
        experience_years: doctor.experience_years,
        works_since: new Date().getFullYear() - doctor.experience_years + '',
        for_child: false, // Нет данных в API, устанавливаем по умолчанию
        clinic_franchise: 0,
        review_count: doctor.review_count,
        average_rating: doctor.average_rating,
        clinic_today: doctor.franchise_title,
        clinic_today_address: doctor.today_clinic_address,
        schedule_today: transformSchedule(scheduleToday),
        schedule_tomorrow: transformSchedule(scheduleTomorrow),
        schedule_day_after_tomorrow: transformSchedule(scheduleDayAfter),
        procedures: procedures,
        consultations: procedures, // Используем те же данные, так как consultations нет в API
        main_photo_url: doctor.main_photo_url
    };
};

/**
 * Функция для получения заголовка специальности из slug
 */
export const getSpecialityTitleFromSlug = (slug: string): string => {
    return slug
        ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
        : '';
};
