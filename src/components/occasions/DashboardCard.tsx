import React from 'react';

interface DashboardCardProps {
    title: string;
    subtitle: string;
    value: string | number;
    icon?: React.ReactNode;
    accentColor?: string;
    onClick?: () => void;
}

export default function DashboardCard({
    title,
    subtitle,
    value,
    icon,
    accentColor = 'bg-orange-500',
    onClick
}: DashboardCardProps) {
    return (
        <div
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="p-6">
                <div className="flex items-center mb-4">
                    {icon && (
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${accentColor} text-white mr-3`}>
                            {icon}
                        </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
                <div className="flex items-end">
                    <span className="text-3xl font-bold text-gray-800">{value}</span>
                </div>
            </div>
        </div>
    );
}