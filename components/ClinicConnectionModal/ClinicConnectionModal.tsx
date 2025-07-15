import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/shadcn/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import clinicImg from "@/shared/assets/images/clinicImg.png";

const ClinicConnectionModal = ({ isOpen, setIsOpen }) => {
    const [formData, setFormData] = useState({
        name: '',
        clinicName: '',
        email: '',
        city: '',
        phone: '+7'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Просто закрываем модалку как требуется
        setIsOpen(false);
        // Сброс формы
        setFormData({
            name: '',
            clinicName: '',
            email: '',
            city: '',
            phone: '+7'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                {/* Основной контейнер - flex (горизонтальный на десктопе, вертикальный на мобильном) */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Левая часть - картинка */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <Image
                            src={clinicImg}
                            alt="Иллюстрация клиники"
                            width={422}
                            height={340}
                            className="rounded-lg w-full max-w-xs md:max-w-none md:w-auto"
                        />
                    </div>

                    {/* Правая часть - весь контент */}
                    <div className="flex-1">
                        <DialogHeader className="text-center mb-6">
                            <DialogTitle className="text-xl font-semibold mb-2">
                                Подключить клинику
                            </DialogTitle>
                            <p className="text-gray-600 text-sm">(бесплатно)</p>
                        </DialogHeader>

                        {/* Форма */}
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Ваше имя *"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="bg-green-50"
                            />

                            <Input
                                type="text"
                                placeholder="Название клиники *"
                                value={formData.clinicName}
                                onChange={(e) => handleInputChange('clinicName', e.target.value)}
                                className="bg-green-50"
                            />

                            <Input
                                type="email"
                                placeholder="E-mail адрес *"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="bg-green-50"
                            />

                            <Input
                                type="text"
                                placeholder="Город *"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="bg-green-50"
                            />

                            <Input
                                type="tel"
                                placeholder="+7 ___ ___ ___"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="bg-green-50"
                            />

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Отправить заявку
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Подключение к сервису - бесплатное. Оставьте заявку<br />
                            и мы перезвоним вам в ближайшее время
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ClinicConnectionModal;
