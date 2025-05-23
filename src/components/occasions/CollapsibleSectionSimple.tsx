import { useState, ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode;
}

export default function CollapsibleSectionSimple({ title, children }: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

                <div className="flex justify-end items-center">
                    <button
                        className="p-1 rounded-md hover:bg-gray-50 cursor-pointer"
                        aria-label={isCollapsed ? "Expand section" : "Collapse section"}
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className="transition-all duration-300 ease-in-out">
                    {children}
                </div>
            )}
        </div>
    );
}