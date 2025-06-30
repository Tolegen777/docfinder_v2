'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';
import { User, Calendar, Heart, Settings, Loader2 } from 'lucide-react';
import UserProfileEdit from "@/components/ProfilePage/UserProfileEdit";
import MyVisitsPage from "@/modules/visit/ui/MyVisitsPage";

type ProfileTab = 'profile' | 'appointments' | 'favorites' | 'settings';

// Компонент с логикой useSearchParams
const ProfileContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

    // Синхронизация с URL при загрузке
    useEffect(() => {
        const activeParam = searchParams?.get('active') as ProfileTab;
        if (activeParam && ['profile', 'appointments', 'favorites', 'settings'].includes(activeParam)) {
            setActiveTab(activeParam);
        }
    }, [searchParams]);

    // Обработчик смены таба с обновлением URL
    const handleTabChange = (tab: ProfileTab) => {
        setActiveTab(tab);

        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location.href);
        if (tab === 'profile') {
            // Для дефолтного таба убираем параметр из URL
            url.searchParams.delete('active');
        } else {
            url.searchParams.set('active', tab);
        }

        router.replace(url.pathname + url.search, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <MaxWidthLayout className="px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Сайдбар для десктопа */}
                    <div className="hidden md:block w-64 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => handleTabChange('profile')}
                                    className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-green-50 text-green-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Мой профиль</span>
                                </button>
                                <button
                                    onClick={() => handleTabChange('appointments')}
                                    className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors ${
                                        activeTab === 'appointments'
                                            ? 'bg-green-50 text-green-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Мои записи</span>
                                </button>
                                {/*<button*/}
                                {/*    onClick={() => handleTabChange('favorites')}*/}
                                {/*    className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors ${*/}
                                {/*        activeTab === 'favorites'*/}
                                {/*            ? 'bg-green-50 text-green-600 font-medium'*/}
                                {/*            : 'text-gray-700 hover:bg-gray-50'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    <Heart className="h-5 w-5" />*/}
                                {/*    <span>Избранное</span>*/}
                                {/*</button>*/}
                                {/*<button*/}
                                {/*    onClick={() => handleTabChange('settings')}*/}
                                {/*    className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors ${*/}
                                {/*        activeTab === 'settings'*/}
                                {/*            ? 'bg-green-50 text-green-600 font-medium'*/}
                                {/*            : 'text-gray-700 hover:bg-gray-50'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    <Settings className="h-5 w-5" />*/}
                                {/*    <span>Настройки</span>*/}
                                {/*</button>*/}
                            </nav>
                        </div>
                    </div>

                    {/* Мобильные табы */}
                    <div className="md:hidden w-full mb-4">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="flex border-b">
                                <button
                                    onClick={() => handleTabChange('profile')}
                                    className={`flex-1 flex flex-col items-center gap-1 py-3 ${
                                        activeTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    <User className="h-5 w-5" />
                                    <span className="text-xs">Профиль</span>
                                </button>
                                <button
                                    onClick={() => handleTabChange('appointments')}
                                    className={`flex-1 flex flex-col items-center gap-1 py-3 ${
                                        activeTab === 'appointments' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-xs">Записи</span>
                                </button>
                                {/*<button*/}
                                {/*    onClick={() => handleTabChange('favorites')}*/}
                                {/*    className={`flex-1 flex flex-col items-center gap-1 py-3 ${*/}
                                {/*        activeTab === 'favorites' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    <Heart className="h-5 w-5" />*/}
                                {/*    <span className="text-xs">Избранное</span>*/}
                                {/*</button>*/}
                                {/*<button*/}
                                {/*    onClick={() => handleTabChange('settings')}*/}
                                {/*    className={`flex-1 flex flex-col items-center gap-1 py-3 ${*/}
                                {/*        activeTab === 'settings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    <Settings className="h-5 w-5" />*/}
                                {/*    <span className="text-xs">Настройки</span>*/}
                                {/*</button>*/}
                            </div>

                            <div className="p-4">
                                {activeTab === 'profile' && <UserProfileEdit />}
                                {activeTab === 'appointments' && <MyVisitsPage />}
                                {/*{activeTab === 'favorites' && (*/}
                                {/*    <div>*/}
                                {/*        <h2 className="text-xl font-semibold mb-4">Избранное</h2>*/}
                                {/*        <p className="text-gray-500">Здесь будут отображаться ваши избранные клиники и врачи</p>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/*{activeTab === 'settings' && (*/}
                                {/*    <div>*/}
                                {/*        <h2 className="text-xl font-semibold mb-4">Настройки</h2>*/}
                                {/*        <p className="text-gray-500">Настройки вашего аккаунта</p>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>

                    {/* Основной контент на десктопе */}
                    <div className="flex-1 md:block hidden">
                        {activeTab === 'profile' && <UserProfileEdit />}
                        {activeTab === 'appointments' && (
                            <div>
                                <h1 className="text-xl md:text-2xl font-semibold mb-6">Мои записи</h1>
                                <MyVisitsPage />
                            </div>
                        )}
                        {/*{activeTab === 'favorites' && (*/}
                        {/*    <div className="bg-white rounded-lg shadow-sm p-6">*/}
                        {/*        <h2 className="text-xl font-semibold">Избранное</h2>*/}
                        {/*        <p className="text-gray-500 mt-2">Здесь будут отображаться ваши избранные клиники и врачи</p>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {/*{activeTab === 'settings' && (*/}
                        {/*    <div className="bg-white rounded-lg shadow-sm p-6">*/}
                        {/*        <h2 className="text-xl font-semibold">Настройки</h2>*/}
                        {/*        <p className="text-gray-500 mt-2">Настройки вашего аккаунта</p>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
            </MaxWidthLayout>
        </div>
    );
};

// Главный компонент с Suspense
const ProfilePage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
};

export default ProfilePage;
