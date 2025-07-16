'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '@/shared/api/authApi';

// Regex для валидации казахстанского номера телефона
const phoneRegex = /^\+7 [0-9]{3} [0-9]{3} [0-9]{4}$/;

// Схема валидации для сброса пароля
const resetPasswordSchema = z.object({
    phone_number: z.string().regex(phoneRegex, 'Введите корректный номер телефона'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
};

// Функция для форматирования телефонного номера
const formatPhoneNumber = (value: string): string => {
    if (!value) return '+7 ';

    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');

    // Ограничиваем до 11 цифр (с кодом страны)
    const limitedDigits = digits.slice(0, 11);

    // Если первая цифра не 7, подставляем 7
    const normalizedDigits = limitedDigits.startsWith('7')
        ? limitedDigits
        : '7' + limitedDigits.slice(limitedDigits.startsWith('7') ? 1 : 0);

    // Форматируем номер
    let formattedNumber = '+7';

    if (normalizedDigits.length > 1) {
        formattedNumber += ' ';
        // Добавляем первые 3 цифры после кода
        if (normalizedDigits.length >= 4) {
            formattedNumber += normalizedDigits.slice(1, 4);
        } else {
            formattedNumber += normalizedDigits.slice(1);
        }
    }

    if (normalizedDigits.length > 4) {
        formattedNumber += ' ';
        // Добавляем следующие 3 цифры
        if (normalizedDigits.length >= 7) {
            formattedNumber += normalizedDigits.slice(4, 7);
        } else {
            formattedNumber += normalizedDigits.slice(4);
        }
    }

    if (normalizedDigits.length > 7) {
        formattedNumber += ' ';
        // Добавляем оставшиеся цифры
        formattedNumber += normalizedDigits.slice(7, 11);
    }

    return formattedNumber;
};

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onBackToLogin,
                                                               }) => {
    const resetPassword = useResetPassword();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            phone_number: '+7 ',
        }
    });

    // Очищаем форму и ошибки при открытии модального окна
    React.useEffect(() => {
        if (isOpen) {
            form.reset({
                phone_number: '+7 ',
            });
            form.clearErrors();
        }
    }, [isOpen, form]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            await resetPassword.mutateAsync(data);

            toast.success('Новый пароль отправлен на ваш номер телефона в СМС', {
                position: 'top-right',
                duration: 5000,
                icon: <CheckCircle className="text-green-500" />,
            });

            // Сбрасываем форму
            form.reset();

            // Возвращаемся к окну входа
            onBackToLogin();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Произошла ошибка при сбросе пароля';

            toast.error(errorMessage, {
                position: 'top-right',
                duration: 3000,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBackToLogin}
                            className="p-1 h-8 w-8"
                        >
                            <ArrowLeft className="!size-6" />
                        </Button>
                        <DialogTitle className="text-2xl font-bold">
                            Сброс пароля
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="border-t my-2" />

                <div className="text-sm text-gray-600 mb-4">
                    Введите номер телефона, и мы отправим новый пароль в СМС
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative">
                        <Controller
                            name="phone_number"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    label="Номер телефона"
                                    className="bg-[#f3f5f6]"
                                    value={field.value}
                                    onChange={(e) => {
                                        const formattedValue = formatPhoneNumber(e.target.value);
                                        field.onChange(formattedValue);
                                    }}
                                    onBlur={field.onBlur}
                                    placeholder="+7 777 777 7777"
                                />
                            )}
                        />
                        {form.formState.errors.phone_number && (
                            <p className="mt-1 text-sm text-red-500">
                                {form.formState.errors.phone_number.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#00B834] hover:bg-[#00A02D] text-white"
                        disabled={resetPassword.isPending}
                    >
                        {resetPassword.isPending ? 'Отправляем...' : 'Отправить новый пароль'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ResetPasswordModal;
