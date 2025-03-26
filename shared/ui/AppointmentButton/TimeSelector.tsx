'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';

// Интерфейс для временного слота
export interface TimeSlot {
    id: number;
    start_time: string;
    end_time?: string;
}

interface TimeSelectorProps {
    availableTimeSlots: TimeSlot[];
    selectedTimeSlot: TimeSlot | null;
    onTimeSlotSelect: (slot: TimeSlot) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
                                                              availableTimeSlots,
                                                              selectedTimeSlot,
                                                              onTimeSlotSelect
                                                          }) => {
    const [showTimeSlots, setShowTimeSlots] = useState(false);

    // Обработчик выбора временного слота
    const handleSelectTime = (slot: TimeSlot) => {
        debugger
        onTimeSlotSelect(slot);
        setShowTimeSlots(false);
    };

    return (
        <div className="grid gap-3">
            <Label>Время</Label>

            <div className="relative">
                <Input
                    readOnly
                    value={selectedTimeSlot?.start_time || ''}
                    onClick={() => setShowTimeSlots(!showTimeSlots)}
                    className="pr-10 cursor-pointer"
                    placeholder="Выберите время"
                />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {showTimeSlots && (
                <div className="border rounded-md p-3 bg-white shadow-sm max-h-[200px] overflow-y-auto">
                    {availableTimeSlots.length === 0 ? (
                        <p className="text-gray-500 text-center py-2">Нет доступных слотов на выбранную дату</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {availableTimeSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    className={`py-2 px-3 text-sm border rounded-md transition ${
                                        selectedTimeSlot?.id === slot.id
                                            ? 'border-green-600 bg-green-50 text-green-600'
                                            : 'border-gray-200 hover:border-green-600'
                                    }`}
                                    onClick={() => handleSelectTime(slot)}
                                >
                                    {slot.start_time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
