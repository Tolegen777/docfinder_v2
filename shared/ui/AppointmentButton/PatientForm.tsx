'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Label } from '@/components/shadcn/label';
import { Input } from '@/components/shadcn/input';
import { formatPhoneNumber, formatIIN } from '@/shared/lib/formatters';

export interface PatientFormData {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    iin_number: string;
}

interface PatientFormProps {
    formData: PatientFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAuthenticated: boolean;
    formErrors?: Record<string, string>;
}

export const PatientForm: React.FC<PatientFormProps> = ({
                                                            formData,
                                                            onInputChange,
                                                            isAuthenticated,
                                                            formErrors = {}
                                                        }) => {
    // Создаем обертку для onInputChange, которая применяет форматирование
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Создаем модифицированное событие для передачи обработчику onInputChange
        const formattedEvent = {
            ...e,
            target: {
                ...e.target,
                value: name === 'phone_number'
                    ? formatPhoneNumber(value)
                    : name === 'iin_number'
                        ? formatIIN(value)
                        : value,
                name
            }
        };

        onInputChange(formattedEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">Данные пациента</h3>

            <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center">
                    Фамилия <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={onInputChange}
                    disabled={isAuthenticated}
                    required
                    className={`${isAuthenticated ? "bg-blue-50" : ""} ${formErrors.last_name ? "border-red-500" : ""}`}
                />
                {formErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center">
                    Имя <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={onInputChange}
                    disabled={isAuthenticated}
                    required
                    className={`${isAuthenticated ? "bg-blue-50" : ""} ${formErrors.first_name ? "border-red-500" : ""}`}
                />
                {formErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="middle_name">Отчество</Label>
                <Input
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={onInputChange}
                    disabled={isAuthenticated}
                    className={isAuthenticated ? "bg-blue-50" : ""}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="iin_number" className="flex items-center">
                    ИИН <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="iin_number"
                        name="iin_number"
                        value={formData.iin_number}
                        onChange={handleInputChange}
                        disabled={isAuthenticated}
                        required
                        maxLength={12}
                        placeholder="12 цифр"
                        className={`${isAuthenticated ? "bg-blue-50" : ""} ${formErrors.iin_number ? "border-red-500" : ""}`}
                    />
                    {isAuthenticated && <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                </div>
                {formErrors.iin_number && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.iin_number}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone_number" className="flex items-center">
                    Номер телефона <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        disabled={isAuthenticated}
                        required
                        placeholder="+7 ___ ___ __ __"
                        className={`${isAuthenticated ? "bg-blue-50" : ""} ${formErrors.phone_number ? "border-red-500" : ""}`}
                    />
                    {isAuthenticated && <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                </div>
                {formErrors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone_number}</p>
                )}
                <p className="text-xs text-gray-500">На ваш телефон будет отправлен SMS код для подтверждения</p>
            </div>
        </div>
    );
};
