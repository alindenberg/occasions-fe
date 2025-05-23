import { useState, useRef, useEffect } from "react";
import { OCCASION_SORTS } from "@/types/occasions";

export default function OccasionsSortDropdown({ onClick, currentSort }: { onClick: Function, currentSort: OCCASION_SORTS }) {
    const [sort, setSort] = useState(currentSort);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update local state when prop changes
    useEffect(() => {
        setSort(currentSort);
    }, [currentSort]);

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

    const handleToggleSortDirection = () => {
        let newSort: OCCASION_SORTS;

        // Toggle between ascending and descending for the current sort type
        if (sort === OCCASION_SORTS.DATE_ASCENDING) {
            newSort = OCCASION_SORTS.DATE_DESCENDING;
        } else if (sort === OCCASION_SORTS.DATE_DESCENDING) {
            newSort = OCCASION_SORTS.DATE_ASCENDING;
        } else if (sort === OCCASION_SORTS.TITLE_ASCENDING) {
            newSort = OCCASION_SORTS.TITLE_DESCENDING;
        } else if (sort === OCCASION_SORTS.TITLE_DESCENDING) {
            newSort = OCCASION_SORTS.TITLE_ASCENDING;
        } else if (sort === OCCASION_SORTS.TYPE_ASCENDING) {
            newSort = OCCASION_SORTS.TYPE_DESCENDING;
        } else if (sort === OCCASION_SORTS.TYPE_DESCENDING) {
            newSort = OCCASION_SORTS.TYPE_ASCENDING;
        } else {
            // Default case
            newSort = OCCASION_SORTS.DATE_ASCENDING;
        }

        onClick(newSort);
        setSort(newSort);
    };

    // Simple function to determine if current sort is ascending
    const isCurrentSortAscending = () => {
        return [
            OCCASION_SORTS.DATE_ASCENDING,
            OCCASION_SORTS.TITLE_ASCENDING,
            OCCASION_SORTS.TYPE_ASCENDING
        ].includes(sort);
    };

    return (
        <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="py-2 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center"
                >
                    <span className="text-gray-500 mr-1">Sort by:</span>
                    <span className="font-medium">{getSortLabel()}</span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.DATE_ASCENDING ? OCCASION_SORTS.DATE_DESCENDING : OCCASION_SORTS.DATE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.DATE_ASCENDING || sort === OCCASION_SORTS.DATE_DESCENDING
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.DATE_ASCENDING || sort === OCCASION_SORTS.DATE_DESCENDING ? (
                                    <span className="flex items-center justify-between w-full">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Date
                                        </span>
                                        {sort === OCCASION_SORTS.DATE_ASCENDING ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                            </svg>
                                        )}
                                    </span>
                                ) : (
                                    "Date"
                                )}
                            </button>
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.TITLE_ASCENDING ? OCCASION_SORTS.TITLE_DESCENDING : OCCASION_SORTS.TITLE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.TITLE_ASCENDING || sort === OCCASION_SORTS.TITLE_DESCENDING
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.TITLE_ASCENDING || sort === OCCASION_SORTS.TITLE_DESCENDING ? (
                                    <span className="flex items-center justify-between w-full">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Title
                                        </span>
                                        {sort === OCCASION_SORTS.TITLE_ASCENDING ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                            </svg>
                                        )}
                                    </span>
                                ) : (
                                    "Title"
                                )}
                            </button>
                            <button
                                onClick={() => handleSelect(sort === OCCASION_SORTS.TYPE_ASCENDING ? OCCASION_SORTS.TYPE_DESCENDING : OCCASION_SORTS.TYPE_ASCENDING)}
                                className={`block w-full text-left px-4 py-2 text-sm ${sort === OCCASION_SORTS.TYPE_ASCENDING || sort === OCCASION_SORTS.TYPE_DESCENDING
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {sort === OCCASION_SORTS.TYPE_ASCENDING || sort === OCCASION_SORTS.TYPE_DESCENDING ? (
                                    <span className="flex items-center justify-between w-full">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Type
                                        </span>
                                        {sort === OCCASION_SORTS.TYPE_ASCENDING ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                            </svg>
                                        )}
                                    </span>
                                ) : (
                                    "Type"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleToggleSortDirection}
                className="ml-2 p-2 rounded-md hover:bg-gray-50"
                aria-label={isCurrentSortAscending() ? "Sort descending" : "Sort ascending"}
            >
                {isCurrentSortAscending() ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                    </svg>
                )}
            </button>
        </div>
    );
}