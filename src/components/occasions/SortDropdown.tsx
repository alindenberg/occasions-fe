import { useState, useRef, useEffect } from "react";
import { OCCASION_SORTS } from "@/types/occasions";

export default function OccasionsSortDropdown({ onClick, currentSort }: { onClick: Function, currentSort: OCCASION_SORTS }) {
    const [sort, setSort] = useState(currentSort);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option: OCCASION_SORTS) => {
        onClick(option);
        setSort(option);
        setIsOpen(false);
    };

    const getSortLabel = () => {
        if (sort === OCCASION_SORTS.DATE_ASCENDING || sort === OCCASION_SORTS.DATE_DESCENDING) {
            return "Date";
        } else if (sort === OCCASION_SORTS.TITLE_ASCENDING || sort === OCCASION_SORTS.TITLE_DESCENDING) {
            return "Title";
        } else if (sort === OCCASION_SORTS.TYPE_ASCENDING || sort === OCCASION_SORTS.TYPE_DESCENDING) {
            return "Type";
        }
        return "Date";
    };

    return (
        <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="py-2 px-4 bg-white rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center"
                >
                    <span className="font-medium">{getSortLabel()}</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.DATE_ASCENDING ? OCCASION_SORTS.DATE_DESCENDING : OCCASION_SORTS.DATE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.DATE_ASCENDING || sort === OCCASION_SORTS.DATE_DESCENDING
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.DATE_ASCENDING || sort === OCCASION_SORTS.DATE_DESCENDING ? (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Date
                                    </span>
                                ) : (
                                    "Date"
                                )}
                            </button>
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.TITLE_ASCENDING ? OCCASION_SORTS.TITLE_DESCENDING : OCCASION_SORTS.TITLE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.TITLE_ASCENDING || sort === OCCASION_SORTS.TITLE_DESCENDING
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.TITLE_ASCENDING || sort === OCCASION_SORTS.TITLE_DESCENDING ? (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Title
                                    </span>
                                ) : (
                                    "Title"
                                )}
                            </button>
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.TYPE_ASCENDING ? OCCASION_SORTS.TYPE_DESCENDING : OCCASION_SORTS.TYPE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.TYPE_ASCENDING || sort === OCCASION_SORTS.TYPE_DESCENDING
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.TYPE_ASCENDING || sort === OCCASION_SORTS.TYPE_DESCENDING ? (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Type
                                    </span>
                                ) : (
                                    "Type"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button className="ml-2 p-2 bg-white rounded-md shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
            </button>
        </div>
    );
}