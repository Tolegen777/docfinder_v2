'use client'
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import ClinicConnectionModal from "@/components/ClinicConnectionModal/ClinicConnectionModal";
import {useCityStore} from "@/shared/stores/cityStore";

export const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("77470000103");
    const [whatsappNumber, setWhatsappNumber] = useState("+77009990108");
    const [phoneNumberFormatted, setPhoneNumberFormatted] = useState("+7 (747) 000-01-03");
    const [whatsappNumberFormatted, setWhatsappNumberFormatted] = useState("+7 (700) 999-01-08");

    const {currentCity} = useCityStore()

    useEffect(() => {
        if (currentCity?.title === 'Алматы') {
            setPhoneNumber("77070000103")
            setPhoneNumberFormatted("+7 (707) 000-01-03")
        } else {
            setPhoneNumber("77470000103")
            setPhoneNumberFormatted("+7 (747) 000-01-03")
        }
    }, [currentCity?.title]);

    return (
        <>
            <footer className="bg-slate-900 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Кнопка подключения клиники */}
                    <div className="mb-8 text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Подключить клинику
                        </button>
                    </div>

                    {/* Контактная информация */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            {/* Телефон */}
                            <a
                                href={`tel:+${phoneNumber}`}
                                id="footer-phone-link"
                                className="flex items-center gap-3 hover:bg-slate-800 p-3 rounded-lg transition-colors group"
                            >
                                <Phone className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400">Телефон</span>
                                    <span className="text-white group-hover:text-green-400 transition-colors font-medium">
                                        {phoneNumberFormatted}
                                    </span>
                                </div>
                            </a>

                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="footer-whatsapp-link"
                                className="flex items-center gap-3 hover:bg-slate-800 p-3 rounded-lg transition-colors group"
                            >
                                <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400">WhatsApp</span>
                                    <span className="text-white group-hover:text-green-400 transition-colors font-medium">
                                        {whatsappNumberFormatted}
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Дисклеймер */}
                    <div className="mb-8 px-4">
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <p className="text-sm text-gray-300 leading-relaxed text-center">
                                *Вся информация на сайте носит информационный характер и опубликована в целях
                                информирования пользователей о возможности оказания медицинской помощи и медицинских
                                услуг пациенту. Для постановки диагноза, выявления возможных противопоказаний и
                                назначения лечения, необходима очная консультация с врачом.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <div className="flex flex-wrap gap-4 justify-center text-gray-400 text-sm">
                            <Link href="/user-agreement" className="hover:text-white">
                                Пользовательское соглашение
                            </Link>
                            <Link href="/consent" className="hover:text-white">
                                Согласие на обработку данных
                            </Link>
                            <Link href="/support" className="hover:text-white">
                                Служба поддержки
                            </Link>
                            <Link href="/privacy" className="hover:text-white">
                                Политика конфиденциальности
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Модальное окно */}
            <ClinicConnectionModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </>
    );
};
