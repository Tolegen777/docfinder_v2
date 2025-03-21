'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Label } from '@/components/shadcn/label';
import { Input } from '@/components/shadcn/input';

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
}

export const PatientForm: React.FC<PatientFormProps> = ({
                                                     formData,
                                                     onInputChange,
                                                     isAuthenticated
                                                 }) => {
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
                    className={isAuthenticated ? "bg-blue-50" : ""}
                />
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
                    className={isAuthenticated ? "bg-blue-50" : ""}
                />
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
                        onChange={onInputChange}
                        disabled={isAuthenticated}
                        required
                        maxLength={12}
                        pattern="[0-9]{12}"
                        placeholder="12 цифр"
                        className={isAuthenticated ? "bg-blue-50" : ""}
                    />
                    {isAuthenticated && <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                </div>
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
                        onChange={onInputChange}
                        disabled={isAuthenticated}
                        required
                        placeholder="+7 ___ ___ __ __"
                        className={isAuthenticated ? "bg-blue-50" : ""}
                    />
                    {isAuthenticated && <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
                </div>
                <p className="text-xs text-gray-500">На ваш телефон будет отправлен SMS код для подтверждения</p>
            </div>
        </div>
    );
};
