import { useState, useRef, useEffect } from "react";
import { Occasion } from "@/types/occasions";
import { useSession } from "next-auth/react";

interface OccasionTileProps {
    occasion: Occasion;
    modifyHandler: null | Function;
    deletionHandler: null | Function;
    fundHandler: null | Function;
}

export default function OccasionTile({ occasion, modifyHandler, deletionHandler, fundHandler }: OccasionTileProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFundModal, setShowFundModal] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const { data: session } = useSession();
    const deleteModalRef = useRef<HTMLDivElement>(null);
    const fundModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
                setShowDeleteModal(false);
            }
            if (fundModalRef.current && !fundModalRef.current.contains(event.target as Node)) {
                setShowFundModal(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        if (!deletionHandler) {
            return;
        }

        await deletionHandler(occasion.id);
        setShowDeleteModal(false);
    }

    const handleModify = async () => {
        if (!modifyHandler) {
            return;
        }

        await modifyHandler(occasion.id);
    }

    const handleFund = async () => {
        if (!fundHandler) {
            return;
        }

        await fundHandler(occasion.id);
        setShowFundModal(false);
    }

    const handleExpandClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSummaryExpanded(!isSummaryExpanded);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    // Get icon based on occasion type
    const getTypeIcon = () => {
        switch (occasion.type.toLowerCase()) {
            case 'birthday':
                return '🎂';
            case 'anniversary':
                return '💍';
            case 'graduation':
                return '🎓';
            case 'wedding':
                return '👰';
            case 'holiday':
                return '🎄';
            default:
                return '📅';
        }
    };

    // Get badge color based on tone
    const getToneBadgeColor = () => {
        switch (occasion.tone.toLowerCase()) {
            case 'formal':
                return 'bg-purple-100 text-purple-800';
            case 'casual':
                return 'bg-green-100 text-green-800';
            case 'sentimental':
                return 'bg-pink-100 text-pink-800';
            case 'humorous':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    // Get status badge (Upcoming or Processed)
    const getStatusBadge = () => {
        const today = new Date();
        const occasionDate = new Date(occasion.date);

        if (occasionDate >= today) {
            return (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 mr-2">
                    Upcoming
                </span>
            );
        } else {
            return (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800 mr-2">
                    Processed
                </span>
            );
        }
    };

    // Calculate days from now
    const getDaysFromNow = (dateString: string) => {
        const today = new Date();
        const occasionDate = new Date(dateString);
        const diffTime = Math.abs(occasionDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (occasionDate < today) {
            return `${diffDays} days ago`;
        } else if (occasionDate > today) {
            return `in ${diffDays} days`;
        } else {
            return 'today';
        }
    };

    return (
        <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='p-6'>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTypeIcon()}</span>
                        <h2 className='font-bold text-xl text-gray-800'>{occasion?.label ?? 'Label'}</h2>
                    </div>
                    <div className="flex items-center">
                        {!occasion.is_draft && getStatusBadge()}
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getToneBadgeColor()}`}>
                            {occasion.tone.charAt(0).toUpperCase() + occasion.tone.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center text-gray-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(occasion.date)}</span>
                    </div>
                    <div className="text-sm font-medium text-orange-500">
                        {getDaysFromNow(occasion.date)}
                    </div>
                </div>

                {occasion.is_recurring && (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Recurring
                    </div>
                )}

                {occasion.custom_input && (
                    <div className='mt-3 p-3 bg-gray-50 rounded-lg'>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Notes:</h3>
                        <p className="text-sm text-gray-600">{occasion.custom_input}</p>
                    </div>
                )}

                {occasion.summary && (
                    <div className='mt-3'>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Summary:</h3>
                        <p className="text-sm text-gray-600 italic">
                            {occasion.summary.length < 40
                                ? occasion.summary
                                : (isSummaryExpanded
                                    ? occasion.summary
                                    : occasion.summary.substring(0, 35) + "..."
                                )
                            }
                            {occasion.summary.length >= 40 && (
                                <button
                                    onClick={handleExpandClick}
                                    className="ml-1 text-orange-500 hover:text-orange-700 font-medium text-xs"
                                >
                                    {isSummaryExpanded ? 'show less' : 'show more'}
                                </button>
                            )}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-row items-center justify-end p-4 border-t border-gray-100 bg-gray-50">
                {modifyHandler && (
                    <button
                        onClick={handleModify}
                        className="flex items-center justify-center px-3 py-1.5 mr-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                )}

                {deletionHandler && (
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center justify-center px-3 py-1.5 mr-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                )}

                {occasion.is_draft && fundHandler && (
                    <button
                        onClick={() => session?.user.credits && session?.user.credits > 0 ? setShowFundModal(true) : null}
                        className={`flex items-center justify-center px-3 py-1.5 text-sm rounded-lg transition-colors ${session?.user.credits && session?.user.credits > 0
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        title={session?.user.credits && session?.user.credits > 0 ? '' : 'You must have credits to fund a draft occasion'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fund
                    </button>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div ref={deleteModalRef} className="bg-white p-6 rounded-xl mx-4 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Occasion</h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete <span className="font-medium">{occasion.label}</span>?
                            This will restore the 1 credit that was used to create it.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fund Modal */}
            {showFundModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div ref={fundModalRef} className="bg-white p-6 rounded-xl mx-4 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Fund Occasion</h2>
                        <p className="mb-6 text-gray-600">
                            This will subtract 1 credit from your account and set <span className="font-medium">{occasion.label}</span> to active.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowFundModal(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFund}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            >
                                Fund
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
