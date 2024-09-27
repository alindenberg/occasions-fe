import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback }),
            });
            if (response.ok) {
                toast.success('Feedback submitted successfully!', {
                    className: 'bg-green-500 text-white',
                    duration: 3000,
                });
                setFeedback('');
                setIsOpen(false);
            } else {
                toast.error('Failed to submit feedback. Please try again.', {
                    className: 'bg-red-500 text-white',
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('An error occurred. Please try again later.', {
                className: 'bg-red-500 text-white',
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50" ref={widgetRef}>
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-lg p-4 w-80">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="dark:text-black text-lg font-semibold">Feedback</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback here..."
                            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none mb-4"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-700 transition-colors"
                >
                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default FeedbackWidget;