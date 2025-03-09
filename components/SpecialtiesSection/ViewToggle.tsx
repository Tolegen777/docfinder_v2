import { LayoutGrid, LayoutList } from 'lucide-react';
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type ViewType = 'grid' | 'list';

interface ViewOption {
    value: ViewType;
    icon: ReactNode;
    label: string;
}

interface ViewToggleProps {
    view: ViewType;
    onViewChange: (view: ViewType) => void;
}

const ViewToggleButton = ({
                              option,
                              isActive,
                              onClick,
                          }: {
    option: ViewOption;
    isActive: boolean;
    onClick: () => void;
}) => (
    <div className={cn('justify-center flex p-4 border-b border-gray-300 flex-1 items-center', isActive && 'border-primary border-b-2')}>
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2",
                isActive ? "text-primary" : "text-gray-900"
            )}
        >
            {option.icon}
            <span className="p-16-24-400">{option.label}</span>
        </button>
    </div>
);

const VIEW_OPTIONS: ViewOption[] = [
    {
        value: 'list',
        icon: <LayoutList className="w-5 h-5"/>,
        label: 'Списком'
    },
    {
        value: 'grid',
        icon: <LayoutGrid className="w-5 h-5"/>,
        label: 'Плиткой'
    }
];

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => (
    <div className={cn('flex items-center w-full md:w-max')}>
        {VIEW_OPTIONS.map(option => (
            <ViewToggleButton
                key={option.value}
                option={option}
                isActive={view === option.value}
                onClick={() => onViewChange(option.value)}
            />
        ))}
    </div>
);
