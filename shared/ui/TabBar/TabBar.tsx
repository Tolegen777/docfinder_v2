import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabOption {
    value: string;
    icon?: ReactNode;
    label: string;
}

interface TabBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: TabOption[];
    className?: string;
}

const TabButton = ({
                       tab,
                       isActive,
                       onClick,
                   }: {
    tab: TabOption;
    isActive: boolean;
    onClick: () => void;
}) => (
    <div className={cn(
        'justify-center flex p-4 border-b border-gray-300 flex-1 items-center cursor-pointer transition-colors',
        isActive && 'border-primary border-b-2'
    )}>
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 transition-colors",
                isActive ? "text-primary" : "text-gray-900"
            )}
        >
            {tab.icon}
            <span className="p-16-24-400">{tab.label}</span>
        </button>
    </div>
);

export const TabBar = ({ activeTab, onTabChange, tabs, className }: TabBarProps) => (
    <div className={cn('flex items-center w-full md:w-max', className)}>
        {tabs.map(tab => (
            <TabButton
                key={tab.value}
                tab={tab}
                isActive={activeTab === tab.value}
                onClick={() => onTabChange(tab.value)}
            />
        ))}
    </div>
);
