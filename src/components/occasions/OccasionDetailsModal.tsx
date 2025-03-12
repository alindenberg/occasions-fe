import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Occasion } from '@/types/occasions';

interface OccasionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    occasion: Occasion | null;
    onDelete?: (id: number) => void;
    onModify?: (id: number) => void;
    onFund?: (id: number) => void;
}

export default function OccasionDetailsModal({
    isOpen,
    onClose,
    occasion,
    onDelete,
    onModify,
    onFund
}: OccasionDetailsModalProps) {
    if (!occasion) return null;

    // Format date for display
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
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-3xl mr-3">{getTypeIcon()}</span>
                                        <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                                            {occasion.label}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <div className="flex items-center mb-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getToneBadgeColor()} mr-2`}>
                                            {occasion.tone.charAt(0).toUpperCase() + occasion.tone.slice(1)}
                                        </span>
                                        {occasion.is_recurring && (
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                                                Recurring
                                            </span>
                                        )}
                                        {occasion.is_draft && (
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 ml-2">
                                                Draft
                                            </span>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div className="flex items-center text-gray-700 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(occasion.date)}</span>
                                        </div>
                                        <div className="text-sm font-medium text-orange-500">
                                            {getDaysFromNow(occasion.date)}
                                        </div>
                                    </div>

                                    {occasion.summary && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Summary:</h4>
                                            <p className="text-gray-600">{occasion.summary}</p>
                                        </div>
                                    )}

                                    {occasion.custom_input && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                                            <p className="text-gray-600">{occasion.custom_input}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    {onDelete && (occasion.is_draft || new Date(occasion.date) > new Date()) && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                onDelete(occasion.id);
                                                onClose();
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}

                                    {onFund && occasion.is_draft && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                onFund(occasion.id);
                                                onClose();
                                            }}
                                        >
                                            Fund
                                        </button>
                                    )}

                                    {onModify && (occasion.is_draft || new Date(occasion.date) > new Date()) && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                onModify(occasion.id);
                                                onClose();
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}