import React from 'react';

interface BreadcrumbItem {
    label: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
}

export const Breadcrumb = ({
                        items = [
                            { label: 'Онколог' },
                            { label: 'Онкодерматолог' },
                            { label: 'Онкодерматолог/диетолог', isActive: true }
                        ]
                    }: BreadcrumbProps) => {
    return (
        <nav className="flex items-center gap-1 p-1 flex-wrap">
            {items.map((item, index) => (
                <React.Fragment key={item.label}>
          <span
              className={`text-sm hover:text-blue-600 cursor-pointer ${
                  item.isActive ? 'text-primary' : 'text-gray-500'
              }`}
          >
            {item.label}
          </span>
                    {index < items.length - 1 && (
                        <span className="text-primary text-lg">•</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
