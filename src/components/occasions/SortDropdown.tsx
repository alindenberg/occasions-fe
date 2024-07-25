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
            <div className="inline-block" onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                <button
                    className="py-2 px-4 bg-gray-100 border border-orange-400 bg-white rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center"
                >
                    <span className="md:text-xl font-bold">{viewingDescending ? 'Date ↓' : 'Date ↑'}</span>
                    {/* <FontAwesomeIcon className="ml-2 self-center" icon={faCaretDown} /> */}
                </button>
                {isOpen && (
                    <div
                        className="absolute z-10 pt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                        onMouseLeave={handleCloseDropdown}
                    >
                        <button
                            onClick={() => handleSelect(OCCASION_SORTS.DATE_DESCENDING)}
                            className={`block w-full text-left px-4 py-2 text-gray-700 ${viewingDescending ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={viewingDescending}
                        >
                            Date ↓
                        </button>
                        <button
                            onClick={() => handleSelect(OCCASION_SORTS.DATE_ASCENDING)}
                            className={`block w-full text-left px-4 py-2 text-gray-700 ${!viewingDescending ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={!viewingDescending}
                        >
                            Date ↑
                        </button>
                    </div>
                )
                }
            </div>
        </div >
    );
}