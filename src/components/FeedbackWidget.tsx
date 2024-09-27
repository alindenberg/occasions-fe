import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
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
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback }),
            });
            if (response.ok) {
                console.log('Feedback submitted successfully');
                setFeedback('');
                setIsOpen(false);
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50" ref={widgetRef}>
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-lg p-4 w-80">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Feedback</h3>
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
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Submit Feedback
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