'use client';

import React from 'react';
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { User, Home, Calendar, Heart, Settings } from 'lucide-react';
import UserProfileEdit from "@/components/ProfilePage/UserProfileEdit";

const ProfilePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <MaxWidthLayout className="px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Сайдбар для десктопа */}
                    <div className="hidden md:block w-64 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-2">
                                <a href="/profile" className="flex items-center gap-3 p-3 rounded-md bg-green-50 text-green-600 font-medium">
                                    <User className="h-5 w-5" />
                                    <span>Мой профиль</span>
                                </a>
                                <a href="/appointments" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Calendar className="h-5 w-5" />
                                    <span>Мои записи</span>
                                </a>
                                <a href="/favorites" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Heart className="h-5 w-5" />
                                    <span>Избранное</span>
                                </a>
                                <a href="/settings" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Settings className="h-5 w-5" />
                                    <span>Настройки</span>
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Мобильные табы */}
                    <div className="md:hidden w-full mb-4">
                        <Tabs defaultValue="profile">
                            <TabsList className="w-full grid grid-cols-4">
                                <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-2">
                                    <User className="h-5 w-5" />
                                    <span className="text-xs">Профиль</span>
                                </TabsTrigger>
                                <TabsTrigger value="appointments" className="flex flex-col items-center gap-1 py-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-xs">Записи</span>
                                </TabsTrigger>
                                <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 py-2">
                                    <Heart className="h-5 w-5" />
                                    <span className="text-xs">Избранное</span>
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-2">
                                    <Settings className="h-5 w-5" />
                                    <span className="text-xs">Настройки</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <UserProfileEdit />
                            </TabsContent>

                            <TabsContent value="appointments">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold">Мои записи</h2>
                                    <p className="text-gray-500 mt-2">Здесь будут отображаться ваши записи к врачам</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="favorites">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold">Избранное</h2>
                                    <p className="text-gray-500 mt-2">Здесь будут отображаться ваши избранные клиники и врачи</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold">Настройки</h2>
                                    <p className="text-gray-500 mt-2">Настройки вашего аккаунта</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Основной контент на десктопе */}
                    <div className="flex-1 md:block hidden">
                        <UserProfileEdit />
                    </div>
                </div>
            </MaxWidthLayout>
        </div>
    );
};

export default ProfilePage;
