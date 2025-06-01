// shared/ui/AppointmentButton/BottomStepper.tsx
'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomStepperProps {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    stepLabels?: string[];
}

export const BottomStepper: React.FC<BottomStepperProps> = ({
                                                                currentStep,
                                                                totalSteps,
                                                                completedSteps,
                                                                stepLabels = ['Выбор времени', 'Данные пациента']
                                                            }) => {
    return (
        <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                    Шаг {currentStep} из {totalSteps}
                </span>
                <span className="text-xs text-gray-500">
                    {stepLabels[currentStep - 1]}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const isCurrent = stepNumber === currentStep;
                    const isPast = stepNumber < currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                                    isCurrent
                                        ? "bg-emerald-600 text-white shadow-lg scale-110"
                                        : isCompleted || isPast
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            {/* Connector */}
                            {index < totalSteps - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-1 rounded-full transition-all duration-300",
                                        isPast || isCompleted
                                            ? "bg-emerald-600"
                                            : "bg-gray-300"
                                    )}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
