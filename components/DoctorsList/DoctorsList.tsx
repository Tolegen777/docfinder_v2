import React from 'react';
// import Image from 'next/image';
import { Button } from '../shadcn/button';
import {
    Video,
    User2,
    Home,
    // MapPin,
    // Eye,
    // Heart,
    ChevronDown,
    // CalendarDays
} from 'lucide-react';
// import doctorImage from '../../shared/assets/images/doctorCard.png';
import DoctorCard from "./DoctorCard/DoctorCard";

// const DoctorCard2 = () => {
//     return (
//         <div className="bg-white rounded-2xl p-6 shadow-sm">
//             {/* Специализации - общие для всех версий */}
//             <div className="flex flex-wrap gap-2 text-sm mb-4">
//                 <span className="text-gray-600">Онколог</span>
//                 <span className="text-gray-400">•</span>
//                 <span className="text-gray-600">Онкодерматолог</span>
//                 <span className="text-gray-400">•</span>
//                 <span className="text-green-500">Онкодерматологдиетолог</span>
//             </div>
//
//             <div className="flex flex-col md:flex-row md:gap-8">
//                 {/* Первая колонка - фото врача и рейтинг */}
//                 <div className="md:w-[200px] flex flex-col items-center">
//                     <div className="relative w-[76px] h-[76px] md:w-[108px] md:h-[108px] rounded-full overflow-hidden mb-4">
//                         <Image
//                             src={doctorImage}
//                             alt="Doctor"
//                             fill
//                             className="object-cover"
//                         />
//                     </div>
//
//                     {/* Рейтинг */}
//                     <div className="text-center mb-4">
//                         <div className="flex items-center justify-center gap-1 mb-1">
//                             {[1, 2, 3, 4].map((star) => (
//                                 <span key={star} className="text-yellow-400">★</span>
//                             ))}
//                             <span className="text-gray-300">★</span>
//                         </div>
//                         <div className="text-sm text-gray-600">
//                             82% пациентов рекомендует врача
//                         </div>
//                         <div className="text-sm text-blue-500">
//                             467 отзывов
//                         </div>
//                     </div>
//
//                     {/* Скидка (видима только в мобильной версии) */}
//                     <div className="md:hidden mb-4">
//                         <div className="inline-flex items-center px-3 py-1 bg-green-50 rounded-full">
//               <span className="text-sm">
//                 Скидка <span className="text-green-500">20%</span> на первый прием
//               </span>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Вторая колонка - информация о враче */}
//                 <div className="md:w-[300px]">
//                     <div className="mb-4">
//                         <h2 className="text-xl font-medium">
//                             Бауыржанов Бауыржан Бауыржанович
//                         </h2>
//                         <span className="text-gray-600">
//               Онкодерматологдиетолог
//             </span>
//                     </div>
//
//                     {/* Квалификации */}
//                     <div className="flex gap-2 mb-4">
//             <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
//               Стаж 20 лет
//             </span>
//                         <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
//               Высшая категория
//             </span>
//                     </div>
//
//                     {/* Скидка (видима только в десктопной версии) */}
//                     <div className="hidden md:block mb-4">
//                         <div className="inline-flex items-center px-3 py-1 bg-green-50 rounded-full">
//               <span className="text-sm">
//                 Скидка <span className="text-green-500">20%</span> на первый прием
//               </span>
//                         </div>
//                     </div>
//
//                     {/* Типы приема */}
//                     <div className="space-y-2 mb-4">
//                         <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
//                             <MapPin className="w-5 h-5 text-green-500" />
//                             <span>В клинике</span>
//                             <span className="ml-auto">
//                 <span className="text-sm line-through text-gray-400 mr-1">2000 ₸</span>
//                 <span>От 1000 ₸</span>
//               </span>
//                         </div>
//                         <div className="flex items-center gap-2 p-3">
//                             <Video className="w-5 h-5 text-green-500" />
//                             <span>Онлайн консультация</span>
//                             <span className="ml-auto">
//                 <span className="text-sm line-through text-gray-400 mr-1">2000 ₸</span>
//                 <span>От 1000 ₸</span>
//               </span>
//                         </div>
//                         <div className="flex items-center gap-2 p-3">
//                             <Home className="w-5 h-5 text-green-500" />
//                             <span>Выезд на дом</span>
//                             <span className="ml-auto">
//                 <span className="text-sm line-through text-gray-400 mr-1">2000 ₸</span>
//                 <span>От 1000 ₸</span>
//               </span>
//                         </div>
//                     </div>
//
//                     {/* Клиника */}
//                     <div className="mb-6">
//                         <div className="flex items-start gap-2">
//                             <MapPin className="w-5 h-5 text-green-500 mt-1" />
//                             <div>
//                                 <div className="text-blue-500">Эмирмед на Манаса</div>
//                                 <div className="text-sm text-gray-600">
//                                     ул.Ауэзова, 37 (угол Кабанбай Батыра), БЦ "32 Karatal", 3 этаж, Алмалинский район, Алматы
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Кнопки */}
//                     <div className="flex gap-2">
//                         <Button
//                             variant="outline"
//                             className="flex-1 gap-2"
//                         >
//                             <Eye className="w-4 h-4" />
//                             Показать номер
//                         </Button>
//                         <Button
//                             variant="outline"
//                             className="flex-1 gap-2"
//                         >
//                             <MapPin className="w-4 h-4" />
//                             На карте
//                         </Button>
//                         <Button
//                             variant="outline"
//                             className="w-10 flex items-center justify-center p-0"
//                         >
//                             <Heart className="w-4 h-4" />
//                         </Button>
//                     </div>
//                 </div>
//
//                 {/* Третья колонка - выбор времени */}
//                 <div className="flex-1 mt-6 md:mt-0">
//                     <div className="space-y-6">
//                         <h3 className="text-xl font-medium">
//                             Выберите время приёма для записи онлайн
//                         </h3>
//
//                         {/* Выбор даты - скрыт на мобильных */}
//                         <div className="hidden md:block space-y-6">
//                             {/* Выбор даты */}
//                             <div className="flex gap-4">
//                                 <Button
//                                     variant="outline"
//                                     className="flex-1 bg-white border-green-500 text-black hover:bg-white"
//                                 >
//                                     Сегодня 21.02
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     className="flex-1 bg-white hover:bg-white"
//                                 >
//                                     Завтра 22.02
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     className="flex-1 bg-white text-gray-500 hover:bg-white"
//                                 >
//                                     Пятница 22.02
//                                 </Button>
//                             </div>
//
//                             {/* Выбор времени */}
//                             <div className="space-y-4">
//                                 <div className="grid grid-cols-4 gap-2">
//                                     {['12:00', '12:15', '12:30', '12:45'].map((time) => (
//                                         <Button
//                                             key={time}
//                                             variant="outline"
//                                             className="bg-white hover:bg-white"
//                                         >
//                                             {time}
//                                         </Button>
//                                     ))}
//                                 </div>
//                                 <div className="grid grid-cols-4 gap-2">
//                                     {['13:00', '13:15', '13:30', '13:45'].map((time, index) => (
//                                         <Button
//                                             key={time}
//                                             variant="outline"
//                                             className={
//                                                 index === 1
//                                                     ? "bg-green-50 border-green-500 text-green-500 hover:bg-green-50"
//                                                     : "bg-white hover:bg-white"
//                                             }
//                                         >
//                                             {time}
//                                         </Button>
//                                     ))}
//                                 </div>
//                                 <div className="grid grid-cols-4 gap-2">
//                                     {['14:00', '14:15', '14:30', '14:45'].map((time) => (
//                                         <Button
//                                             key={time}
//                                             variant="outline"
//                                             className="bg-white hover:bg-white"
//                                         >
//                                             {time}
//                                         </Button>
//                                     ))}
//                                 </div>
//                             </div>
//
//                             <Button
//                                 variant="outline"
//                                 className="w-full flex items-center justify-center gap-2"
//                             >
//                                 <Eye className="w-4 h-4" />
//                                 Показать еще
//                             </Button>
//                         </div>
//
//                         {/* Кнопка выбора даты - видима только на мобильных */}
//                         <div className="md:hidden">
//                             <Button
//                                 variant="outline"
//                                 className="w-full flex items-center justify-center gap-2"
//                             >
//                                 <ChevronDown className="w-4 h-4" />
//                                 Выберите дату
//                             </Button>
//                         </div>
//
//                         {/* Кнопка записи */}
//                         <Button
//                             className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
//                         >
//                             <CalendarDays className="w-4 h-4" />
//                             Записаться онлайн
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Компонент фильтров
const AppointmentTypeFilters = () => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <Button
                variant="outline"
                className="flex items-center gap-2 bg-white"
            >
                <Video className="w-4 h-4" />
                Онлайн консультация
            </Button>
            <Button
                variant="outline"
                className="flex items-center gap-2 bg-white"
            >
                <User2 className="w-4 h-4" />
                Очный прием
            </Button>
            <Button
                variant="outline"
                className="flex items-center gap-2 bg-white"
            >
                <Home className="w-4 h-4" />
                Выезд на дом
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
                На карте
            </Button>
            <div className="ml-auto">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white"
                >
                    Сортировка
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

// Контейнер со списком врачей
export const DoctorsList = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            <AppointmentTypeFilters />
            <div className="space-y-4">
                <DoctorCard />
                {/* Можно добавить больше карточек */}
            </div>
        </div>
    );
};
