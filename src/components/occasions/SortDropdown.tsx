import { useState } from "react";
import { OCCASION_FILTERS, OCCASION_SORTS } from "@/types/occasions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { on } from "events";

export default function OccasionsFilterDropdown({ onClick }: { onClick: Function }) {
    const [viewingDescending, setviewingDescending] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDropdown = () => {
        setIsOpen(true);
    };

    const handleCloseDropdown = () => {
        setIsOpen(false);
    };

    const handleSelect = (option: string) => {
        onClick(option);
        setviewingDescending(option === OCCASION_SORTS.DATE_DESCENDING);
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className="relative">
            <button
                onClick={() => handleSelect(viewingDescending ? OCCASION_SORTS.DATE_ASCENDING : OCCASION_SORTS.DATE_DESCENDING)}
                className="py-2 px-4 bg-gray-100 border border-orange-400 bg-white rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center"
            >
                <span className="md:text-xl font-bold">{viewingDescending ? 'Date ↓' : 'Date ↑'}</span>
            </button>
        </div>
    );
}