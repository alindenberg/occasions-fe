import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SidebarProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    openCreateModal?: () => void;
    onToggleCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ activeFilter, onFilterChange, openCreateModal, onToggleCollapse }: SidebarProps) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleFilterClick = (filter: string) => {
        onFilterChange(filter);
    };

    // Call onToggleCollapse when isCollapsed changes
    useEffect(() => {
        if (onToggleCollapse) {
            onToggleCollapse(isCollapsed);
        }
    }, [isCollapsed, onToggleCollapse]);

    return (
        <aside className={`bg-white border-r border-gray-200 h-screen fixed top-0 left-0 pt-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex flex-col h-full">
                <div className="px-4 py-6">
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
                    >
                        {isCollapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        ) : (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="font-medium">Create Occasion</span>
                            </div>
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 mb-4">
                        <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? 'Menu' : 'Dashboard'}
                        </h2>
                    </div>

                    <nav className="space-y-1 px-2">
                        <Link
                            href="/"
                            className={`flex items-center px-3 py-3 rounded-lg transition-colors ${router.pathname === '/' && !router.query.filter
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {!isCollapsed && <span>Dashboard</span>}
                        </Link>
                    </nav>

                    <div className="px-4 mt-6 mb-4">
                        <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? 'Time' : 'Timeframes'}
                        </h2>
                    </div>

                    <nav className="space-y-1 px-2">
                        <button
                            onClick={() => handleFilterClick('all')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'all'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {!isCollapsed && <span>All Time</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('upcoming')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'upcoming'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {!isCollapsed && <span>Upcoming</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('this-week')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'this-week'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {!isCollapsed && <span>This Week</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('this-month')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'this-month'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {!isCollapsed && <span>This Month</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('past')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'past'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {!isCollapsed && <span>Past</span>}
                        </button>
                    </nav>

                    <div className="px-4 mt-6 mb-4">
                        <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? 'Type' : 'Occasion Types'}
                        </h2>
                    </div>

                    <nav className="space-y-1 px-2">
                        <button
                            onClick={() => handleFilterClick('type-all')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-all'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            {!isCollapsed && <span>All Types</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('type-birthday')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-birthday'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">🎂</span>
                            {!isCollapsed && <span>Birthday</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('type-anniversary')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-anniversary'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">💍</span>
                            {!isCollapsed && <span>Anniversary</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('type-holiday')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-holiday'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">🎄</span>
                            {!isCollapsed && <span>Holiday</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('type-graduation')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-graduation'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">🎓</span>
                            {!isCollapsed && <span>Graduation</span>}
                        </button>

                        <button
                            onClick={() => handleFilterClick('type-wedding')}
                            className={`flex items-center w-full text-left px-3 py-3 rounded-lg transition-colors ${activeFilter === 'type-wedding'
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">👰</span>
                            {!isCollapsed && <span>Wedding</span>}
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center justify-center w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isCollapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}