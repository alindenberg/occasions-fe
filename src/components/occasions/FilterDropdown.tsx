import { useState } from "react";
import { OCCASION_FILTERS } from "@/types/occasions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export default function OccasionsFilterDropdown({ onClick, currentFilter }: { onClick: Function, currentFilter: string }) {
    const [filter, setFilter] = useState(currentFilter);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDropdown = () => {
        setIsOpen(true);
    };

    const handleCloseDropdown = () => {
        setIsOpen(false);
    };

    const handleSelect = (option: string) => {
        if (option === 'upcoming') {
            onClick(OCCASION_FILTERS.UPCOMING)
            setFilter(OCCASION_FILTERS.UPCOMING);
        } else if (option === 'past') {
            onClick(OCCASION_FILTERS.PAST)
            setFilter(OCCASION_FILTERS.PAST);
        } else if (option === 'draft') {
            onClick(OCCASION_FILTERS.DRAFT)
            setFilter(OCCASION_FILTERS.DRAFT);
        }
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className="relative">
            <div className="inline-block" onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                <button
                    className="py-2 px-4 bg-gray-100 border border-orange-400 bg-white rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center"
                >
                    <span className="md:text-xl font-bold">{filter === OCCASION_FILTERS.UPCOMING ? 'Upcoming occasions' : filter === OCCASION_FILTERS.PAST ? 'Past occasions' : 'Draft occasions'}</span>
                    <FontAwesomeIcon className="ml-2 self-center" icon={faCaretDown} />
                </button>
                {isOpen && (
                    <div
                        className="absolute z-10 pt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                        onMouseLeave={handleCloseDropdown}
                    >
                        <button
                            onClick={() => handleSelect('upcoming')}
                            className={`block w-full text-left px-4 py-2 text-gray-700 ${filter === OCCASION_FILTERS.UPCOMING ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={filter === OCCASION_FILTERS.UPCOMING}
                        >
                            Upcoming occasions
                        </button>
                        <button
                            onClick={() => handleSelect('past')}
                            className={`block w-full text-left px-4 py-2 text-gray-700 ${filter === OCCASION_FILTERS.PAST ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={filter === OCCASION_FILTERS.PAST}
                        >
                            Past occasions
                        </button>
                        <button
                            onClick={() => handleSelect('draft')}
                            className={`block w-full text-left px-4 py-2 text-gray-700 ${filter === OCCASION_FILTERS.DRAFT ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={filter === OCCASION_FILTERS.DRAFT}
                        >
                            Draft occasions
                        </button>
                    </div>
                )
                }
            </div>
        </div >
    );
}