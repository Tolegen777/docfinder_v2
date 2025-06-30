import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Согласие на обработку данных - DocFinder",
    description: "Согласие на обработку персональных данных в системе DocFinder",
};

export default function ConsentPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-card rounded-lg shadow-sm p-8">
                    <h1 className="h2-40-56-600 text-foreground mb-8">
                        Согласие на обработку персональных данных
                    </h1>

                    <div className="space-y-6 text-muted-foreground">
                        <section>
                            <p className="p-16-24-400 leading-relaxed">
                                Используя Интернет-сервис, Пользователь соглашается с обработкой
                                персональных данных ТОО «Medical Development» (БИН: 170340030332,
                                юридический адрес: Республика Казахстан, г. Алматы, ул. Желтоксан 110,
                                индекс 050016).
                            </p>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Персональные данные, предоставляемые при записи к врачу
                            </h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>ФИО</li>
                                <li>Номер телефона</li>
                                <li>Сведения о намерении обращения к врачу</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Цели обработки персональных данных
                            </h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Записи к врачу через Интернет-сервис</li>
                                <li>Связи с Call-центром Оператора</li>
                                <li>Поддержки и консультирования по использованию Интернет-сервиса</li>
                                <li>Рассылки информационных и рекламных материалов</li>
                                <li>Улучшения работы Интернет-сервиса</li>
                                <li>Сбора отзывов и пожеланий</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Обработка персональных данных
                            </h2>
                            <p className="mb-2">Включает следующие действия:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Сбор, запись, систематизацию, накопление</li>
                                <li>Хранение в электронных базах данных на территории Республики Казахстан</li>
                                <li>Уточнение (обновление, изменение), извлечение, использование</li>
                                <li>Передачу медицинским организациям или врачам, на приём к которым записался Пользователь</li>
                                <li>Передачу сотрудникам Call-центра</li>
                                <li>Обезличивание, блокирование, удаление, уничтожение</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Хранение персональных данных
                            </h2>
                            <p>
                                Персональные данные сохраняются не дольше срока, необходимого для целей обработки.
                            </p>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Права Пользователей
                            </h2>
                            <p className="mb-2">Пользователи вправе:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Получать информацию о своих персональных данных и их обработке</li>
                                <li>Иметь бесплатный доступ к своим данным</li>
                                <li>Требовать удаления или исправления неточных, устаревших или обрабатываемых с нарушением закона данных</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="h4-20-28-600 text-foreground mb-3">
                                Контакты для обращений
                            </h2>
                            <p>
                                Электронная почта:
                                <a href="mailto:info@docfinder.kz" className="text-primary hover:underline ml-1">
                                    info@docfinder.kz
                                </a>
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="p-14-18-400 text-muted-foreground">
                            <p>ТОО «Medical Development»</p>
                            <p>БИН: 170340030332</p>
                            <p>г. Алматы, ул. Желтоксан 110, индекс 050016</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
