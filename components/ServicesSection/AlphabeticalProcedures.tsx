'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

// Тип процедуры из API
interface Procedure {
    medical_procedure_id: number;
    medical_procedure_title: string;
    medical_procedure_slug: string;
}

interface AlphabeticalProceduresProps {
    procedures: Procedure[];
}

export const AlphabeticalProcedures = ({ procedures }: AlphabeticalProceduresProps) => {
    const [activeChars, setActiveChars] = useState<Record<string, boolean>>({});

    // Группируем процедуры по первой букве
    const groupedProcedures = procedures.reduce((acc, procedure) => {
        const firstChar = procedure.medical_procedure_title.charAt(0).toUpperCase();
        if (!acc[firstChar]) {
            acc[firstChar] = [];
        }
        acc[firstChar].push(procedure);
        return acc;
    }, {} as Record<string, Procedure[]>);

    // Получаем все доступные первые буквы
    const availableChars = Object.keys(groupedProcedures).sort();

    // Инициализируем активные буквы при первой загрузке
    React.useEffect(() => {
        const initialActiveChars = availableChars.reduce((acc, char) => {
            acc[char] = true;
            return acc;
        }, {} as Record<string, boolean>);

        setActiveChars(initialActiveChars);
    }, [availableChars.join(',')]);

    // Русский алфавит для навигации
    const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

    // Обработчик переключения активной буквы
    const toggleChar = (char: string) => {
        setActiveChars(prev => ({
            ...prev,
            [char]: !prev[char]
        }));
    };

    return (
        <div>
            {/* Алфавитная навигация */}
            <div className="flex flex-wrap gap-2 mb-6">
                {russianAlphabet.map((char) => (
                    <button
                        key={char}
                        onClick={() => availableChars.includes(char) && toggleChar(char)}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-md",
                            availableChars.includes(char)
                                ? activeChars[char]
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                : "bg-gray-50 text-gray-300 cursor-not-allowed"
                        )}
                        disabled={!availableChars.includes(char)}
                    >
                        {char}
                    </button>
                ))}
            </div>

            {/* Отображение процедур по активным буквам */}
            {availableChars
                .filter(char => activeChars[char])
                .map(char => (
                    <div key={char} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{char}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
                            {groupedProcedures[char].map((procedure) => (
                                <Link
                                    key={procedure.medical_procedure_id}
                                    href={`/procedure/${procedure.medical_procedure_slug}`}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <div className="flex items-center">
                                        <span>{procedure.medical_procedure_title}</span>
                                        <span className="ml-2 text-gray-400 text-sm">
                                            {/* Можно добавить количество процедур или цену */}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};
