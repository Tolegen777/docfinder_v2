import React from 'react';
import {Checkbox} from "@/components/shadcn/checkbox";

const CheckboxOption = ({ id, label }) => (
    <div className="flex items-center space-x-2">
        <Checkbox
            id={id}
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-green-500"
        />
        <label htmlFor={id} className="text-white cursor-pointer">
            {label}
        </label>
    </div>
);

const options = [
    { id: 'pediatrician', label: 'Детский врач' },
    { id: 'homeVisit', label: 'На дом' },
    { id: 'online', label: 'Прием онлайн' }
];

export const CheckboxGroup = () => {

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {options.map(option => (
                <CheckboxOption
                    key={option.id}
                    id={option.id}
                    label={option.label}
                />
            ))}
        </div>
    );
};
