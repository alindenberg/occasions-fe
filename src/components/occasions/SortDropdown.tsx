import { useState } from "react";
import { OCCASION_SORTS } from "@/types/occasions";

export default function OccasionsFilterDropdown({ onClick }: { onClick: Function }) {
    const [sort, setSort] = useState(OCCASION_SORTS.DATE_DESCENDING);

    const handleSelect = (option: OCCASION_SORTS) => {
        onClick(option);
        setSort(option);
    };

    return (
        <div className="relative">
            <button
                onClick={() => handleSelect(sort === OCCASION_SORTS.DATE_DESCENDING ? OCCASION_SORTS.DATE_ASCENDING : OCCASION_SORTS.DATE_DESCENDING)}
                className="py-2 px-4 bg-gray-100 border border-orange-400 bg-white rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center"
            >
                <span className="md:text-xl font-bold">{sort === OCCASION_SORTS.DATE_DESCENDING ? 'Date ↓' : 'Date ↑'}</span>
            </button>
        </div>
    );
}