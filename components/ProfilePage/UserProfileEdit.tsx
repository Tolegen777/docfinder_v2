'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/shadcn/form';
import { Loader2, Key } from 'lucide-react';
import { formatPhoneNumber } from '@/shared/lib/formatters';
import { useGetUserProfile, useUpdateUserProfile } from '@/shared/api/userProfileApi';
import { useAuthStore } from "@/shared/stores/authStore";
import ChangePasswordModal from '@/components/Auth/ChangePasswordModal';

// Схема валидации Zod для формы профиля
const profileSchema = z.object({
    first_name: z.string().min(1, 'Имя обязательно для заполнения'),
    last_name: z.string().optional(),
    middle_name: z.string().optional(),
    phone_number: z.string().regex(/^\+7 [0-9]{3} [0-9]{3} [0-9]{4}$/, 'Введите корректный номер телефона'),
    iin_number: z.string().regex(/^[0-9]{12}$/, 'ИИН должен содержать 12 цифр').optional().or(z.literal('')),
    birth_date: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Форматирование ИИН (ограничение до 12 цифр без нецифровых символов)
const formatIIN = (value: string): string => {
    if (!value) return '';
    return value.replace(/\D/g, '').slice(0, 12);
};

const UserProfileEdit: React.FC = () => {
    const { user, setAuth } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Используем хуки для работы с API профиля
    const { data: profileData, isLoading, refetch } = useGetUserProfile();

    // Мутация для обновления профиля
    const updateProfileMutation = useUpdateUserProfile();

    // Обработка успешного обновления профиля
    useEffect(() => {
        if (updateProfileMutation.isSuccess) {
            toast.success('Профиль успешно обновлен', {
                position: 'top-right',
                duration: 3000,
            });

            // Обновляем данные в запросе
            refetch();

            // Отключаем режим редактирования
            setIsEditing(false);
        }
    }, [updateProfileMutation.isSuccess, refetch]);

    // Обработка ошибок обновления профиля
    useEffect(() => {
        if (updateProfileMutation.isError) {
            const error = updateProfileMutation.error as any;
            const errorMessage = error?.response?.data?.detail || 'Произошла ошибка при обновлении профиля';
            toast.error(errorMessage, {
                position: 'top-right',
                duration: 3000,
            });
        }
    }, [updateProfileMutation.isError, updateProfileMutation.error]);

    // Инициализация формы с react-hook-form и zod
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            middle_name: '',
            phone_number: '+7 ',
            iin_number: '',
            birth_date: '',
        },
    });

    // Обновляем значения формы, когда получаем данные профиля
    useEffect(() => {
        if (profileData) {
            // Заполняем форму данными из профиля
            form.reset({
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                middle_name: profileData.middle_name || '',
                phone_number: profileData.phone_number || '+7 ',
                iin_number: profileData.iin_number || '',
                birth_date: profileData.birth_date || '',
            });
        }
    }, [profileData, form]);

    // Обработчик отправки формы
    const onSubmit = (data: ProfileFormValues) => {
        updateProfileMutation.mutate(data);
    };

    // Если данные загружаются, показываем лоадер
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h1 className="text-xl md:text-2xl font-semibold">Личные данные</h1>

                    {/* Кнопка изменения пароля */}
                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                        onClick={() => setShowChangePassword(true)}
                    >
                        <Key className="h-4 w-4" />
                        <span className="whitespace-nowrap">Изменить пароль</span>
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Имя */}
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                label="Имя *"
                                                required
                                                {...field}
                                                disabled={!isEditing}
                                                className="bg-[#f3f5f6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Фамилия */}
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                label="Фамилия"
                                                {...field}
                                                disabled={!isEditing}
                                                className="bg-[#f3f5f6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ИИН */}
                            <FormField
                                control={form.control}
                                name="iin_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Controller
                                                name="iin_number"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="ИИН *"
                                                        required
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const formattedValue = formatIIN(e.target.value);
                                                            field.onChange(formattedValue);
                                                        }}
                                                        onBlur={field.onBlur}
                                                        disabled={!isEditing}
                                                        className="bg-[#f3f5f6]"
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Номер телефона */}
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Controller
                                                name="phone_number"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Номер телефона *"
                                                        required
                                                        value={field.value || '+7 '}
                                                        onChange={(e) => {
                                                            const formattedValue = formatPhoneNumber(e.target.value);
                                                            field.onChange(formattedValue);
                                                        }}
                                                        onBlur={field.onBlur}
                                                        disabled={!isEditing}
                                                        className="bg-[#f3f5f6]"
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Дата рождения */}
                            <FormField
                                control={form.control}
                                name="birth_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                label="Дата рождения"
                                                type="date"
                                                {...field}
                                                disabled={!isEditing}
                                                className="bg-[#f3f5f6]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form to original values
                                            if (profileData) {
                                                form.reset({
                                                    first_name: profileData.first_name || '',
                                                    last_name: profileData.last_name || '',
                                                    middle_name: profileData.middle_name || '',
                                                    phone_number: profileData.phone_number || '+7 ',
                                                    iin_number: profileData.iin_number || '',
                                                    birth_date: profileData.birth_date || '',
                                                });
                                            }
                                        }}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={updateProfileMutation.isPending || updateProfileMutation.isSuccess}
                                    >
                                        {updateProfileMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Сохранение...
                                            </>
                                        ) : updateProfileMutation.isSuccess ? (
                                            <>
                                                <span className="mr-2">✓</span>
                                                Сохранено!
                                            </>
                                        ) : (
                                            'Сохранить'
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>

            {/* Модальное окно изменения пароля */}
            <ChangePasswordModal
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </div>
    );
};

export default UserProfileEdit;
