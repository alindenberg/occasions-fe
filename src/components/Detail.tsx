import React from 'react';

const Detail: React.FC = () => {
    return (
        <div className="p-8 flex flex-col items-center bg-gray-100 border border-orange-400 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Welcome to Occasion Alerts!</h2>
            <p className="text-lg font-semibold mb-4 text-center">
                Never miss an important date or struggle with the perfect message again.
            </p>
            <ul className="list-disc list-inside mb-6 text-left">
                <li>Create and track important occasions <small>(birthdays, anniversaries, graduations, etc.)</small></li>
                <li>Receive timely reminders for upcoming events</li>
                <li>Get AI-generated messages tailored to each occasion</li>
                <li>Save time and show you care with personalized greetings</li>
            </ul>
            <p className="text-lg mb-6 text-center">
                Join now to start managing your occasions and sending thoughtful messages effortlessly!
            </p>
        </div>
    );
};

export default Detail;