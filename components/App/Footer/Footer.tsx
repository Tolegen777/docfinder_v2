import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

const phoneNumber = "77470000103";
const whatsappNumber = "+77009990108";

const phoneNumberFormatted = "+7 (747) 000-01-03";
const whatsappNumberFormatted = "+7 (700) 999-01-08";

export const Footer = () => {

    return (
        <footer className="bg-slate-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Контактная информация */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        {/* Телефон */}
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-green-400" />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400">Телефон</span>
                                <a
                                    href={`tel:+${phoneNumber}`}
                                    className="text-white hover:text-green-400 transition-colors font-medium"
                                >
                                    {phoneNumberFormatted}
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-green-400" />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400">WhatsApp</span>
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-green-400 transition-colors font-medium"
                                >
                                    {whatsappNumberFormatted}
                                </a>
                            </div>
                        </div>
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
    );
};
