import React from 'react';

const Detail: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full">
            {/* Welcome Section */}
            <div className="text-center mb-10 max-w-3xl">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Occasion Alerts!</h2>
                <p className="text-lg text-gray-700">
                    Never miss an important date or struggle with the perfect message again.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-10">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Create and track occasions</h3>
                            <p className="text-gray-600">
                                Add birthdays, anniversaries, graduations and other important events to your calendar.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Get timely reminders</h3>
                            <p className="text-gray-600">
                                Receive notifications before upcoming occasions so you never miss an important date.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">AI-generated messages</h3>
                            <p className="text-gray-600">
                                Get personalized message suggestions tailored to each occasion and recipient.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Send thoughtful greetings</h3>
                            <p className="text-gray-600">
                                Share your care with customized greetings that show you remembered.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Testimonial */}
            <div className="bg-gray-50 p-8 rounded-lg w-full max-w-3xl mt-8 text-center italic">
                <p className="text-lg mb-4 text-gray-700">"This app has transformed how I manage important dates. I never miss a birthday now!"</p>
                <p className="font-medium text-gray-800">— Sarah J.</p>
            </div>
        </div>
    );
};

export default Detail;